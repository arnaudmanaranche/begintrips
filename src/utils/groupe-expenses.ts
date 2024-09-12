import { formatISO } from 'date-fns'
import groupBy from 'lodash.groupby'

import type {
  DateString,
  Day,
  Expense,
  ExpenseCategoryEnum,
  ExpensesByCategory,
  ExpensesByDay,
} from '@/types'

export const groupedExpensesByCategory = ({
  expenses,
}: {
  expenses: Expense[]
}): ExpensesByCategory => {
  const expensesByCategory = groupBy(expenses, 'category')

  const sortedExpensesByCategory = Object.keys(expensesByCategory)
    .sort((a, b) => a.localeCompare(b))
    .reduce(
      (acc: Record<ExpenseCategoryEnum, Expense[]>, key) => {
        const categoryKey = key as ExpenseCategoryEnum // Cast string key to enum
        acc[categoryKey] = expensesByCategory[categoryKey] || [] // Ensure correct key type
        return acc
      },
      {} as Record<ExpenseCategoryEnum, Expense[]>
    )

  return sortedExpensesByCategory
}

export const groupedExpensesByDay = ({
  expenses,
  days,
}: {
  expenses: Expense[]
  days: Partial<Day>[]
}): ExpensesByDay => {
  const expensesByDay = days.reduce<Record<DateString, Expense[]>>(
    (acc, day) => {
      const dayKey = formatISO(new Date(day.startDate!), {
        representation: 'date',
      }) as DateString

      acc[dayKey] = []
      return acc
    },
    {}
  )

  if (expenses) {
    expenses.forEach((expense) => {
      if (expense.startDate) {
        const dayKey = formatISO(new Date(expense.startDate), {
          representation: 'date',
        }) as DateString
        if (expensesByDay[dayKey]) {
          expensesByDay[dayKey].push(expense)
        } else {
          expensesByDay[dayKey] = [expense]
        }
      }
    })
  }

  return expensesByDay
}
