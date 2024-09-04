import {
  getJourney,
  getJourneyBudgetSpent,
  getJourneyDays,
} from '@/api/calls/journeys'
import { QUERY_KEYS } from '@/api/queryKeys'
import { AISuggest } from '@/components/AISuggest/AISugges'
import { BottomBar } from '@/components/BottomBar/BottomBar'
import { Budget } from '@/components/Budget/Budget'
import { Button } from '@/components/Button/Button'
import { Checklist } from '@/components/Checklist/Checklist'
import { Expenses } from '@/components/Expenses/Expenses'
import { JourneyCard } from '@/components/JourneyCard/JourneyCard'
import { SearchEvents } from '@/components/SearchEvents/SearchEvents'
import { Sidebar } from '@/components/Sidebar/Sidebar'
import { UpcomingSchedule } from '@/components/UpcomingSchedule/UpcomingSchedule'
import { createClient } from '@/libs/supabase/server-props'
import { useQuickActionsModalActions } from '@/providers/QuickActions.Provider'
import type { Day, Journey } from '@/types'
import { formatDate } from '@/utils/date'
import {
  BarChartIcon,
  CalendarIcon,
  CaretRightIcon,
  SewingPinIcon,
} from '@radix-ui/react-icons'
import type { User } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'
import { differenceInDays } from 'date-fns'
import { type GetServerSidePropsContext } from 'next'
import { useParams } from 'next/navigation'
import router from 'next/router'
import { useMemo } from 'react'

export interface JourneyProps {
  user: User
}

export default function Journey({ user }: JourneyProps) {
  const { id: journeyId } = useParams()
  const { setIsOpen } = useQuickActionsModalActions()

  const { data: days, isFetching: isFetchingDays } = useQuery({
    queryKey: QUERY_KEYS.JOURNEY_DAYS(journeyId as string),
    queryFn: () => getJourneyDays({ journeyId: journeyId as string }),
  })

  const { data, isFetching: isFetchingJourney } = useQuery({
    queryKey: QUERY_KEYS.JOURNEY(journeyId as string),
    queryFn: () => getJourney({ journeyId: journeyId as string }),
  })

  const { data: budgetSpent, isFetching: isFetchingBudget } = useQuery({
    queryKey: QUERY_KEYS.JOURNEY_BUDGET_SPENT(journeyId as string),
    queryFn: () => getJourneyBudgetSpent({ journeyId: journeyId as string }),
  })

  const daysLeftBeforeJourneyBegins = useMemo(
    () =>
      differenceInDays(
        new Date(data?.journey.departureDate as string),
        new Date()
      ) + 1,
    [data?.journey.departureDate]
  )

  return (
    <div className="relative flex">
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
          {isFetchingJourney || isFetchingDays ? null : (
            <SearchEvents
              journey={data?.journey as Journey}
              days={days as Day[]}
            />
          )}
          <Button onClick={() => router.push('/account')} isRounded>
            {user.email?.split('@')[0]?.slice(0, 2)}
          </Button>
        </nav>
        <div className="grid h-full grid-cols-12 gap-6 bg-gray-50 px-6 lg:pb-0">
          <div className="col-span-12 space-y-4 pt-4 lg:col-span-3">
            <JourneyCard
              title="Quick action"
              isHiddenOnSmallScreens
              isFetching={isFetchingDays || isFetchingJourney}
            >
              <div className="flex" onClick={() => setIsOpen(true)}>
                <div className="flex-1 cursor-pointer rounded-md bg-gray-50 p-4 text-black/50 outline-none transition-all">
                  I want to...
                </div>
                <button className="rounded-r-lg bg-accent text-white">
                  <CaretRightIcon height={20} width={20} />
                </button>
              </div>
            </JourneyCard>
            <AISuggest />
            <JourneyCard title="Budget" isFetching={isFetchingBudget}>
              <Budget
                totalBudget={data?.journey.budget ?? 0}
                budgetSpent={budgetSpent}
              />
            </JourneyCard>
            <JourneyCard isHiddenOnSmallScreens title="Checklist">
              <Checklist />
            </JourneyCard>
          </div>
          <div className="col-span-12 rounded-lg px-2 lg:col-span-6 lg:h-screen lg:overflow-y-auto">
            <div className="flex justify-center p-4">
              <h1 className="flex  items-baseline space-x-4 text-6xl leading-snug text-black lg:text-7xl">
                {isFetchingJourney ? (
                  <div className="h-[20px] w-full animate-pulse rounded-lg bg-slate-200" />
                ) : (
                  <>
                    <span className="font-serif text-8xl text-accent">
                      {daysLeftBeforeJourneyBegins < 0
                        ? '0'
                        : daysLeftBeforeJourneyBegins}
                    </span>
                    <span className="font-serif">
                      {daysLeftBeforeJourneyBegins > 1 ? 'days' : 'day'} to go
                    </span>
                  </>
                )}
              </h1>
            </div>
            <div className="mb-4 space-y-10 rounded-lg p-4">
              <h3 className="mb-2 text-3xl">Overview</h3>
              {isFetchingJourney || !data ? (
                'loading'
              ) : (
                <div className="flex flex-col space-y-6 lg:flex-row lg:items-center lg:space-x-10 lg:space-y-0">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-full bg-slate-200 p-2">
                      <SewingPinIcon className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600">Destination</span>
                      <span className="text-black">
                        {data?.journey.destination}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="rounded-full bg-slate-200 p-2">
                      <CalendarIcon className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600">
                        Departure date
                      </span>
                      <span className="text-black">
                        {formatDate(
                          new Date(data.journey.departureDate),
                          'dd MMMM yyyy',
                          false
                        )}
                        {` `}-{' '}
                        {formatDate(
                          new Date(data.journey.returnDate),
                          'dd MMMM yyyy',
                          false
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
            <JourneyCard title="Expenses" isFetching={isFetchingJourney}>
              <Expenses />
            </JourneyCard>
          </div>
          <div className="col-span-12 pt-4 lg:col-span-3">
            <JourneyCard
              title="Events by day"
              isFetching={isFetchingJourney || !data}
            >
              <UpcomingSchedule
                departureDate={data?.journey.departureDate as string}
              />
            </JourneyCard>
          </div>
        </div>
      </div>
      <BottomBar />
    </div>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
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
}
