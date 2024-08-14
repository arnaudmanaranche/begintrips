import type { Expense, ExpenseCategoryEnum } from '@/types'
import { colorsAssociated } from '@/utils/expense-labels'
import type { ChartOptions } from 'chart.js'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js'
import { useMemo } from 'react'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const options: ChartOptions<'bar'> = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  animation: false,
}

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
    return {
      labels: expensesByCategory && Object.keys(expensesByCategory),
      datasets: [
        {
          data:
            expensesByCategory &&
            Object.values(expensesByCategory)
              .flat()
              .reduce(
                (acc: { amount: number; category: string }[], expense) => {
                  const index = acc.findIndex(
                    (item, i, arr) =>
                      arr[i] && item.category === expense.category
                  )
                  if (index > -1) {
                    acc[index].amount += expense.amount
                  } else {
                    acc.push({ ...expense })
                  }
                  return acc
                },
                []
              )
              .map((item) => item.amount),
          backgroundColor: labelBackgroundColors,
        },
      ],
    }
  }, [expensesByCategory, labelBackgroundColors])

  return (
    <div className="flex justify-center">
      <Bar data={data} options={options} />
    </div>
  )
}
