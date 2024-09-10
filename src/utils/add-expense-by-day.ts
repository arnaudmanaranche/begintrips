import type { Expense, ExpensesByDay } from '@/types'

export function addExpenseByDay(
  newExpense: Expense,
  expensesByDay: ExpensesByDay
) {
  const copy = { ...expensesByDay }

  if (!copy[newExpense.startDate as keyof ExpensesByDay]) {
    copy[newExpense.startDate as keyof ExpensesByDay] = []
  }

  copy[newExpense.startDate as keyof ExpensesByDay].push(newExpense)

  return copy
}
