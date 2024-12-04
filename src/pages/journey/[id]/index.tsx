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
import type { Day, ExpensesByCategory, ExpensesByDay } from '@/types'
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
        <div className="mb-[80px] grid h-full grid-cols-12 gap-6 bg-gray-50 px-6 lg:pb-0">
          <div className="col-span-12 space-y-4 pt-4 lg:col-span-3">
            <JourneyCard
              title={
                <FormattedMessage
                  id="quickAction"
                  defaultMessage="Quick action"
                />
              }
              isHiddenOnSmallScreens
              isFetching={isFetchingJourney}
            >
              <div className="flex" onClick={() => setIsOpen(true)}>
                <div className="flex-1 cursor-pointer rounded-md bg-gray-50 p-4 text-black/50 outline-none transition-all">
                  <FormattedMessage
                    id="iWantTo"
                    defaultMessage="I want to..."
                  />
                </div>
                <button className="rounded-r-lg bg-accent text-white">
                  <CaretRightIcon height={20} width={20} />
                </button>
              </div>
            </JourneyCard>
            <JourneyCard title="Budget" isFetching={isFetchingJourney}>
              <Budget
                totalBudget={data?.journey?.budget ?? 0}
                budgetSpent={data?.budgetSpent ?? 0}
              />
            </JourneyCard>
            <JourneyCard isHiddenOnSmallScreens title="Checklist">
              <Checklist />
            </JourneyCard>
          </div>
          <div className="col-span-12 rounded-lg px-2 lg:col-span-6 lg:h-screen lg:overflow-y-auto">
            <div className="flex justify-center p-4">
              {isFetchingJourney ? (
                <div className="h-[80px] w-full animate-pulse rounded-lg bg-slate-200" />
              ) : (
                <h1 className="flex w-full items-baseline justify-center space-x-4 text-6xl leading-snug text-black lg:text-7xl">
                  <span className="font-serif text-8xl text-accent">
                    {daysLeftBeforeJourneyBegins < 0
                      ? '0'
                      : daysLeftBeforeJourneyBegins}
                  </span>
                  <span className="font-serif">
                    <FormattedMessage
                      id="journeyBegins"
                      defaultMessage="{count, plural, one {day to go} other {days to go}}"
                      values={{
                        count: daysLeftBeforeJourneyBegins,
                      }}
                    />
                  </span>
                </h1>
              )}
            </div>
            <div className="mb-4 space-y-10 rounded-lg p-4">
              <h3 className="mb-2 text-3xl">
                <FormattedMessage id="overview" defaultMessage="Overview" />
              </h3>
              {isFetchingJourney || !data ? (
                <div className="flex flex-col space-y-6 lg:flex-row lg:items-center lg:space-x-10 lg:space-y-0">
                  <div className="h-[20px] w-[100px] animate-pulse rounded-lg bg-slate-200" />
                  <div className="h-[20px] w-[100px] animate-pulse rounded-lg bg-slate-200" />
                  <div className="h-[20px] w-[100px] animate-pulse rounded-lg bg-slate-200" />
                </div>
              ) : (
                <div className="flex flex-col space-y-6 lg:flex-row lg:items-center lg:space-x-10 lg:space-y-0">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-full bg-slate-200 p-2">
                      <SewingPinIcon className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600">Destination</span>
                      <span className="text-black">
                        {data?.journey?.destination}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="rounded-full bg-slate-200 p-2">
                      <CalendarIcon className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600">
                        <FormattedMessage
                          id="overviewDates"
                          defaultMessage="Dates"
                        />
                      </span>
                      <span className="capitalize text-black">
                        {formatDate(
                          new Date(data.journey.departureDate),
                          'dd MMMM yyyy',
                          false,
                          router.locale
                        )}
                        {` `}-{' '}
                        {formatDate(
                          new Date(data.journey.returnDate),
                          'dd MMMM yyyy',
                          false,
                          router.locale
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="rounded-full bg-slate-200 p-2">
                      <BarChartIcon className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600">Budget</span>
                      <span className="text-black">{data.journey.budget}$</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <JourneyCard
              title={
                <FormattedMessage id="expenses" defaultMessage="Expenses" />
              }
              isFetching={isFetchingJourney}
            >
              <Expenses
                expensesByCategory={
                  data?.expensesByCategory as ExpensesByCategory
                }
                isLoading={isFetchingJourney}
              />
            </JourneyCard>
          </div>
          <div className="col-span-12 pt-4 lg:col-span-3">
            <JourneyCard
              title={
                <FormattedMessage
                  id="eventsByDay"
                  defaultMessage="Events by day"
                />
              }
              isFetching={isFetchingJourney || !data}
            >
              <UpcomingSchedule
                departureDate={data?.journey?.departureDate as string}
                expensesByDay={data?.expensesByDay as ExpensesByDay}
                isLoading={isFetchingJourney}
                days={data?.days as Day[]}
              />
            </JourneyCard>
          </div>
        </div>
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
