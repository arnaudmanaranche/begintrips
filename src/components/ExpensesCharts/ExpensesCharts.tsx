import type { ReactNode } from 'react'
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLegend,
  VictoryStack,
  VictoryTheme,
  VictoryTooltip,
  VictoryZoomContainer,
} from 'victory'

import type { ExpensesByDay } from '@/types'
import { formatDate } from '@/utils/date'
import { colorsAssociated } from '@/utils/expense-labels'

interface ExpensesChartsProps {
  expensesByDay: ExpensesByDay
}

interface TransformedData {
  date: string
  [key: string]: number | string
}

export function ExpensesCharts({
  expensesByDay,
}: ExpensesChartsProps): ReactNode {
  const transformedData: TransformedData[] = Object.entries(expensesByDay).map(
    ([date, expenses]) => {
      const categories = expenses.reduce(
        (acc: { [key: string]: number }, expense) => {
          acc[expense.categories.name] =
            (acc[expense.categories.name] || 0) + expense.amount
          return acc
        },
        {}
      )

      return { date, ...categories }
    }
  )

  const categories = [
    ...Array.from(
      new Set(
        transformedData.flatMap((d) =>
          Object.keys(d).filter((key) => key !== 'date')
        )
      )
    ),
  ]

  return (
    <VictoryChart
      domain={{ x: [0, 7] }}
      theme={VictoryTheme.clean}
      containerComponent={<VictoryZoomContainer />}
    >
      <VictoryLegend
        x={50}
        y={10}
        orientation="horizontal"
        style={{
          labels: { fontSize: 10 },
          border: { stroke: 'none' },
          title: { fontSize: 12 },
        }}
        data={categories.map((category) => ({
          name: category,
          symbol: { fill: colorsAssociated[category] || '#ccc' }, // Default color if not mapped
        }))}
      />
      <VictoryAxis
        tickFormat={transformedData.map((d) => formatDate(d.date, 'dd MMM'))}
      />
      <VictoryAxis dependentAxis tickFormat={(x) => `$${x}`} />
      <VictoryStack>
        {categories.map((category) => (
          <VictoryBar
            key={category}
            data={transformedData.map((d) => ({
              x: d.date,
              y: d[category] || 0,
            }))}
            labels={({ datum }) => datum.y}
            labelComponent={<VictoryTooltip />}
            style={{
              data: { fill: colorsAssociated[category] || '#ccc' }, // Default color if not mapped
            }}
          />
        ))}
      </VictoryStack>
    </VictoryChart>
  )
}
