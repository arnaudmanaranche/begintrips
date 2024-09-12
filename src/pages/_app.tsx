import '@/styles/globals.css'

import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Analytics } from '@vercel/analytics/react'
import type { AppProps } from 'next/app'
import { Open_Sans, Playfair_Display } from 'next/font/google'
import Head from 'next/head'
import type { ReactNode } from 'react'
import { useState } from 'react'

import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from '@/utils/seo'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-playfair',
  display: 'optional',
})

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-open-sans',
  display: 'optional',
})

export default function App({ Component, pageProps }: AppProps): ReactNode {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <title>{SITE_TITLE}</title>
        <meta name="title" content="Meta Tags — Preview, Edit and Generate" />
        <meta name="description" content={SITE_DESCRIPTION} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:title" content={SITE_TITLE} />
        <meta property="og:description" content={SITE_DESCRIPTION} />
        <meta
          property="og:image"
          content="https://metatags.io/images/meta-tags.png"
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={SITE_TITLE} />
        <meta property="twitter:title" content={SITE_URL} />
        <meta property="twitter:description" content={SITE_DESCRIPTION} />
        <meta
          property="twitter:image"
          content="https://metatags.io/images/meta-tags.png"
        />
      </Head>
      <HydrationBoundary state={pageProps.dehydratedState}>
        <div className={`${playfair.variable} ${openSans.variable}`}>
          <Component {...pageProps} />
        </div>
        <Analytics />
      </HydrationBoundary>
      <ReactQueryDevtools buttonPosition="top-right" />
    </QueryClientProvider>
  )
}
