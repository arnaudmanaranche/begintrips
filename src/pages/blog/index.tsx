import { PersonIcon } from '@radix-ui/react-icons'
import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { type ReactNode } from 'react'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'

import { Button } from '@/components/Button/Button'
import { Footer } from '@/components/Footer/Footer'
import { Logo } from '@/components/Logo/Logo'
import { BLOG_LIST_PER_LOCALE } from '@/utils/pSEO/cities'
import { SITE_URL } from '@/utils/seo'
import { slugify } from '@/utils/slugify'

const messages = defineMessages({
  metaTitle: {
    id: 'blogPage.metaTitle',
    defaultMessage: 'Begintrips | Blog',
  },
  metaDescription: {
    id: 'blogPage.metaDescription',
    defaultMessage:
      'Read our Blog to learn more about the features, tips, and tricks of Begintrips',
  },
})

export default function Page({
  data,
}: InferGetStaticPropsType<typeof getStaticProps>): ReactNode {
  const router = useRouter()
  const intl = useIntl()

  return (
    <main>
      <Head>
        <title>{intl.formatMessage(messages.metaTitle)}</title>
        <meta name="title" content={intl.formatMessage(messages.metaTitle)} />
        <meta
          name="description"
          content={intl.formatMessage(messages.metaDescription)}
        />
        <meta property="og:url" content={`${SITE_URL}/blog`} />
        <meta
          property="og:title"
          content={intl.formatMessage(messages.metaTitle)}
        />
        <meta
          property="og:description"
          content={intl.formatMessage(messages.metaDescription)}
        />
        <meta
          property="twitter:title"
          content={intl.formatMessage(messages.metaTitle)}
        />
        <meta property="twitter:url" content={`${SITE_URL}/blog`} />
        <meta
          property="twitter:description"
          content={intl.formatMessage(messages.metaDescription)}
        />
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
        <div className="mx-auto max-w-4xl space-y-10">
          <h1 className="text-5xl text-accent-dark">
            <FormattedMessage id="blog" defaultMessage="Blog" />
          </h1>
          {data.map((list) => (
            <div key={list.category} className="space-y-8">
              <h2 className="text-3xl capitalize">{list.category}</h2>
              <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {list.destinations.map((destination) => (
                  <li className="capitalize" key={destination}>
                    <Link
                      prefetch={false}
                      href={`blog/${slugify(list.category)}-${destination}`}
                    >
                      {destination}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  )
}

export const getStaticProps = (async (context) => {
  const locale = context.locale as string

  return { props: { data: BLOG_LIST_PER_LOCALE[locale] } }
}) satisfies GetStaticProps<{
  data: { category: string; destinations: string[] }[]
}>
