import { formatISO } from 'date-fns'
import groupBy from 'lodash.groupby'

import type { Day,Expense } from '@/types'

export const groupedExpensesByCategory = ({
  expenses,
}: {
  expenses: Expense[]
}) => {
  const expensesByCategory = groupBy(expenses, 'category')

  const sortedExpensesByCategory = Object.keys(expensesByCategory)
    .sort((a, b) => a.localeCompare(b))
    .reduce((acc: Record<string, Expense[]>, key) => {
      acc[key] = expensesByCategory[key]
      return acc
    }, {})

  return sortedExpensesByCategory
}

export const groupedExpensesByDay = ({
  expenses,
  days,
}: {
  expenses: Expense[]
  days: Partial<Day>[]
}) => {
  const expensesByDay = days.reduce<Record<string, Expense[]>>((acc, day) => {
    const dayKey = formatISO(new Date(day.startDate!), {
      representation: 'date',
    })

    acc[dayKey] = []
    return acc
  }, {})

  if (expenses) {
    expenses.forEach((expense) => {
      if (expense.startDate) {
        const dayKey = formatISO(new Date(expense.startDate), {
          representation: 'date',
        })
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
