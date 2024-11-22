import { PersonIcon } from '@radix-ui/react-icons'
import Head from 'next/head'
import { useRouter } from 'next/router'
import type { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { MDXRemote } from 'next-mdx-remote'
import type { ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import { Button } from '@/components/Button/Button'
import { Footer } from '@/components/Footer/Footer'
import { Logo } from '@/components/Logo/Logo'
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
  const router = useRouter()
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
      <section className="pb-4">
        <div className="mx-auto flex max-w-screen-xl flex-col justify-start space-y-16 px-10 pt-10">
          <nav className="flex flex-row items-center justify-between px-10 md:space-y-0 xl:px-0">
            <Logo />
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
    </>
  )
}
