import { type ReactNode } from 'react'
import { FormattedMessage, FormattedNumber } from 'react-intl'

import { useDrawerActions } from '@/providers/Drawer/Drawer.Provider'

interface BudgetProps {
  budgetSpent: number
  totalBudget: number
}

export function Budget({ budgetSpent, totalBudget }: BudgetProps): ReactNode {
  const { setCurrentType, setIsOpen } = useDrawerActions()
  const currency = localStorage.getItem('currency')

  if (totalBudget === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center space-y-4 p-4 text-center">
        <span className="text-black/30">
          <FormattedMessage
            id="noBudget"
            defaultMessage="You have no budget yet. {setBudget}"
            values={{
              setBudget: (
                <p
                  onClick={() => {
                    setCurrentType('EditTrip')
                    setIsOpen(true)
                  }}
                  className="cursor-pointer text-primary"
                >
                  <FormattedMessage
                    id="setBudget"
                    defaultMessage="Set a budget"
                  />
                </p>
              ),
            }}
          />
        </span>
      </div>
    )
  }

  const percentage = (budgetSpent / totalBudget) * 100
  const radius = 60
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  let color
  if (percentage <= 50) {
    color = '#4CAF50'
  } else if (percentage <= 80) {
    color = '#FFA500'
  } else {
    color = '#FF0000'
  }

  return (
    <div className="pt-6">
      <div className="flex flex-col items-center">
        <div className="relative flex h-48 w-48 items-center justify-center">
          <svg className="h-48 w-48 -rotate-90 transform" viewBox="0 0 144 144">
            <circle
              cx="72"
              cy="72"
              r={radius}
              className="fill-none stroke-muted stroke-2"
            />
            <circle
              cx="72"
              cy="72"
              r={radius}
              className={`fill-none stroke-[${color}] stroke-2`}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-bold">
              <FormattedNumber
                value={budgetSpent}
                style="currency"
                currency={currency || 'EUR'}
              />
            </span>
            <span className="text-muted-foreground text-sm">
              <FormattedMessage id="spent" defaultMessage="Spent" />
            </span>
          </div>
        </div>
        <div className="mt-6 flex w-full justify-end px-4 pb-4">
          <div className="flex flex-col items-end">
            <span className="text-xl font-semibold">
              <FormattedNumber
                value={totalBudget - budgetSpent}
                style="currency"
                currency={currency || 'EUR'}
              />
            </span>
            <span className="text-muted-foreground text-sm">
              <FormattedMessage
                id="leftToSpend"
                defaultMessage="Left to spend"
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
