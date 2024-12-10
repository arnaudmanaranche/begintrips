import { type ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import type { ExpenseWithCategories } from '@/types'

import { ExpensesCharts } from '../ExpensesCharts/ExpensesCharts'

interface ExpensesProps {
  expensesByDay: Record<string, ExpenseWithCategories[]>
  isLoading: boolean
}

export function Expenses({
  expensesByDay,
  isLoading,
}: ExpensesProps): ReactNode {
  if (isLoading) {
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

  if (expensesByDay === undefined) return

  return Object.keys(expensesByDay).length === 0 ? (
    <div className="flex items-center justify-center p-4 text-center">
      <p className="text-black/30">
        <FormattedMessage
          id="noExpenses"
          defaultMessage="No expenses recorded yet. Start tracking your expenses!"
        />
      </p>
    </div>
  ) : (
    <ExpensesCharts expensesByDay={expensesByDay} />
  )
}
