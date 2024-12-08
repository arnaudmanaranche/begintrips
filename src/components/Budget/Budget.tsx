import { type ReactNode } from 'react'
import { FormattedMessage, FormattedNumber } from 'react-intl'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

import { useQuickActionsModalActions } from '@/providers/QuickActions.Provider'

const iR = 50
const oR = 100

interface BudgetProps {
  budgetSpent: number
  totalBudget: number
}

export function Budget({ budgetSpent, totalBudget }: BudgetProps): ReactNode {
  const { setCurrentStep, setIsOpen } = useQuickActionsModalActions()

  if (totalBudget === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center space-y-4">
        <span className="text-black/30">
          <FormattedMessage
            id="noBudget"
            defaultMessage="You have no budget yet. Add one to get started {setBudget}"
            values={{
              setBudget: (
                <p
                  onClick={() => {
                    setCurrentStep('Update budget')
                    setIsOpen(true)
                  }}
                  className="cursor-pointer text-accent"
                >
                  <FormattedMessage
                    id="addBudget"
                    defaultMessage="Add budget"
                  />
                </p>
              ),
            }}
          />
        </span>
      </div>
    )
  }

  const percentageSpent = (budgetSpent / totalBudget) * 100
  const remainingPercentage = 100 - percentageSpent

  let color
  if (percentageSpent <= 50) {
    color = '#4CAF50' // Green
  } else if (percentageSpent <= 80) {
    color = '#FFA500' // Orange
  } else {
    color = '#FF0000' // Red
  }

  const data = [
    { name: 'Spent', value: percentageSpent, fill: color },
    { name: 'Remaining', value: remainingPercentage, fill: '#E0E0E0' },
  ]

  return (
    <div style={{ width: '100%', height: 200 }} className="relative">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            startAngle={180}
            endAngle={0}
            innerRadius={iR}
            outerRadius={oR}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute bottom-16 left-0 h-max w-full text-center text-black">
        <div className="text-2xl font-bold">
          {`${Math.min(Math.round(percentageSpent), 100)}%`}
        </div>
        <div className="text-xs">
          <FormattedMessage
            id="budgetSpent"
            defaultMessage={`{budgetSpent} of {totalBudget} spent`}
            values={{
              budgetSpent: (
                <FormattedNumber
                  value={budgetSpent}
                  currency="EUR"
                  style="currency"
                  maximumFractionDigits={1}
                />
              ),
              totalBudget: (
                <FormattedNumber
                  value={totalBudget}
                  currency="EUR"
                  style="currency"
                  maximumFractionDigits={1}
                />
              ),
            }}
          />
        </div>
      </div>
    </div>
  )
}
