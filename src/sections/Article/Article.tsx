import type { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { MDXRemote } from 'next-mdx-remote'
import type { ReactNode } from 'react'

import { Footer } from '@/components/Footer/Footer'
import { components } from '@/utils/pSEO/components'

interface ArticleProps {
  content: MDXRemoteSerializeResult<Record<string, unknown>>
}

export function Article({ content }: ArticleProps): ReactNode {
  return (
    <>
      <section className="bg-white px-6 text-lg text-black md:px-0 md:py-20">
        <article className="mx-auto max-w-4xl">
          <MDXRemote {...content} components={components} />
        </article>
      </section>
      <Footer />
    </>
  )
}
