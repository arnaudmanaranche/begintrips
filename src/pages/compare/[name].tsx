import { PersonIcon } from '@radix-ui/react-icons'
import fs from 'fs'
import matter from 'gray-matter'
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { serialize } from 'next-mdx-remote/serialize'
import path from 'path'
import { type ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'
import remarkGfm from 'remark-gfm'

import { Button } from '@/components/Button/Button'
import { Logo } from '@/components/Logo/Logo'
import { Article } from '@/sections/Article/Article'
import { COMPETITORS_NAMES, SITE_URL } from '@/utils/seo'

export default function Page({
  data,
}: InferGetStaticPropsType<typeof getStaticProps>): ReactNode {
  const router = useRouter()

  const PAGE_URL = `${SITE_URL}/compare/${router.query.name}`

  return (
    <main>
      <Head>
        <title>{data.metaData.title}</title>
        <meta name="title" content={data.metaData.title} />
        <meta property="og:title" content={data.metaData.title} />
        <meta name="twitter:title" content={data.metaData.title} />
        <meta property="og:url" content={`${PAGE_URL}`} />
        <meta name="twitter:url" content={`${PAGE_URL}`} />
        <meta name="description" content={data.metaData.description} />
        <meta name="og:description" content={data.metaData.description} />
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
      <div className="px-6 pt-20 md:px-0">
        <Article content={data.content} />
      </div>
    </main>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = COMPETITORS_NAMES.map((name) => ({
    params: {
      name,
    },
  }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps = (async ({ params }) => {
  const name = params?.name as string

  const filePath = path.join(process.cwd(), `assets/seo/compare/${name}.mdx`)

  const fileContent = fs.readFileSync(filePath, 'utf-8')

  const { data, content } = matter(fileContent)

  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
    },
  })

  return {
    props: {
      data: {
        content: mdxSource,
        metaData: data,
      },
    },
  }
}) satisfies GetStaticProps
