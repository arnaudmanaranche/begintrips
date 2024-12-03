import type { AddExpenseWithCategories, ExpensesByCategory } from '@/types'

import { addExpenseByCategory } from './add-expense-by-category'
import { formatDate } from './date'

describe('addExpenseByCategory', () => {
  it('should add expense by category', () => {
    const expensesByCategory = {
      food: [
        {
          id: '1',
          amount: 100,
          startDate: '2022-01-01',
          journeyId: '1',
          dayId: '1',
          name: 'Food 1',
          created_at: '2022-01-01',
          endDate: '',
          categories: {
            name: 'food',
            id: '1',
            emoji: '🍔',
            created_at: '2022-01-01',
          },
          category_id: '',
        },
      ],
      bar: [
        {
          id: '2',
          amount: 300,
          startDate: '2022-01-03',
          journeyId: '1',
          dayId: '1',
          name: 'Bar 1',
          endDate: '',
          created_at: '2022-01-03',
          categories: {
            name: 'bar',
            id: '1',
            emoji: '🍔',
            created_at: '2022-01-01',
          },
          category_id: '1',
        },
      ],
    } as ExpensesByCategory

    const newExpense: AddExpenseWithCategories = {
      id: '3',
      amount: 300,
      startDate: '2022-01-03',
      name: 'Food 2',
      dayId: '1',
      journeyId: '1',
      endDate: '',
      created_at: formatDate(new Date('2022-01-03'), 'yyyy-MM-dd', true),
      categories: {
        name: 'food',
        id: '1',
        emoji: '🍔',
        created_at: formatDate(new Date('2022-01-03'), 'yyyy-MM-dd', true),
      },
      category_id: '1',
    }

    addExpenseByCategory(newExpense, expensesByCategory)

    expect(expensesByCategory).toEqual({
      food: [
        {
          id: '1',
          amount: 100,
          startDate: '2022-01-01',
          journeyId: '1',
          dayId: '1',
          name: 'Food 1',
          created_at: '2022-01-01',
          endDate: '',
          category_id: '',
          categories: {
            name: 'food',
            id: '1',
            emoji: '🍔',
            created_at: '2022-01-01',
          },
        },
        {
          id: '3',
          amount: 300,
          startDate: '2022-01-03',
          name: 'Food 2',
          dayId: '1',
          journeyId: '1',
          created_at: '2022-01-03',
          endDate: '',
          category_id: '1',
          categories: {
            name: 'food',
            id: '1',
            emoji: '🍔',
            created_at: '2022-01-03',
          },
        },
      ],
      bar: [
        {
          id: '2',
          amount: 300,
          startDate: '2022-01-03',
          journeyId: '1',
          dayId: '1',
          name: 'Bar 1',
          created_at: '2022-01-03',
          endDate: '',
          category_id: '1',
          categories: {
            name: 'bar',
            id: '1',
            emoji: '🍔',
            created_at: '2022-01-01',
          },
        },
      ],
    })
  })
})
