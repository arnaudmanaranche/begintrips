import clsx from 'clsx'
import type { ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

export interface CurrentPlanProps {
  credits: number
  isLoading: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onCheckout: (...args: any[]) => void
}

export function CurrentPlan({
  isLoading,
  onCheckout,
  credits,
}: CurrentPlanProps): ReactNode {
  return (
    <div className="flex items-center justify-between rounded-md bg-white p-4 text-black ring-1 ring-slate-200">
      <div className="flex w-full flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
        <div className="flex items-center justify-between space-y-2 text-black md:flex-col md:items-start">
          <p className="text-sm">
            <FormattedMessage id="plan" defaultMessage="Plan" />
          </p>
          <p className="text-2xl font-medium">
            <FormattedMessage id="free" defaultMessage="Free" />
          </p>
        </div>
        <div className="flex items-center justify-between space-y-2 text-black md:flex-col md:items-start">
          <p className="text-sm">
            <FormattedMessage id="creditsLeft" defaultMessage="Credits left" />
          </p>
          <p className="text-2xl font-medium">{credits}</p>
        </div>
        <div className="space-x-3 text-sm text-black/70">
          <span
            className={clsx(
              'cursor-pointer text-accent',
              isLoading && 'cursor-not-allowed'
            )}
            onClick={onCheckout}
          >
            {isLoading ? (
              <FormattedMessage
                id="redirecting"
                defaultMessage="Redirecting..."
              />
            ) : (
              <FormattedMessage
                id="buyMoreCredits"
                defaultMessage="Buy more credits"
              />
            )}
          </span>
        </div>
      </div>
    </div>
  )
}
