import type {
  AddExpenseWithCategories,
  ExpensesByDay,
  ExpenseWithCategories,
} from '@/types'

export function addExpenseByDay(
  expense: AddExpenseWithCategories,
  expensesByDay: ExpensesByDay
): ExpensesByDay {
  const expensesByDayCopy = { ...expensesByDay }

  if (!expensesByDayCopy[expense.startDate as keyof ExpensesByDay]) {
    expensesByDayCopy[expense.startDate as keyof ExpensesByDay] = []
  }

  expensesByDayCopy[expense.startDate as keyof ExpensesByDay].push(
    expense as ExpenseWithCategories
  )

  return expensesByDayCopy
}
