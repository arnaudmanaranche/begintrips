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
import { type ReactNode } from 'react'

import { Article } from '@/sections/Article/Article'
import { VOYAGE_PAS_CHER } from '@/utils/pSEO/cities'

export default function Page({
  content,
  metaData,
}: InferGetStaticPropsType<typeof getStaticProps>): ReactNode {
  const {
    query: { destination },
  } = useRouter()

  const PAGE_TITLE = `Voyage pas cher ${upperFirst(destination as string)}`

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

export const getStaticPaths = (async () => {
  const paths: GetStaticPathsResult['paths'] = []

  VOYAGE_PAS_CHER.map((destination) => {
    paths.push({
      params: {
        destination,
      },
      locale: 'fr',
    })
  })

  return {
    paths,
    fallback: false,
  }
}) satisfies GetStaticPaths

export const getStaticProps = (async (context) => {
  const { destination } = context.params as { destination: string }

  const filePath = path.join(
    process.cwd(),
    `assets/seo/voyage-pas-cher`,
    `${destination}.mdx`
  )

  const fileContent = fs.readFileSync(filePath, 'utf-8')

  const { data, content } = matter(fileContent)

  const mdxSource = await serialize(content)

  return { props: { content: mdxSource, metaData: data } }
}) satisfies GetStaticProps<{
  content: MDXRemoteSerializeResult<Record<string, unknown>>
  metaData: Record<string, string>
}>
