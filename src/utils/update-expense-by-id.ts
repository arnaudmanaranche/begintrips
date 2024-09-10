import type { Expense } from '@/types'

export const updateExpenseById = <T extends Record<string, Expense[]>>(
  record: T,
  expenseId: string,
  updatedProperties: Partial<Expense>
): { updatedRecord: T } => {
  for (const key in record) {
    const expenses = record[key]

    const expenseIndex = expenses.findIndex((exp) => exp.id === expenseId)
    if (expenseIndex !== -1) {
      const updatedExpense = { ...expenses[expenseIndex], ...updatedProperties }

      record[key][expenseIndex] = updatedExpense

      return { updatedRecord: { ...record } }
    }
  }
  return { updatedRecord: { ...record } }
}
