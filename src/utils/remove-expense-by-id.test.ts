import type {
  Expense,
  ExpensesByCategory,
  ExpenseWithCategories,
} from '@/types'

import { removeExpenseById } from './remove-expense-by-id'

describe('removeExpenseById', () => {
  it('should return the removed expense and the updated record', () => {
    const expensesByCategory = {
      attraction: [
        {
          id: '1',
          name: 'Expense 1',
          category_id: '1',
        } as ExpenseWithCategories,
        {
          id: '2',
          name: 'Expense 2',
          category_id: '2',
        } as ExpenseWithCategories,
      ],
      bar: [
        {
          id: '3',
          name: 'Expense 3',
        } as ExpenseWithCategories,
        {
          id: '4',
          name: 'Expense 4',
        } as ExpenseWithCategories,
      ],
    } as ExpensesByCategory

    const { updatedRecord, removedExpense } = removeExpenseById(
      expensesByCategory,
      '2'
    )

    expect(removedExpense).toEqual({
      id: '2',
      name: 'Expense 2',
      category_id: '2',
    })
    expect(updatedRecord).toEqual({
      attraction: [
        {
          id: '1',
          category_id: '1',
          name: 'Expense 1',
        } as Expense,
      ],
      bar: [
        {
          id: '3',
          name: 'Expense 3',
        } as Expense,
        {
          id: '4',
          name: 'Expense 4',
        } as Expense,
      ],
    })
  })
})
