import { apiInstance } from '@/api/config'
import type { AddExpenseWithCategories, Expense } from '@/types'

export const createExpense = async ({
  expense,
}: {
  expense: AddExpenseWithCategories
}): Promise<Expense> => {
  if (!expense.name) {
    throw new Error('You need to fill in the name field')
  }

  if (!expense.dayId) {
    throw new Error('You need to select a day')
  }

  const { data } = await apiInstance.post<Expense>(
    `/days/${expense.dayId}/expenses`,
    expense
  )

  return data
}
