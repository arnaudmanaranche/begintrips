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
import type { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import path from 'path'
import type {
  ClassAttributes,
  HTMLAttributes,
  JSX,
  LiHTMLAttributes,
  ReactNode,
} from 'react'
import { FormattedMessage } from 'react-intl'

import { Button } from '@/components/Button/Button'
import { Footer } from '@/components/Footer/Footer'
import { ONE_DAY_TRIP_FROM_CITIES } from '@/utils/pSEO/cities'
import { SITE_URL } from '@/utils/seo'

const PromotionSection = () => {
  const router = useRouter()

  return (
    <div className="my-10 flex flex-col items-center space-y-10 rounded-md bg-accent-light/40 p-6">
      <div className="flex flex-col items-center space-y-4 text-3xl">
        <p>Take the Stress Out of Travel</p>
        <p>Simplify your Journey with Planner.so</p>
      </div>
      <Button
        onClick={() => {
          router.push('/welcome')
        }}
      >
        Sign up for free
      </Button>
    </div>
  )
}

const components = {
  PromotionSection,
  h1: (
    props: JSX.IntrinsicAttributes &
      ClassAttributes<HTMLHeadingElement> &
      HTMLAttributes<HTMLHeadingElement>
  ) => <h1 className="text-center text-5xl leading-normal" {...props} />,
  h2: (
    props: JSX.IntrinsicAttributes &
      ClassAttributes<HTMLHeadingElement> &
      HTMLAttributes<HTMLHeadingElement>
  ) => <h2 className="my-4 text-3xl text-accent-dark" {...props} />,
  h3: (
    props: JSX.IntrinsicAttributes &
      ClassAttributes<HTMLHeadingElement> &
      HTMLAttributes<HTMLHeadingElement>
  ) => <h2 className="my-4 text-xl" {...props} />,
  p: (
    props: JSX.IntrinsicAttributes &
      ClassAttributes<HTMLParagraphElement> &
      HTMLAttributes<HTMLParagraphElement>
  ) => <p className="my-6 line-clamp-6 text-base" {...props} />,
  ul: (
    props: JSX.IntrinsicAttributes &
      ClassAttributes<HTMLUListElement> &
      HTMLAttributes<HTMLUListElement>
  ) => <ul className="list-inside list-disc" {...props} />,
  li: (
    props: JSX.IntrinsicAttributes &
      ClassAttributes<HTMLLIElement> &
      LiHTMLAttributes<HTMLLIElement>
  ) => <li className="text-base" {...props} />,
}

export default function OneDayTripFrom({
  content,
  metaData,
}: InferGetStaticPropsType<typeof getStaticProps>): ReactNode {
  const router = useRouter()
  const {
    query: { city },
    asPath,
  } = useRouter()

  const PAGE_TITLE = `One day trip from ${city}`
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

export const getStaticPaths = (async () => {
  const paths = ONE_DAY_TRIP_FROM_CITIES.map((city) => ({
    params: {
      city,
    },
  }))

  return {
    paths,
    fallback: false,
  }
}) satisfies GetStaticPaths

export const getStaticProps = (async (context) => {
  const { city } = context.params as { city: string }

  const filePath = path.join(
    process.cwd(),
    'assets/seo',
    `one-day-trip-from-${city}.mdx`
  )

  const fileContent = fs.readFileSync(filePath, 'utf-8')

  const { data, content } = matter(fileContent)

  const mdxSource = await serialize(content)

  return { props: { content: mdxSource, metaData: data } }
}) satisfies GetStaticProps<{
  content: MDXRemoteSerializeResult<Record<string, unknown>>
  metaData: Record<string, string>
}>
