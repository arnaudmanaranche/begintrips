import fs from 'fs'
import matter from 'gray-matter'
import upperFirst from 'lodash.upperfirst'
import type {
  GetStaticPaths,
  GetStaticPathsResult,
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next'
import { useRouter } from 'next/router'
import type { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import path from 'path'
import { type ReactNode, useMemo } from 'react'

import { Article } from '@/sections/Article/Article'
import {
  ONE_DAY_TRIP_FROM_CITIES,
  VOYAGE_AU_DEPART_DE_CITIES,
} from '@/utils/pSEO/cities'

export default function OneDayTripFrom({
  content,
  metaData,
}: InferGetStaticPropsType<typeof getStaticProps>): ReactNode {
  const {
    query: { city },

    locale,
  } = useRouter()

  const pageTitlePrefix = useMemo(() => {
    return locale && locale === 'fr'
      ? 'Voyage au départ de'
      : 'One day trip from'
  }, [locale])

  const PAGE_TITLE = `${pageTitlePrefix} ${upperFirst(city as string)}`

  return (
    <main>
      <Article
        content={content}
        metaDataDescription={metaData.description}
        pageTitle={PAGE_TITLE}
      />
    </main>
  )
}

export const getStaticPaths = (async ({ locales }) => {
  const citiesByLocale: Record<string, string[]> = {
    en: ONE_DAY_TRIP_FROM_CITIES,
    fr: VOYAGE_AU_DEPART_DE_CITIES,
  }

  const paths: GetStaticPathsResult['paths'] = []

  locales?.forEach((locale) => {
    citiesByLocale[locale].forEach((city) => {
      paths.push({
        params: {
          city,
          slug: locale === 'en' ? 'one-day-trip-from' : 'voyage-au-depart-de',
        },
        locale,
      })
    })
  })

  return {
    paths,
    fallback: false,
  }
}) satisfies GetStaticPaths

export const getStaticProps = (async (context) => {
  const { city, slug } = context.params as { city: string; slug: string }

  const filePath = path.join(process.cwd(), `assets/seo/${slug}`, `${city}.mdx`)

  const fileContent = fs.readFileSync(filePath, 'utf-8')

  const { data, content } = matter(fileContent)

  const mdxSource = await serialize(content)

  return { props: { content: mdxSource, metaData: data } }
}) satisfies GetStaticProps<{
  content: MDXRemoteSerializeResult<Record<string, unknown>>
  metaData: Record<string, string>
}>
