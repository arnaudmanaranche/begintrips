import type { User } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'
import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import router, { useRouter } from 'next/router'
import type { ReactNode } from 'react'
import { defineMessages, useIntl } from 'react-intl'

import { getJourney } from '@/api/calls/journeys'
import { QUERY_KEYS } from '@/api/queryKeys'
import { Calendar } from '@/components/Calendar/Calendar'
import { DashboardLayout } from '@/components/DashboardLayout/DashboardLayout'
import { createClient } from '@/libs/supabase/server-props'
import { SITE_URL } from '@/utils/seo'

const messages = defineMessages({
  title: {
    id: 'journeyTitle',
    defaultMessage: 'My journey to {destination}',
  },
})

export default function Page(): ReactNode {
  const {
    query: { id: journeyId },
  } = useRouter()
  const intl = useIntl()
  const { data, isPending: isFetchingJourney } = useQuery({
    queryKey: QUERY_KEYS.JOURNEY(journeyId as string),
    queryFn: () => getJourney({ journeyId: journeyId as string }),
    throwOnError() {
      router.replace('/my-journeys')
      return false
    },
  })

  return (
    <div className="max-h-screen">
      <Head>
        <title>
          {intl.formatMessage(messages.title, {
            destination: data?.journey?.destination.name,
          })}
        </title>
        <meta
          name="title"
          content={intl.formatMessage(messages.title, {
            destination: data?.journey?.destination.name,
          })}
        />
        <meta property="og:url" content={`${SITE_URL}`} />
        <meta
          property="og:title"
          content={intl.formatMessage(messages.title, {
            destination: data?.journey?.destination.name,
          })}
        />
        <meta
          name="twitter:title"
          content={intl.formatMessage(messages.title, {
            destination: data?.journey?.destination.name,
          })}
        />
        <meta name="twitter:url" content={`${SITE_URL}`} />
      </Head>
      <DashboardLayout>
        {isFetchingJourney || (!isFetchingJourney && !data) ? (
          <div className="flex flex-1 flex-col space-y-2 bg-white p-6">
            <div className="h-[100px] w-full animate-pulse rounded-lg bg-slate-200" />
            <div className="h-[50px] w-full animate-pulse rounded-lg bg-slate-200" />
            <div className="h-[400px] w-full animate-pulse rounded-lg bg-slate-200" />
          </div>
        ) : (
          <Calendar events={data} />
        )}
      </DashboardLayout>
    </div>
  )
}

export const getServerSideProps = (async (context) => {
  const supabase = createClient(context)

  const { data, error } = await supabase.auth.getUser()

  if (error || !data) {
    return {
      redirect: {
        destination: '/welcome',
        permanent: false,
      },
    }
  }

  return {
    props: {
      user: data.user,
    },
  }
}) satisfies GetServerSideProps<{ user: User | null }>
