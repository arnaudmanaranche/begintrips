import type { Expense, ExpensesByCategory } from '@/types'

import { addExpenseByCategory } from './add-expense-by-category'

describe('addExpenseByCategory', () => {
  it('should add expense by category', () => {
    const expensesByCategory = {
      food: [
        {
          id: '1',
          amount: 100,
          category: 'food',
          startDate: '2022-01-01',
          journeyId: '1',
          dayId: '1',
          name: 'Food 1',
          created_at: '2022-01-01',
        },
      ],
      bar: [
        {
          id: '2',
          amount: 300,
          category: 'bar',
          startDate: '2022-01-03',
          journeyId: '1',
          dayId: '1',
          name: 'Bar 1',
          created_at: '2022-01-03',
        },
      ],
    } as ExpensesByCategory

    const newExpense: Expense = {
      id: '3',
      amount: 300,
      category: 'food',
      startDate: '2022-01-03',
      name: 'Food 2',
      dayId: '1',
      journeyId: '1',
      created_at: new Date().toISOString(),
    }

    addExpenseByCategory(newExpense, expensesByCategory)

    expect(expensesByCategory).toEqual({
      food: [
        {
          id: '1',
          amount: 100,
          category: 'food',
          startDate: '2022-01-01',
          journeyId: '1',
          dayId: '1',
          name: 'Food 1',
          created_at: '2022-01-01',
        },
        {
          id: '3',
          amount: 300,
          category: 'food',
          startDate: '2022-01-03',
          name: 'Food 2',
          dayId: '1',
          journeyId: '1',
        },
      ],
      bar: [
        {
          id: '2',
          amount: 300,
          category: 'bar',
          startDate: '2022-01-03',
          journeyId: '1',
          dayId: '1',
          name: 'Bar 1',
          created_at: '2022-01-03',
        },
      ],
    })
  })
})
