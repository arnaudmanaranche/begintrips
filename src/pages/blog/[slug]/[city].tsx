import { PersonIcon } from '@radix-ui/react-icons'
import fs from 'fs'
import matter from 'gray-matter'
import upperFirst from 'lodash.upperfirst'
import type {
  GetStaticPaths,
  GetStaticPathsResult,
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import path from 'path'
import { type ReactNode, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'

import { Button } from '@/components/Button/Button'
import { Footer } from '@/components/Footer/Footer'
import {
  ONE_DAY_TRIP_FROM_CITIES,
  VOYAGE_AU_DEPART_DE_CITIES,
} from '@/utils/pSEO/cities'
import { components } from '@/utils/pSEO/components'
import { SITE_URL } from '@/utils/seo'

export default function OneDayTripFrom({
  content,
  metaData,
}: InferGetStaticPropsType<typeof getStaticProps>): ReactNode {
  const router = useRouter()
  const {
    query: { city },
    asPath,
    locale,
  } = useRouter()

  const pageTitlePrefix = useMemo(() => {
    return locale && locale === 'fr'
      ? 'Voyage au départ de'
      : 'One day trip from'
  }, [locale])

  const PAGE_TITLE = `${pageTitlePrefix} ${upperFirst(city as string)}`
  const PAGE_URL = `${SITE_URL}${asPath}`

  return (
    <main>
      <Head>
        <title>{PAGE_TITLE}</title>
        <meta name="title" content={PAGE_TITLE} />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="twitter:title" content={PAGE_TITLE} />
        <meta property="twitter:url" content={PAGE_URL} />
        <meta name="description" content={metaData.description} />
        <meta name="og:description" content={metaData.description} />
      </Head>
      <section className="pb-4">
        <div className="mx-auto flex max-w-screen-xl flex-col justify-start space-y-16 px-10 pt-10">
          <nav className="flex flex-row items-center justify-between px-10 md:space-y-0 xl:px-0">
            <Link href="/" className="text-3xl">
              Planner
              <span className="text-accent-dark">.so</span>
            </Link>
            <Button
              onClick={() => router.push('/welcome')}
              className="hidden lg:flex"
            >
              <FormattedMessage id="menuLogin" defaultMessage="Login" />
            </Button>
            <Button
              onClick={() => router.push('/account')}
              className="flex lg:hidden"
              icon={<PersonIcon />}
              ariaLabel="My account"
            />
          </nav>
        </div>
      </section>
      <section className="bg-white px-6 pt-20 text-lg text-black md:px-0 md:py-20">
        <article className="mx-auto max-w-4xl">
          <MDXRemote {...content} components={components} />
        </article>
      </section>
      <Footer />
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
