import type { User } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'
import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import router, { useRouter } from 'next/router'
import type { ReactNode } from 'react'

import { getJourney } from '@/api/calls/journeys'
import { QUERY_KEYS } from '@/api/queryKeys'
import { Calendar } from '@/components/Calendar/Calendar'
import { DashboardLayout } from '@/components/DashboardLayout/DashboardLayout'
import { createClient } from '@/libs/supabase/server-props'
import { useSiteTitle } from '@/utils/seo'

export default function Page(): ReactNode {
  const {
    query: { id: journeyId },
  } = useRouter()
  const title = useSiteTitle()
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
        <title>{title}</title>
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
