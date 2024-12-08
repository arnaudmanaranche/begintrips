import {
  BarChartIcon,
  CalendarIcon,
  FileIcon,
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
import { Checklist } from '@/components/Checklist/Checklist'
import { Expenses } from '@/components/Expenses/Expenses'
import { JourneyCard } from '@/components/JourneyCard/JourneyCard'
import { Sidebar } from '@/components/Sidebar/Sidebar'
import { createClient } from '@/libs/supabase/server-props'
import {
  QuickActionsModalProvider,
  useQuickActionsModalActions,
} from '@/providers/QuickActions.Provider'
import type { ExpensesByDay } from '@/types'
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
      <div className="m-2 flex flex-1 flex-col rounded-md border-[1px] bg-white">
        <div className="relative hidden justify-between space-y-2 px-10 py-4 lg:flex lg:flex-col">
          <h2 className="text-4xl font-thin">
            <FormattedMessage
              id="greeting"
              defaultMessage="Have a nice day, {name}!"
              values={{ name: user.email?.split('@')[0] }}
            />
          </h2>
          <h3 className="text-3xl font-thin">
            <FormattedMessage
              id="daysLeftBeforeJourneyBegins"
              defaultMessage="{days} days left before your journey begins."
              values={{
                days: (
                  <span className="font-bold text-accent">
                    {daysLeftBeforeJourneyBegins}
                  </span>
                ),
              }}
            />
          </h3>
        </div>
        <div className="mb-[80px] grid h-full grid-cols-12 gap-6 px-6 lg:pb-0">
          <div className="col-span-12 space-y-4 pt-4 lg:col-span-3">
            <JourneyCard
              title={
                <FormattedMessage
                  id="myTripOverview"
                  defaultMessage="My trip overview"
                />
              }
              isFetching={isFetchingJourney}
            >
              <div className="flex flex-col">
                <div className="group relative flex items-center space-x-2 px-4 py-2 hover:bg-slate-50">
                  <div className="rounded-full p-2">
                    <SewingPinIcon className="h-5 w-5 text-accent" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600">Destination</span>
                    <span className="text-black">
                      {data?.journey?.destination}
                    </span>
                  </div>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="rounded bg-accent px-2 py-1 text-xs text-white">
                      Edit
                    </div>
                  </div>
                </div>
                <div className="group relative flex items-center space-x-2 px-4 py-2 hover:bg-slate-50">
                  <div className="rounded-full p-2">
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
                      {/* {formatDate(
                        new Date(data?.journey?.departureDate as string),
                        'dd MMMM yyyy',
                        false,
                        router?.locale
                      )}
                      {` `}-{' '}
                      {formatDate(
                        new Date(data?.journey?.returnDate as string),
                        'dd MMMM yyyy',
                        false,
                        router?.locale
                      )} */}
                    </span>
                  </div>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="rounded bg-accent px-2 py-1 text-xs text-white">
                      Edit
                    </div>
                  </div>
                </div>
                <div className="group relative flex items-center space-x-2 px-4 py-2 hover:bg-slate-50">
                  <div className="rounded-full p-2">
                    <BarChartIcon className="h-5 w-5 text-accent" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600">Budget</span>
                    <span className="text-black">{data?.journey?.budget}$</span>
                  </div>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="rounded bg-accent px-2 py-1 text-xs text-white">
                      Edit
                    </div>
                  </div>
                </div>
              </div>
            </JourneyCard>
            <JourneyCard isHiddenOnSmallScreens title="Checklist">
              <Checklist />
            </JourneyCard>
          </div>
          <div className="col-span-12 rounded-lg px-2 pt-4 lg:col-span-6 lg:h-screen lg:overflow-y-auto">
            <div className="flex justify-center">
              {/* {isFetchingJourney ? (
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
              )} */}
            </div>
            <div className="mx-auto grid max-w-4xl gap-6 pb-4 md:grid-cols-1">
              <div className="group relative overflow-hidden rounded-md">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-50" />
                <div className="absolute inset-0 opacity-50">
                  <div className="absolute right-12 top-4 text-2xl text-purple-200">
                    ✧
                  </div>
                  <div className="absolute right-24 top-12 text-xl text-purple-200">
                    ✦
                  </div>
                  <div className="absolute right-16 top-20 text-lg text-purple-200">
                    ✧
                  </div>
                </div>
                <div className="relative space-y-4 p-6">
                  <FileIcon className="h-8 w-8 text-accent" />
                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold text-accent">
                      New Expense
                    </h3>
                    <p className="text-gray-500">
                      Register a new categorized expense and add it to your
                      budget
                    </p>
                  </div>
                  <button className="absolute right-6 top-6 rounded-full bg-white px-4 py-2 text-blue-600 shadow-sm transition-shadow hover:shadow-md">
                    Add
                  </button>
                </div>
              </div>
            </div>
            <JourneyCard
              title={
                <FormattedMessage
                  id="expensesByDay"
                  defaultMessage="Expenses by day"
                />
              }
              isFetching={isFetchingJourney}
            >
              <Expenses
                expensesByCategory={data?.expensesByDay as ExpensesByDay}
                isLoading={isFetchingJourney}
              />
            </JourneyCard>
          </div>
          <div className="col-span-12 pt-4 lg:col-span-3">
            <JourneyCard title="Budget" isFetching={isFetchingJourney}>
              <Budget
                totalBudget={data?.journey?.budget ?? 0}
                budgetSpent={data?.budgetSpent ?? 0}
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
