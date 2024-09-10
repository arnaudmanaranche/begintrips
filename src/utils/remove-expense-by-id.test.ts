import type { Expense, ExpensesByCategory } from '@/types'

import { removeExpenseById } from './remove-expense-by-id'

describe('removeExpenseById', () => {
  it('should return the removed expense and the updated record', () => {
    const expensesByCategory = {
      attraction: [
        {
          id: '1',
          name: 'Expense 1',
        } as Expense,
        {
          id: '2',
          name: 'Expense 2',
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
    } as ExpensesByCategory

    const { updatedRecord, removedExpense } = removeExpenseById(
      expensesByCategory,
      '2'
    )

    expect(removedExpense).toEqual({
      id: '2',
      name: 'Expense 2',
    })
    expect(updatedRecord).toEqual({
      attraction: [
        {
          id: '1',
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
