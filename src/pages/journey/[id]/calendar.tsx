import {
  BarChartIcon,
  CalendarIcon,
  CaretRightIcon,
  SewingPinIcon,
} from '@radix-ui/react-icons'
import type { User } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'
import { differenceInDays } from 'date-fns'
import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import router, { useRouter } from 'next/router'
import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'

import { getJourney } from '@/api/calls/journeys'
import { getUserFavoriteCategories } from '@/api/calls/users'
import { QUERY_KEYS } from '@/api/queryKeys'
import { BottomBar } from '@/components/BottomBar/BottomBar'
import { Budget } from '@/components/Budget/Budget'
import { Button } from '@/components/Button/Button'
import { CalendarApp } from '@/components/Calendar/Calendar'
import { Checklist } from '@/components/Checklist/Checklist'
import { Expenses } from '@/components/Expenses/Expenses'
import { JourneyCard } from '@/components/JourneyCard/JourneyCard'
import { Sidebar } from '@/components/Sidebar/Sidebar'
import { UpcomingSchedule } from '@/components/UpcomingSchedule/UpcomingSchedule'
import { createClient } from '@/libs/supabase/server-props'
import {
  QuickActionsModalProvider,
  useQuickActionsModalActions,
} from '@/providers/QuickActions.Provider'
import type {
  Day,
  ExpensesByCategory,
  ExpensesByDay,
  ExpensesByDay,
} from '@/types'
import { formatDate } from '@/utils/date'
import { SITE_URL } from '@/utils/seo'

interface JourneyProps {
  user: User
}

const messages = defineMessages({
  title: {
    id: 'journeyTitle',
    defaultMessage: 'My journey to {destination}',
  },
})

function JourneyView({ user }: JourneyProps): ReactNode {
  const {
    query: { id: journeyId },
  } = useRouter()
  const { setIsOpen } = useQuickActionsModalActions()
  const intl = useIntl()
  const { data, isPending: isFetchingJourney } = useQuery({
    queryKey: QUERY_KEYS.JOURNEY(journeyId as string),
    queryFn: () => getJourney({ journeyId: journeyId as string }),
    throwOnError() {
      router.replace('/my-journeys')
      return false
    },
  })

  useQuery({
    queryKey: QUERY_KEYS.USER_FAVORITE_CATEGORIES(),
    queryFn: () => getUserFavoriteCategories(),
  })

  const daysLeftBeforeJourneyBegins = useMemo(
    () =>
      differenceInDays(
        new Date(data?.journey?.departureDate as string),
        new Date()
      ) + 1,
    [data?.journey?.departureDate]
  )

  return (
    <div className="relative flex">
      <Head>
        <title>
          {intl.formatMessage(messages.title, {
            destination: data?.journey?.destination,
          })}
        </title>
        <meta
          name="title"
          content={intl.formatMessage(messages.title, {
            destination: data?.journey?.destination,
          })}
        />

        <meta property="og:url" content={`${SITE_URL}`} />
        <meta
          property="og:title"
          content={intl.formatMessage(messages.title, {
            destination: data?.journey?.destination,
          })}
        />

        <meta
          name="twitter:title"
          content={intl.formatMessage(messages.title, {
            destination: data?.journey?.destination,
          })}
        />
        <meta name="twitter:url" content={`${SITE_URL}`} />
      </Head>
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <nav className="relative hidden min-h-[70px] items-center justify-between border-b-[1px] px-10 lg:flex">
          <div>
            <h2 className="text-3xl font-thin">
              Hello,{` `}
              <span className="text-xl font-normal">
                {user.email?.split('@')[0]}
              </span>
              !
            </h2>
          </div>
          <Button onClick={() => router.push('/account')} isRounded>
            {user.email?.split('@')[0]?.slice(0, 2)}
          </Button>
        </nav>
        <CalendarApp />
      </div>
      <BottomBar />
    </div>
  )
}

export default function Journey({ user }: JourneyProps): ReactNode {
  return (
    <QuickActionsModalProvider>
      <JourneyView user={user} />
    </QuickActionsModalProvider>
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
