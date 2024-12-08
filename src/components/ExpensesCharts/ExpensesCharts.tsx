import { differenceInDays, parseISO } from 'date-fns'
import type { ReactNode } from 'react'
import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type { ExpensesByDay } from '@/types'
import { colorsAssociated } from '@/utils/expense-labels'

interface ExpensesChartsProps {
  expensesByDay: ExpensesByDay
}

export function ExpensesCharts({
  expensesByDay,
}: ExpensesChartsProps): ReactNode {
  const data = useMemo(() => {
    return Object.entries(expensesByDay).map(([date, expenses]) => {
      const expensesByCategory = expenses.reduce(
        (acc, expense) => {
          const category = expense.categories.name
          const startDate = parseISO(expense.startDate)
          const endDate = expense.endDate
            ? parseISO(expense.endDate)
            : startDate
          const days = Math.max(differenceInDays(endDate, startDate) + 1, 1)
          const amountPerDay = expense.amount / days
          acc[category] = (acc[category] || 0) + amountPerDay
          return acc
        },
        {} as Record<string, number>
      )

      return {
        date,
        ...expensesByCategory,
      }
    })
  }, [expensesByDay])

  const categories = useMemo(() => {
    const allCategories = new Set<string>()
    data.forEach((day) => {
      Object.keys(day).forEach((key) => {
        if (key !== 'date') allCategories.add(key)
      })
    })
    return Array.from(allCategories)
  }, [data])

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} barSize={20} barGap={20}>
        <XAxis
          dataKey="date"
          tickFormatter={(value) =>
            new Date(value).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            })
          }
        />
        <YAxis />
        <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
        <Legend />
        {categories.map((category) => (
          <Bar
            key={category}
            label={{ position: 'top' }}
            dataKey={category}
            stackId="a"
            fill={colorsAssociated[category] || '#000000'}
            // radius={[4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}
