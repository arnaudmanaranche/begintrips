import type { ExpenseWithCategories } from '@/types'

import {
  groupedExpensesByCategory,
  groupedExpensesByDay,
} from './groupe-expenses'

describe('groupedExpensesByCategory', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01'))
  })

  it('should group expenses by category', () => {
    const expenses: ExpenseWithCategories[] = [
      {
        name: 'Concert',
        amount: 10,

        startDate: new Date().toISOString(),
        journeyId: '1',
        created_at: new Date().toISOString(),
        dayId: '1',
        id: '1',
        category_id: '',
        categories: {
          name: 'concert',
          id: '1',
          emoji: '🎶',
          created_at: new Date().toISOString(),
        },
      },
      {
        name: 'Restaurant 1',
        amount: 10,

        startDate: new Date().toISOString(),
        journeyId: '1',
        created_at: new Date().toISOString(),
        dayId: '1',
        id: '2',
        category_id: '',
        categories: {
          name: 'restaurant',
          id: '2',
          emoji: '🍔',
          created_at: new Date().toISOString(),
        },
      },
      {
        name: 'Restaurant 2',
        amount: 20,

        startDate: new Date().toISOString(),
        journeyId: '1',
        created_at: new Date().toISOString(),
        dayId: '1',
        id: '3',
        category_id: '',
        categories: {
          name: 'restaurant',
          id: '2',
          emoji: '🍔',
          created_at: new Date().toISOString(),
        },
      },
    ]

    const grouped = groupedExpensesByCategory({ expenses })

    expect(grouped).toEqual({
      concert: [
        {
          name: 'Concert',
          amount: 10,

          startDate: new Date().toISOString(),
          journeyId: '1',
          created_at: new Date().toISOString(),
          dayId: '1',
          id: '1',
        },
      ],
      restaurant: [
        {
          name: 'Restaurant 1',
          amount: 10,

          startDate: new Date().toISOString(),
          journeyId: '1',
          created_at: new Date().toISOString(),
          dayId: '1',
          id: '2',
        },
        {
          name: 'Restaurant 2',
          amount: 20,

          startDate: new Date().toISOString(),
          journeyId: '1',
          created_at: new Date().toISOString(),
          dayId: '1',
          id: '3',
        },
      ],
    })
  })
  it('groups expenses by day', () => {
    const expenses: ExpenseWithCategories[] = [
      {
        name: 'Concert',
        amount: 10,

        startDate: new Date().toISOString(),
        created_at: new Date().toISOString(),
        dayId: '1',
        id: '1',
        journeyId: '1',
        category_id: '',
        categories: {
          name: 'concert',
          id: '1',
          emoji: '🎶',
          created_at: new Date().toISOString(),
        },
      },
      {
        name: 'Restaurant 1',
        amount: 10,

        startDate: new Date().toISOString(),
        created_at: new Date().toISOString(),
        dayId: '1',
        id: '2',
        journeyId: '1',
        category_id: '',
        categories: {
          name: 'restaurant',
          id: '2',
          emoji: '🍔',
          created_at: new Date().toISOString(),
        },
      },
    ]
    const grouped = groupedExpensesByDay({ expenses, days: [] })
    expect(grouped).toEqual({
      '2020-01-01': [
        {
          name: 'Concert',
          amount: 10,

          startDate: new Date().toISOString(),
          created_at: new Date().toISOString(),
          dayId: '1',
          id: '1',
          journeyId: '1',
        },
        {
          name: 'Restaurant 1',
          amount: 10,

          startDate: new Date().toISOString(),
          created_at: new Date().toISOString(),
          dayId: '1',
          id: '2',
          journeyId: '1',
        },
      ],
    })
  })
})
