import type { Expense, ExpensesByCategory } from '@/types'

export function addExpenseByCategory(
  expense: Expense,
  expensesByCategory: ExpensesByCategory
): ExpensesByCategory {
  const epxensesByCategoryCopy = { ...expensesByCategory }

  if (!epxensesByCategoryCopy[expense.category]) {
    epxensesByCategoryCopy[expense.category] = []
  }

  epxensesByCategoryCopy[expense.category].push(expense)

  return epxensesByCategoryCopy
}
