import type {
  AddExpenseWithCategories,
  ExpensesByCategory,
  ExpenseWithCategories,
} from '@/types'

export function addExpenseByCategory(
  expense: AddExpenseWithCategories,
  expensesByCategory: ExpensesByCategory
): ExpensesByCategory {
  const expensesByCategoryCopy = { ...expensesByCategory }

  if (!expensesByCategoryCopy[expense.categories.name]) {
    expensesByCategoryCopy[expense.categories.name] = []
  }

  expensesByCategoryCopy[expense.categories.name].push(
    expense as ExpenseWithCategories
  )

  return expensesByCategoryCopy
}
