import type { Expense, ExpenseCategoryEnum } from '@/types'
import { colorsAssociated } from '@/utils/expense-labels'
import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'

export type ExpensesChartsProps = {
  expensesByCategory: Record<string, Expense[]>
}

export function ExpensesCharts({ expensesByCategory }: ExpensesChartsProps) {
  const labelBackgroundColors = useMemo(() => {
    return Object.keys(expensesByCategory).map((k) => {
      const color = colorsAssociated[k as ExpenseCategoryEnum]
      return color
    })
  }, [expensesByCategory])

  const data = useMemo(() => {
    return (
      expensesByCategory &&
      Object.keys(expensesByCategory).map((category) => {
        const totalAmount = expensesByCategory[category].reduce(
          (sum, expense) => sum + expense.amount,
          0
        )

        return {
          name: category,
          uv: totalAmount,
        }
      })
    )
  }, [expensesByCategory])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <div className="flex justify-center">
        <BarChart
          width={Object.keys(expensesByCategory).length * 100}
          height={200}
          data={data}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Bar dataKey="uv" fill="black" height={400}>
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={labelBackgroundColors[index % 20]}
              />
            ))}
          </Bar>
        </BarChart>
      </div>
    </ResponsiveContainer>
  )
}
