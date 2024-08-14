import { apiInstance } from '@/api/config'
import type { AddExpense, Expense } from '@/types'

export const createExpense = async (expense: AddExpense) => {
  if (!expense.dayId) {
    throw new Error('Bad request', {
      cause: { code: '400', message: 'dayId is required' },
    })
  }

  const { data } = await apiInstance.post<Expense>(
    `/days/${expense.dayId}/expenses`,
    expense
  )

  return data
}
