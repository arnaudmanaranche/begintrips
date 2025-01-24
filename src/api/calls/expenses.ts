import type { AddExpenseWithCategories, Expense, UpdateExpense } from '@/types'

import { apiInstance } from '../config'

export const deleteExpense = async ({
  id,
}: {
  id: string
}): Promise<{ message: string }> => {
  const { data } = await apiInstance.delete<{ message: string }>(
    `/expenses/${id}`
  )

  return data
}

export const updateExpense = async ({
  expense,
}: {
  expense: UpdateExpense
}): Promise<{ message: string }> => {
  const { data } = await apiInstance.patch<{ message: string }>(
    `/expenses/${expense.id}`,
    expense
  )

  return data
}

export const createExpense = async ({
  expense,
}: {
  expense: AddExpenseWithCategories
}): Promise<Expense> => {
  const { data } = await apiInstance.post<Expense>(`/expenses`, expense)

  return data
}
