import Head from 'next/head'
import { useRouter } from 'next/router'
import type { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { MDXRemote } from 'next-mdx-remote'
import type { ReactNode } from 'react'

import { Footer } from '@/components/Footer/Footer'
import { components } from '@/utils/pSEO/components'
import { SITE_URL } from '@/utils/seo'

interface ArticleProps {
  content: MDXRemoteSerializeResult<Record<string, unknown>>
  metaDataDescription: string
  pageTitle: string
}

export function Article({
  content,
  metaDataDescription,
  pageTitle,
}: ArticleProps): ReactNode {
  const { asPath } = useRouter()

  const PAGE_URL = `${SITE_URL}${asPath}`

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="title" content={pageTitle} />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:title" content={pageTitle} />
        <meta property="twitter:title" content={pageTitle} />
        <meta property="twitter:url" content={PAGE_URL} />
        <meta name="description" content={metaDataDescription} />
        <meta name="og:description" content={metaDataDescription} />
      </Head>
      <section className="bg-white px-6 pt-20 text-lg text-black md:px-0 md:py-20">
        <article className="mx-auto max-w-4xl">
          <MDXRemote {...content} components={components} />
        </article>
      </section>
      <Footer />
    </>
  )
}
