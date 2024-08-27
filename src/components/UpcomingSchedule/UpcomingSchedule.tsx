import { getExpensesByDay } from '@/api/calls/journeys'
import { ExpenseLabel } from '@/components/ExpenseLabel/ExpenseLabel'
import { formatDate } from '@/utils/date'
import { hasJourneyPassed } from '@/utils/has-journey-passed'
import { useQuery } from '@tanstack/react-query'
import { addDays } from 'date-fns'
import { useRouter } from 'next/router'
import { EditExpense } from '../EditExpense/EditExpense'

export type UpcomingScheduleProps = {
  departureDate: string
}

export function UpcomingSchedule({ departureDate }: UpcomingScheduleProps) {
  const { query } = useRouter()
  const { data: expensesByDay, isFetching } = useQuery({
    queryKey: [query.id, 'expensesByDay'],
    queryFn: () => getExpensesByDay({ journeyId: query.id as string }),
  })

  if (isFetching) {
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

          return (
            <div key={index} className="flex flex-col rounded-lg">
              <div className="flex items-center justify-between p-4">
                <span className="text-base text-black">
                  {formatDate(date, 'EEEE dd MMMM')}
                </span>
                <span className="text-sm text-accent">
                  {expensesByDay[formatDate(date, 'yyyy-MM-dd')]?.length}{' '}
                  {expensesByDay[formatDate(date, 'yyyy-MM-dd')]?.length > 1
                    ? 'expenses'
                    : 'expense'}
                </span>
              </div>
              {expensesByDay[formatDate(date, 'yyyy-MM-dd')]?.length > 0 ? (
                <ul className="flex w-full flex-col space-y-2 px-4 pb-4">
                  {expensesByDay[formatDate(date, 'yyyy-MM-dd')].map(
                    (expense) => (
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
                    )
                  )}
                </ul>
              ) : null}
            </div>
          )
        })}
    </div>
  )
}
