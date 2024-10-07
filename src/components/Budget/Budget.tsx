import { type ReactNode } from 'react'
import { FormattedMessage, FormattedNumber } from 'react-intl'

export function Budget({
  budgetSpent,
  totalBudget,
}: {
  budgetSpent: number
  totalBudget: number
}): ReactNode {
  if (totalBudget === 0) {
    return (
      <div className="flex w-full items-center justify-center">
        <span className="text-lg text-black/30">
          <FormattedMessage id="noBudget" defaultMessage="No budget yet" />
        </span>
      </div>
    )
  }

  const percentageSpent =
    totalBudget > 0 ? (budgetSpent / totalBudget) * 100 : 0

  let strokeColor = '#4CAF50'
  if (percentageSpent > 90) {
    strokeColor = '#F44336'
  } else if (percentageSpent > 50) {
    strokeColor = '#FF9800'
  }

  const radius = 80
  const circumference = 2 * Math.PI * radius
  const offset = Math.min(
    (percentageSpent / 100) * circumference,
    circumference
  )

  return (
    <div className="relative flex min-h-[200px] items-center justify-center">
      <svg width="200" height="200" viewBox="0 0 200 200" className="absolute">
        <circle
          cx="100"
          cy="100"
          r="80"
          stroke="#e0e0e0"
          strokeWidth="10"
          fill="none"
        />
      </svg>
      <svg width="200" height="200" viewBox="0 0 200 200" className="absolute">
        <circle
          cx="100"
          cy="100"
          r="80"
          stroke={strokeColor}
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - offset}
        />
      </svg>
      <div className="absolute text-center text-gray-700">
        <div className="text-2xl font-bold">
          {budgetSpent > totalBudget
            ? '100%'
            : `${Math.round(percentageSpent)}%`}
        </div>
        <div className="mt-1 text-xs">
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
