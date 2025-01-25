import { eachDayOfInterval, formatISO } from 'date-fns'

import type { DateString, ExpensesByDay, ExpenseWithCategories } from '@/types'

export const groupedExpensesByDay = ({
  days,
  expenses,
}: {
  days: string[]
  expenses: ExpenseWithCategories[]
}): ExpensesByDay => {
  const expensesByDay = days.reduce<ExpensesByDay>((acc, day) => {
    const dayKey = formatISO(new Date(day), {
      representation: 'date',
    }) as DateString

    acc[dayKey] = []
    return acc
  }, {})

  expenses.forEach((expense) => {
    const startDate = new Date(expense.startDate)
    const endDate = expense.endDate ? new Date(expense.endDate) : startDate

    const daysInRange = eachDayOfInterval({
      start: startDate,
      end: endDate,
    })

    const dailyPrice = parseFloat(
      (expense.amount / daysInRange.length).toFixed(2)
    )

    daysInRange.forEach((date) => {
      const dayKey = formatISO(date, {
        representation: 'date',
      }) as DateString

      const splitExpense = {
        ...expense,
        amount: dailyPrice,
      }

      if (expensesByDay[dayKey]) {
        expensesByDay[dayKey].push(splitExpense)
      } else {
        expensesByDay[dayKey] = [splitExpense]
      }
    })
  })

  return expensesByDay
}
