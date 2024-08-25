import { getJourney } from '@/api/calls/journeys'
import { AddNewExpense } from '@/components/AddNewExpense/AddNewExpense'
import { Button } from '@/components/Button/Button'
import { Expenses } from '@/components/Expenses/Expenses'
import { UpcomingSchedule } from '@/components/UpcomingSchedule/UpcomingSchedule'
import { createClient } from '@/libs/supabase/server-props'
import type { Day, Expense, Journey } from '@/types'
import {
  groupedExpensesByCategory,
  groupedExpensesByDay,
} from '@/utils/groupe-expenses'
import type { User } from '@supabase/supabase-js'
import clsx from 'clsx'
import { differenceInDays, format } from 'date-fns'
import { type GetServerSidePropsContext } from 'next'
import { Alata } from 'next/font/google'
import Head from 'next/head'
import Image from 'next/image'
import router from 'next/router'
import { useMemo } from 'react'

const alata = Alata({ weight: '400', subsets: ['latin'] })

export interface JourneyProps {
  user: User
  journey: Journey
  days: Day[]
  expensesByDay: Record<string, Expense[]>
  expensesByCategory: Record<string, Expense[]>
}

export default function Journey({
  journey,
  expensesByCategory,
  days,
  expensesByDay,
  user,
}: JourneyProps) {
  const daysLeftBeforeJourneyBegins = useMemo(
    () => differenceInDays(new Date(journey.departureDate), new Date()),
    [journey.departureDate]
  )

  return (
    <div>
      <Head>
        <title>Planner.so</title>
      </Head>
      <nav className="flex items-center justify-between px-10 pt-6">
        <span className={clsx(alata.className, 'text-3xl')}>
          Planner
          <span className="text-accent">.so</span>
        </span>
        <div className="rounded-2xl p-4">
          <Button onClick={() => router.push('/account')}>My account</Button>
        </div>
      </nav>
      <div className="relative h-screen px-10 pt-6">
        <div className="flex flex-col space-x-0 space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
          <div className="flex flex-1 flex-col">
            <div className="max-h-full min-h-[800px] flex-1 rounded-2xl border-2 bg-white p-4">
              <div className="relative min-h-[300px]">
                {journey.image_cover ? (
                  <Image
                    className="rounded-2xl"
                    src={journey.image_cover!}
                    alt={`${journey.destination} photo`}
                    style={{
                      objectFit: 'cover',
                    }}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 w-full rounded-2xl bg-accent" />
                )}
                <div className="absolute bottom-4 left-4 flex min-h-[130px] flex-col rounded-2xl bg-white p-4 drop-shadow-md">
                  <p className={clsx(alata.className, 'text-xl')}>
                    Traveling to{' '}
                    <span className="text-accent">{journey.destination}</span>
                  </p>
                  <span>
                    {format(new Date(journey.departureDate), 'dd LLL')} -{' '}
                    {format(new Date(journey.returnDate), 'dd LLL')}
                  </span>
                </div>
              </div>
              <div className="mt-6">
                <h2
                  className={clsx(
                    alata.className,
                    'sticky top-0 bg-white pb-4 text-3xl'
                  )}
                >
                  Calendar
                </h2>
                <UpcomingSchedule
                  userId={user.id}
                  expensesByDay={expensesByDay}
                  departureDate={journey.departureDate}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-col space-y-4">
            <div
              className={clsx(
                alata.className,
                'flex flex-col justify-center space-y-3 rounded-2xl border-2 bg-white p-4'
              )}
            >
              <h1 className="text-center text-5xl leading-snug text-black">
                <span className="text-accent">
                  {daysLeftBeforeJourneyBegins}
                </span>{' '}
                {daysLeftBeforeJourneyBegins > 1 ? 'days' : 'day'} to go
              </h1>
              <AddNewExpense days={days} />
            </div>
            <div className="space-y-3 rounded-2xl border-2 bg-white p-4">
              <Expenses expenses={expensesByCategory} userId={user.id} />
            </div>
          </div>
        </div>
      </div>
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

  const { journey, expenses, days } = await getJourney({
    journeyId: context.params?.id as string,
    userId: data.user.id,
  })

  const expensesByCategory = groupedExpensesByCategory({
    expenses,
  })

  const expensesByDay = groupedExpensesByDay({
    days,
    expenses,
  })

  return {
    props: {
      user: data.user,
      journey,
      expensesByCategory,
      expensesByDay,
      days,
    },
  }
}
