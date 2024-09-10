import { addDays } from 'date-fns'

import { ExpenseLabel } from '@/components/ExpenseLabel/ExpenseLabel'
import { useQuickActionsModalActions } from '@/providers/QuickActions.Provider'
import type { ExpensesByDay } from '@/types'
import { formatDate } from '@/utils/date'
import { hasJourneyPassed } from '@/utils/has-journey-passed'

import { EditExpense } from '../EditExpense/EditExpense'

export type UpcomingScheduleProps = {
  departureDate: string
  expensesByDay: ExpensesByDay
  isLoading: boolean
}

export function UpcomingSchedule({
  departureDate,
  expensesByDay,
  isLoading,
}: UpcomingScheduleProps) {
  const { setCurrentStep, setIsOpen, setSelectedDay } =
    useQuickActionsModalActions()

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
    <div className="lg:max-h-[500px] lg:overflow-y-scroll">
      {expensesByDay &&
        Object.keys(expensesByDay).map((_, index) => {
          const date = addDays(new Date(departureDate), index)

          const expenses =
            expensesByDay[formatDate(date, 'yyyy-MM-dd') as keyof ExpensesByDay]

          return (
            <div key={index} className="flex flex-col rounded-lg">
              <div className="flex items-center justify-between p-4">
                <span className="text-base text-black">
                  {formatDate(date, 'EEEE dd MMMM')}
                </span>
                <div
                  onClick={() => {
                    setIsOpen(true)
                    setCurrentStep('Select category')
                    setSelectedDay(formatDate(new Date(date), 'yyyy-MM-dd'))
                  }}
                  className="cursor-pointer rounded-md px-2 py-1 ring-1 ring-slate-100 transition-colors hover:bg-slate-100"
                >
                  +
                </div>
              </div>
              {expenses?.length > 0 ? (
                <ul className="flex w-full flex-col space-y-2 px-4 pb-4">
                  {expenses.map((expense) => (
                    <div
                      key={expense.name}
                      className="flex justify-between rounded-lg border-[1px] border-gray-400/30 bg-white px-4 py-4"
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <span className="truncate">{expense.name}</span>
                        <ExpenseLabel expenseCategory={expense.category} />
                      </div>
                      {!hasJourneyPassed(new Date(departureDate)) ? (
                        <div className="flex items-center space-x-2">
                          <EditExpense expense={expense} />
                        </div>
                      ) : null}
                    </div>
                  ))}
                </ul>
              ) : null}
            </div>
          )
        })}
    </div>
  )
}
