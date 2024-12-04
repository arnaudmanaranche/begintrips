import { PersonIcon } from '@radix-ui/react-icons'
import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { type ReactNode } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { Button } from '@/components/Button/Button'
import { Footer } from '@/components/Footer/Footer'
import { Logo } from '@/components/Logo/Logo'
import { BLOG_LIST_PER_LOCALE } from '@/utils/pSEO/cities'
import { SITE_URL } from '@/utils/seo'

const messages = {
  title: {
    id: 'blogPage.metaTitle',
    defaultMessage: 'Begintrips | Blog',
  },
  metaDescription: {
    id: 'blogPage.metaDescription',
    defaultMessage:
      'Read our Blog to learn more about the features, tips, and tricks of Begintrips',
  },
  blogTitle: {
    id: 'blogPage.title',
    defaultMessage: 'Travel Stories & Tips',
  },
  blogSubtitle: {
    id: 'blogPage.subtitle',
    defaultMessage:
      'Discover travel insights, tips, and stories to help you plan better and travel smarter with Begintrips.',
  },
}

export default function Page({
  data,
}: InferGetStaticPropsType<typeof getStaticProps>): ReactNode {
  const router = useRouter()
  const intl = useIntl()

  return (
    <main>
      <Head>
        <title>{intl.formatMessage(messages.title)}</title>
        <meta name="title" content={intl.formatMessage(messages.title)} />
        <meta
          name="description"
          content={intl.formatMessage(messages.metaDescription)}
        />
        <meta property="og:url" content={`${SITE_URL}/blog`} />
        <meta
          property="og:title"
          content={intl.formatMessage(messages.title)}
        />
        <meta
          property="og:description"
          content={intl.formatMessage(messages.metaDescription)}
        />
        <meta
          name="twitter:title"
          content={intl.formatMessage(messages.title)}
        />
        <meta name="twitter:url" content={`${SITE_URL}/blog`} />
        <meta
          name="twitter:description"
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
      <section className="bg-accent-light/30 px-6 py-20 md:px-0">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold text-accent-dark md:text-5xl lg:text-6xl">
            <FormattedMessage
              id="blogPage.title"
              defaultMessage="Travel Stories & Tips"
            />
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
            <FormattedMessage
              id="blogPage.subtitle"
              defaultMessage="Discover travel insights, tips, and stories to help you plan better and travel smarter with Begintrips."
            />
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-16">
          {data.map(({ category, title, destinations }) => (
            <div key={category} className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold capitalize text-accent-dark">
                  {title}
                </h2>
              </div>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {destinations.map((destination) => (
                  <article
                    key={destination}
                    className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
                  >
                    <Link href={`/blog/${category}/${destination}`}>
                      <div className="flex flex-1 flex-col justify-between p-6">
                        <div className="flex-1">
                          <div className="block">
                            <h3 className="text-xl font-semibold capitalize text-gray-900 group-hover:text-accent">
                              {destination.replace(/-/g, ' ')}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
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
  data: { title: string; category: string; destinations: string[] }[]
}>
