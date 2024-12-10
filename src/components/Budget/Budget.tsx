import { type ReactNode } from 'react'
import { FormattedMessage, FormattedNumber } from 'react-intl'
import { VictoryPie, VictoryTheme, VictoryTooltip } from 'victory'

import { useDrawerActions } from '@/providers/Drawer/Drawer.Provider'

interface BudgetProps {
  budgetSpent: number
  totalBudget: number
}

export function Budget({ budgetSpent, totalBudget }: BudgetProps): ReactNode {
  const { setCurrentType, setIsOpen } = useDrawerActions()

  if (totalBudget === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center space-y-4 p-4 text-center">
        <span className="text-black/30">
          <FormattedMessage
            id="noBudget"
            defaultMessage="You have no budget yet. Add one to get started {setBudget}"
            values={{
              setBudget: (
                <p
                  onClick={() => {
                    setCurrentType('EditTrip')
                    setIsOpen(true)
                  }}
                  className="text-accent cursor-pointer"
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
    {
      x: 'Remaining',
      y: remainingPercentage,
      value: totalBudget - budgetSpent,
    },
    { x: 'Spent', y: percentageSpent, value: budgetSpent },
  ]

  return (
    <div className="relative">
      <svg width={280} height={200} className="mx-auto">
        <VictoryPie
          standalone={false}
          width={280}
          startAngle={90}
          endAngle={-90}
          data={data}
          theme={VictoryTheme.clean}
          colorScale={['#a5a0a0', color]}
          labelIndicator={false}
          labels={({ datum }) => `${datum.value}€`}
          labelComponent={<VictoryTooltip />}
        />
      </svg>
      <div className="absolute left-0 top-0 h-max w-full text-center text-black">
        <div className="text-lg">
          <FormattedMessage
            id="budgetSpent"
            defaultMessage={`{budgetSpent} of {totalBudget} spent`}
            values={{
              budgetSpent: (
                <FormattedNumber
                  value={budgetSpent}
                  currency="USD"
                  style="currency"
                  maximumFractionDigits={1}
                />
              ),
              totalBudget: (
                <FormattedNumber
                  value={totalBudget}
                  currency="USD"
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
