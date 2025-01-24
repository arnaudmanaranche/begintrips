import type { Expense, ExpenseWithCategories } from '@/types'

import { updateExpenseById } from './update-expense-by-id'

describe('updateExpenseById', () => {
  it('should return the updated record', () => {
    const expensesByCategory = {
      attraction: [
        {
          id: '1',
          name: 'Expense 1',
        } as ExpenseWithCategories,
        {
          id: '2',
          name: 'Expense 2',
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
    }

    const { updatedRecord } = updateExpenseById(expensesByCategory, '2', {
      amount: 100,
      name: 'Updated - Expense 2',
    })

    expect(updatedRecord).toEqual({
      attraction: [
        {
          id: '1',
          name: 'Expense 1',
        } as Expense,
        {
          id: '2',
          name: 'Updated - Expense 2',
          amount: 100,
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
