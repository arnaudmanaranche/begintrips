import { type ReactNode } from 'react'

import type { Expense } from '@/types'

import { ExpensesCharts } from '../ExpensesCharts/ExpensesCharts'

interface ExpensesProps {
  expensesByCategory: Record<string, Expense[]>
  isLoading: boolean
}

export function Expenses({
  expensesByCategory,
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

  if (expensesByCategory === undefined) return

  return Object.keys(expensesByCategory).length === 0 ? (
    <div className="flex items-center justify-center">
      <p className="text-xl text-gray-500">No expenses yet</p>
    </div>
  ) : (
    <ExpensesCharts expensesByCategory={expensesByCategory} />
  )
}
