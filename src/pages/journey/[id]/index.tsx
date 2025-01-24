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
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'
import { Drawer } from 'vaul'

import { getJourney } from '@/api/calls/journeys'
import { getUserFavoriteCategories } from '@/api/calls/users'
import { QUERY_KEYS } from '@/api/queryKeys'
import { Budget } from '@/components/Budget/Budget'
import { Checklist } from '@/components/Checklist/Checklist'
import { DashboardLayout } from '@/components/DashboardLayout/DashboardLayout'
import { Expenses } from '@/components/Expenses/Expenses'
import { JourneyCard } from '@/components/JourneyCard/JourneyCard'
import { createClient } from '@/libs/supabase/server-props'
import { useDrawerActions } from '@/providers/Drawer/Drawer.Provider'
import type { ExpensesByDay } from '@/types'
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

export default function Page({ user }: JourneyProps): ReactNode {
  const {
    query: { id: journeyId },
    locale,
    replace,
  } = useRouter()
  const { setIsOpen, setCurrentType } = useDrawerActions()
  const intl = useIntl()
  const { data, isPending: isFetchingJourney } = useQuery({
    queryKey: QUERY_KEYS.JOURNEY(journeyId as string),
    queryFn: () => getJourney({ journeyId: journeyId as string }),
    throwOnError() {
      replace('/my-journeys')
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
        <div className="flex flex-1 flex-col bg-white lg:rounded-l-3xl">
          <div className="relative justify-between space-y-2 px-10 py-4 lg:flex lg:flex-col">
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
                defaultMessage="{count, plural, one {{days} day left before your journey begins.} other {{days} days left before your journey begins.}}"
                values={{
                  count: daysLeftBeforeJourneyBegins,
                  days: (
                    <span className="font-medium text-primary">
                      {daysLeftBeforeJourneyBegins}
                    </span>
                  ),
                }}
              />
            </h3>
          </div>
          <div className="mb-[80px] grid h-full grid-cols-12 gap-6 px-6 xl:pb-0">
            <div className="col-span-12 space-y-4 pt-4 xl:col-span-3">
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
                      <SewingPinIcon className="text-accent h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600">Destination</span>
                      <span className="text-black">
                        {data?.journey?.destination.name}
                      </span>
                    </div>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100">
                      <Drawer.Trigger
                        className="cursor-pointer rounded bg-primary px-2 py-1 text-xs text-white"
                        onClick={() => {
                          setIsOpen(true)
                          setCurrentType('EditTrip')
                        }}
                      >
                        <FormattedMessage id="edit" defaultMessage="Edit" />
                      </Drawer.Trigger>
                    </div>
                  </div>
                  <div className="group relative flex items-center space-x-2 px-4 py-2 hover:bg-slate-100">
                    <div className="rounded-full p-2">
                      <CalendarIcon className="text-accent h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600">
                        <FormattedMessage
                          id="overviewDates"
                          defaultMessage="Dates"
                        />
                      </span>
                      <span className="capitalize text-black">
                        {data
                          ? formatDate(
                              new Date(data?.journey?.departureDate as string),
                              'dd MMM yyyy',
                              false,
                              locale
                            )
                          : ''}
                        {` - `}
                        {data
                          ? formatDate(
                              new Date(data?.journey?.returnDate as string),
                              'dd MMM yyyy',
                              false,
                              locale
                            )
                          : ''}
                      </span>
                    </div>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100">
                      <Drawer.Trigger
                        className="cursor-pointer rounded bg-primary px-2 py-1 text-xs text-white"
                        onClick={() => {
                          setIsOpen(true)
                          setCurrentType('EditTrip')
                        }}
                      >
                        <FormattedMessage id="edit" defaultMessage="Edit" />
                      </Drawer.Trigger>
                    </div>
                  </div>
                  <div className="group relative flex items-center space-x-2 px-4 py-2 hover:bg-slate-50">
                    <div className="rounded-full p-2">
                      <BarChartIcon className="text-accent h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600">Budget</span>
                      <span className="text-black">
                        {data?.journey?.budget}$
                      </span>
                    </div>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100">
                      <Drawer.Trigger
                        className="cursor-pointer rounded bg-primary px-2 py-1 text-xs text-white"
                        onClick={() => {
                          setIsOpen(true)
                          setCurrentType('EditTrip')
                        }}
                      >
                        <FormattedMessage id="edit" defaultMessage="Edit" />
                      </Drawer.Trigger>
                    </div>
                  </div>
                </div>
              </JourneyCard>
              <JourneyCard isHiddenOnSmallScreens title="Checklist">
                <Checklist />
              </JourneyCard>
            </div>
            <div className="col-span-12 rounded-lg px-2 pt-4 xl:col-span-6 xl:overflow-y-scroll">
              <div className="mx-auto grid max-w-4xl gap-6 pb-4 md:grid-cols-1">
                <div className="group relative overflow-hidden rounded-md border border-black/10">
                  {/* <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-white" /> */}
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
                  <div className="relative space-y-4 p-4">
                    <FileIcon className="h-8 w-8  text-black/80" />
                    <div className="space-y-2">
                      <h3 className="text-2xl text-black">
                        <FormattedMessage
                          id="newExpense"
                          defaultMessage="New expense"
                        />
                      </h3>
                      <p className="text-black">
                        <FormattedMessage
                          id="addExpenseDescription"
                          defaultMessage="Register a new categorized expense and add it to your
                        budget."
                        />
                      </p>
                    </div>
                    <button
                      className="absolute right-6 top-6 rounded-full bg-primary px-4 py-2 text-white shadow-sm transition-shadow hover:shadow-md"
                      onClick={() => {
                        setIsOpen(true)
                        setCurrentType('AddExpense')
                      }}
                    >
                      <FormattedMessage
                        id="addExpense"
                        defaultMessage="Add expense"
                      />
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
                  expensesByDay={data?.expensesByDay as ExpensesByDay}
                  isLoading={isFetchingJourney}
                />
              </JourneyCard>
            </div>
            <div className="col-span-12 pt-4 xl:col-span-3">
              <JourneyCard title="Budget" isFetching={isFetchingJourney}>
                <Budget
                  totalBudget={data?.journey?.budget ?? 0}
                  budgetSpent={data?.budgetSpent ?? 0}
                />
              </JourneyCard>
            </div>
          </div>
        </div>
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
