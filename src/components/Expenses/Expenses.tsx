import { getExpensesByCategory } from '@/api/calls/journeys'

import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { ExpensesCharts } from '../ExpensesCharts/ExpensesCharts'

export function Expenses() {
  const { query } = useRouter()

  const {
    data: expensesByCategory,
    isFetching,
    isError,
  } = useQuery({
    queryKey: [query.id, 'expensesByCategory'],
    queryFn: () => getExpensesByCategory({ journeyId: query.id as string }),
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
