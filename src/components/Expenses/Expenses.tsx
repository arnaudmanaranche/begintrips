import { getExpensesByCategory } from '@/api/calls/journeys'
import { QUERY_KEYS } from '@/api/queryKeys'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { ExpensesCharts } from '../ExpensesCharts/ExpensesCharts'

export function Expenses() {
  const { id: journeyId } = useParams()

  const {
    data: expensesByCategory,
    isFetching,
    isError,
  } = useQuery({
    queryKey: QUERY_KEYS.EXPENSES_BY_CATEGORY(journeyId as string),
    queryFn: () => getExpensesByCategory({ journeyId: journeyId as string }),
  })

  if (isFetching || expensesByCategory === undefined) {
    return (
      <div className="flex flex-col space-y-2">
        <div className="h-[400px] w-full animate-pulse rounded-lg bg-slate-200" />
        <div className="flex flex-col space-y-4">
          <div className="h-[30px] w-full animate-pulse rounded-lg bg-slate-200" />
          <div className="h-[30px] w-full animate-pulse rounded-lg bg-slate-200" />
          <div className="h-[30px] w-full animate-pulse rounded-lg bg-slate-200" />
        </div>
      </div>
    )
  }

  if (isError) return

  return Object.keys(expensesByCategory).length === 0 ? (
    <div className="flex items-center justify-center">
      <p className="text-xl text-gray-500">No expenses yet</p>
    </div>
  ) : (
    <ExpensesCharts expensesByCategory={expensesByCategory} />
  )
}
