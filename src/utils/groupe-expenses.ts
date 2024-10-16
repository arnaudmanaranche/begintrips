import { eachDayOfInterval, formatISO } from 'date-fns'
import groupBy from 'lodash.groupby'

import type {
  DateString,
  Day,
  ExpensesByCategory,
  ExpensesByDay,
  ExpenseWithCategories,
} from '@/types'

export const groupedExpensesByCategory = ({
  expenses,
}: {
  expenses: ExpenseWithCategories[]
}): ExpensesByCategory => {
  const expensesByCategory = groupBy(expenses, 'categories.name')

  const sortedExpensesByCategory = Object.keys(expensesByCategory)
    .sort((a, b) => a.localeCompare(b))
    .reduce((acc: ExpensesByCategory, key) => {
      const categoryKey = key
      acc[categoryKey] = expensesByCategory[categoryKey] || []
      return acc
    }, {})

  return sortedExpensesByCategory
}

export const groupedExpensesByDay = ({
  days,
  expenses,
}: {
  days: Partial<Day>[]
  expenses: ExpenseWithCategories[]
}): ExpensesByDay => {
  const expensesByDay = days.reduce<ExpensesByDay>((acc, day) => {
    const dayKey = formatISO(new Date(day.startDate!), {
      representation: 'date',
    }) as DateString

    acc[dayKey] = []
    return acc
  }, {})

  if (expenses) {
    expenses.forEach((expense) => {
      const startDate = new Date(expense.startDate)
      const endDate = expense.endDate ? new Date(expense.endDate) : startDate

      const daysInRange = eachDayOfInterval({
        start: startDate,
        end: endDate,
      })

      daysInRange.forEach((date) => {
        const dayKey = formatISO(date, {
          representation: 'date',
        }) as DateString

        if (expensesByDay[dayKey]) {
          expensesByDay[dayKey].push(expense)
        } else {
          expensesByDay[dayKey] = [expense]
        }
      })
    })
  }

  return expensesByDay
}
