import find from 'lodash.find'

import type { Expense } from '@/types'

export const removeExpenseById = <T extends Record<string, Expense[]>>(
  record: T,
  id: string
): { updatedRecord: T; removedExpense: Expense | null } => {
  let removedExpense: Expense | null = null

  for (const key in record) {
    const expenses = record[key]

    const expense = find(expenses, (expense) => expense.id === id)
    if (expense) {
      removedExpense = expense
      ;(record[key] as Expense[]) = expenses.filter((exp) => exp.id !== id)

      return { updatedRecord: { ...record }, removedExpense }
    }
  }
  return { updatedRecord: { ...record }, removedExpense: null }
}
