import type { Expense } from '@/types'
import {
  groupedExpensesByCategory,
  groupedExpensesByDay,
} from './groupe-expenses'

describe('groupedExpensesByCategory', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01'))
  })

  it('should group expenses by category', () => {
    const expenses: Expense[] = [
      {
        name: 'Concert',
        amount: 10,
        category: 'concert',
        startDate: new Date().toISOString(),
        journeyId: '1',
        created_at: new Date().toISOString(),
        dayId: '1',
        id: '1',
      },
      {
        name: 'Restaurant 1',
        amount: 10,
        category: 'restaurant',
        startDate: new Date().toISOString(),
        journeyId: '1',
        created_at: new Date().toISOString(),
        dayId: '1',
        id: '2',
      },
      {
        name: 'Restaurant 2',
        amount: 20,
        category: 'restaurant',
        startDate: new Date().toISOString(),
        journeyId: '1',
        created_at: new Date().toISOString(),
        dayId: '1',
        id: '3',
      },
    ]

    const grouped = groupedExpensesByCategory({ expenses })

    expect(grouped).toEqual({
      concert: [
        {
          name: 'Concert',
          amount: 10,
          category: 'concert',
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
          category: 'restaurant',
          startDate: new Date().toISOString(),
          journeyId: '1',
          created_at: new Date().toISOString(),
          dayId: '1',
          id: '2',
        },
        {
          name: 'Restaurant 2',
          amount: 20,
          category: 'restaurant',
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
    const expenses: Expense[] = [
      {
        name: 'Concert',
        amount: 10,
        category: 'concert',
        startDate: new Date().toISOString(),
        created_at: new Date().toISOString(),
        dayId: '1',
        id: '1',
        journeyId: '1',
      },
      {
        name: 'Restaurant 1',
        amount: 10,
        category: 'restaurant',
        startDate: new Date().toISOString(),
        created_at: new Date().toISOString(),
        dayId: '1',
        id: '2',
        journeyId: '1',
      },
    ]
    const grouped = groupedExpensesByDay({ expenses, days: [] })
    expect(grouped).toEqual({
      '2020-01-01': [
        {
          name: 'Concert',
          amount: 10,
          category: 'concert',
          startDate: new Date().toISOString(),
          created_at: new Date().toISOString(),
          dayId: '1',
          id: '1',
          journeyId: '1',
        },
        {
          name: 'Restaurant 1',
          amount: 10,
          category: 'restaurant',
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
