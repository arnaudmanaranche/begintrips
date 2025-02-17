import { PersonIcon } from '@radix-ui/react-icons'
import fs from 'fs'
import matter from 'gray-matter'
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { serialize } from 'next-mdx-remote/serialize'
import path from 'path'
import { type ReactNode } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { Button } from '@/components/Button/Button'
import { Logo } from '@/components/Logo/Logo'
import { Article } from '@/sections/Article/Article'
import { capitalizeFirstLetter } from '@/utils/capitalize-first-letter'
import { BLOG_LIST_PER_LOCALE } from '@/utils/pSEO/cities'
import { SITE_URL } from '@/utils/seo'

export default function CityPage({
  data,
}: InferGetStaticPropsType<typeof getStaticProps>): ReactNode {
  const router = useRouter()
  const intl = useIntl()

  const PAGE_TITLE = `${data.category.title} ${capitalizeFirstLetter(data.destination.replace(/-/g, ' '))}`
  const PAGE_URL = `${SITE_URL}/blog/${data.category.category}/${data.destination}`

  return (
    <main>
      <Head>
        <title>{PAGE_TITLE}</title>
        <meta name="title" content={PAGE_TITLE} />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta property="og:url" content={PAGE_URL} />
        <meta name="twitter:url" content={PAGE_URL} />
        <meta name="description" content={data.metaData.description} />
        <meta name="og:description" content={data.metaData.description} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: `${data.destination.replace(/-/g, ' ')} | ${data.category.title}`,
              description: data.metaData.description,
              url: PAGE_URL,
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': PAGE_URL,
              },
              about: {
                '@type': 'TouristDestination',
                name: data.destination.replace(/-/g, ' '),
                description: data.metaData.description,
                touristType: data.category.title,
              },
              publisher: {
                '@type': 'Organization',
                name: 'Begintrips',
                url: SITE_URL,
              },
              isPartOf: {
                '@type': 'Blog',
                name: intl.formatMessage({
                  id: 'blogPage.metaTitle',
                  defaultMessage: 'Blog',
                }),
                url: `${SITE_URL}/blog`,
              },
              datePublished: data.metaData.datePublished,
              dateModified: data.metaData.dateModified,
            }),
          }}
        />
      </Head>
      <section className="pb-4">
        <div className="mx-auto flex max-w-screen-xl flex-col justify-start space-y-16 px-10 pt-10">
          <nav className="flex flex-row items-center justify-between px-10 md:space-y-0 xl:px-0">
            <Logo isBlack />
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
      <div className="mx-auto flex max-w-4xl space-x-1 px-6 pt-20 md:px-0">
        <Link href="/blog" locale={router.locale} className="hover:underline">
          <FormattedMessage id="blog" defaultMessage="Blog" />
        </Link>
        <span className="text-gray-700">/ {data.category.title} /</span>
        <span className="capitalize text-gray-700">{data.destination}</span>
      </div>
      <Article content={data.content} />
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
      }))
    )
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
    (item) => item.category === slug
  )

  if (!categoryData) {
    return {
      notFound: true,
    }
  }

  const destinationData = categoryData.destinations.find(
    (item) => item === city
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
