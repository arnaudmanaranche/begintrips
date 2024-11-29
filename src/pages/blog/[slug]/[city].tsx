import { PersonIcon } from '@radix-ui/react-icons'
import fs from 'fs'
import matter from 'gray-matter'
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { serialize } from 'next-mdx-remote/serialize'
import path from 'path'
import { type ReactNode } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { Button } from '@/components/Button/Button'
import { Logo } from '@/components/Logo/Logo'
import { Article } from '@/sections/Article/Article'
import { BLOG_LIST_PER_LOCALE } from '@/utils/pSEO/cities'
import { SITE_URL } from '@/utils/seo'

export default function CityPage({
  data,
}: InferGetStaticPropsType<typeof getStaticProps>): ReactNode {
  const router = useRouter()
  const intl = useIntl()

  return (
    <main>
      <Head>
        <title>
          {data.destination.replace(/-/g, ' ')} | {data.category.title} |{' '}
          {intl.formatMessage({ id: 'blogPage.metaTitle' })}
        </title>
        <meta
          name="title"
          content={`${data.destination.replace(/-/g, ' ')} | ${
            data.category.title
          } | ${intl.formatMessage({
            id: 'blogPage.metaTitle',
          })}`}
        />
        <meta
          property="og:url"
          content={`${SITE_URL}/blog/${data.category.category}/${data.destination}`}
        />
        <meta
          property="og:title"
          content={`${data.destination.replace(/-/g, ' ')} | ${
            data.category.title
          } | ${intl.formatMessage({
            id: 'blogPage.metaTitle',
          })}`}
        />
        <meta
          property="twitter:title"
          content={`${data.destination.replace(/-/g, ' ')} | ${
            data.category.title
          } | ${intl.formatMessage({
            id: 'blogPage.metaTitle',
          })}`}
        />
        <meta
          property="twitter:url"
          content={`${SITE_URL}/blog/${data.category.category}/${data.destination}`}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: `${data.destination.replace(/-/g, ' ')} | ${data.category.title}`,
              description: data.metaData.description,
              url: `${SITE_URL}/blog/${data.category.category}/${data.destination}`,
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': `${SITE_URL}/blog/${data.category.category}/${data.destination}`
              },
              about: {
                '@type': 'TouristDestination',
                name: data.destination.replace(/-/g, ' '),
                description: data.metaData.description,
                touristType: data.category.title
              },
              publisher: {
                '@type': 'Organization',
                name: 'BeginTrips',
                url: SITE_URL
              },
              inLanguage: intl.locale,
              isPartOf: {
                '@type': 'Blog',
                name: intl.formatMessage({ id: 'blogPage.metaTitle' }),
                url: `${SITE_URL}/blog`
              }
            })
          }}
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
      <Article
        content={data.content}
        metaDataDescription={data.metaData.description}
        pageTitle={`${data.destination.replace(/-/g, ' ')} | ${
          data.category.title
        }`}
      />
    </main>
  )
}

export const getStaticPaths: GetStaticPaths = async ({ locales = [] }) => {
  const paths = locales.flatMap((locale) =>
    Object.values(BLOG_LIST_PER_LOCALE[locale]).flatMap((category) =>
      category.destinations.map((destination) => ({
        params: {
          slug: category.category,
          city: destination,
        },
        locale,
      })),
    ),
  )

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps = (async ({ params, locale = 'en' }) => {
  const slug = params?.slug as string
  const city = params?.city as string

  const categoryData = BLOG_LIST_PER_LOCALE[locale].find(
    (item) => item.category === slug,
  )

  if (!categoryData) {
    return {
      notFound: true,
    }
  }

  const destinationData = categoryData.destinations.find(
    (item) => item === city,
  )

  if (!destinationData) {
    return {
      notFound: true,
    }
  }

  const filePath = path.join(process.cwd(), `assets/seo/${slug}`, `${city}.mdx`)

  const fileContent = fs.readFileSync(filePath, 'utf-8')

  const { data, content } = matter(fileContent)

  const mdxSource = await serialize(content)

  return {
    props: {
      data: {
        category: categoryData,
        destination: destinationData,
        content: mdxSource,
        metaData: data,
      },
    },
  }
}) satisfies GetStaticProps
