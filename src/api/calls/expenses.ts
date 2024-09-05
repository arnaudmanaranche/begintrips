import type { Expense } from '@/types'

import { apiInstance } from '../config'

export const deleteExpense = async ({ id }: { id: string }) => {
  const { data } = await apiInstance.delete<{ message: string }>(
    `/expenses/${id}`
  )

  return data
}

export const updateExpense = async ({ expense }: { expense: Expense }) => {
  const { data } = await apiInstance.patch<{ message: string }>(
    `/expenses/${expense.id}`,
    expense
  )

  return data
}
