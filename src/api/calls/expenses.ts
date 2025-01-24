import type { AddExpenseWithCategories, Expense, UpdateExpense } from '@/types'
import { isValidDateTimeFormat } from '@/utils/date'

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
  if (!isValidDateTimeFormat(expense.startDate)) {
    throw new Error('invalideStartDateFormat')
  }

  const { data } = await apiInstance.post<Expense>(`/expenses`, expense)

  return data
}
