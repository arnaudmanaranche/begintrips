import { addDays } from 'date-fns'
import { useRouter } from 'next/router'
import { type ReactNode } from 'react'

import { ExpenseLabel } from '@/components/ExpenseLabel/ExpenseLabel'
import { useQuickActionsModalActions } from '@/providers/QuickActions.Provider'
import type { DateString, Day, ExpensesByDay } from '@/types'
import { formatDate } from '@/utils/date'
import { hasJourneyPassed } from '@/utils/has-journey-passed'

import { EditExpense } from '../EditExpense/EditExpense'

interface UpcomingScheduleProps {
  departureDate: string
  expensesByDay: ExpensesByDay
  isLoading: boolean
  days: Day[]
}

export function UpcomingSchedule({
  departureDate,
  expensesByDay,
  isLoading,
  days,
}: UpcomingScheduleProps): ReactNode {
  const { setCurrentStep, setIsOpen, setSelectedExpense } =
    useQuickActionsModalActions()
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="h-[200px] w-full animate-pulse rounded-lg bg-slate-200" />
        <div className="h-[200px] w-full animate-pulse rounded-lg bg-slate-200" />
        <div className="h-[200px] w-full animate-pulse rounded-lg bg-slate-200" />
      </div>
    )
  }

  return (
    <div className="space-y-6 lg:max-h-[500px] lg:overflow-y-auto">
      {expensesByDay &&
        Object.keys(expensesByDay).map((_, index) => {
          const date = addDays(new Date(departureDate), index)
          const formattedDate = formatDate(
            date,
            'yyyy-MM-dd',
            true,
            router.locale
          ) as DateString
          const expenses = expensesByDay[formattedDate]

          return (
            <div
              key={index}
              className="rounded-lg border border-gray-200 bg-white shadow-sm"
            >
              <div className="flex items-center justify-between bg-gray-50 px-6 py-4">
                <h3 className="text-lg font-semibold capitalize text-gray-800">
                  {formatDate(date, 'EEEE dd MMMM', true, router.locale)}
                </h3>
                <button
                  onClick={() => {
                    setIsOpen(true)
                    setCurrentStep('Select category')
                    setSelectedExpense({ startDate: formattedDate })
                  }}
                  className="rounded-full bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              {expenses?.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {expenses.map((expense) => (
                    <li
                      key={expense.id}
                      className="flex items-center justify-between px-6 py-4"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg font-medium text-gray-900">
                          {expense.name}
                        </span>
                        <ExpenseLabel
                          expenseCategory={expense.categories.name}
                        />
                      </div>
                      {!hasJourneyPassed(new Date(departureDate)) && (
                        <EditExpense expense={expense} days={days} />
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-6 py-4 text-center text-gray-500">
                  No activities planned for this day
                </p>
              )}
            </div>
          )
        })}
    </div>
  )
}
