import {
  BarChartIcon,
  CalendarIcon,
  GlobeIcon,
  PlusIcon,
} from '@radix-ui/react-icons'
import clsx from 'clsx'
import type { ReactElement, ReactNode } from 'react'
import { useMemo } from 'react'
import { FormattedMessage } from 'react-intl'

import type { IWantToStep } from '@/providers/QuickActions.Provider'
import { hasJourneyPassed } from '@/utils/has-journey-passed'

interface SelectActionProps {
  setCurrentStep: (step: IWantToStep) => void
  departureDate: string
}

export function SelectAction({
  setCurrentStep,
  departureDate,
}: SelectActionProps): ReactNode {
  const actions: {
    icon: ReactNode
    label: ReactNode
    step: IWantToStep
    disabled: boolean
  }[] = useMemo(() => {
    return [
      {
        icon: <PlusIcon />,
        label: (
          <FormattedMessage
            id="addManuallyExpense"
            defaultMessage="Add manually expense"
          />
        ),
        step: 'Select category',
        // Adding manually expense is always possible
        disabled: false,
      },
      {
        icon: <CalendarIcon />,
        label: (
          <FormattedMessage id="changeDates" defaultMessage="Change dates" />
        ),
        step: 'Change dates',
        disabled: hasJourneyPassed(new Date(departureDate)),
      },
      {
        icon: <GlobeIcon />,
        label: (
          <FormattedMessage
            id="changeDestination"
            defaultMessage="Change destination"
          />
        ),
        step: 'Change destination',
        disabled: hasJourneyPassed(new Date(departureDate)),
      },
      {
        icon: <BarChartIcon />,
        label: (
          <FormattedMessage id="updateBudget" defaultMessage="Update budget" />
        ),
        step: 'Update budget',
        disabled: hasJourneyPassed(new Date(departureDate)),
      },
    ]
  }, [departureDate])

  return (
    <div className="mt-10 grid grid-cols-2 gap-5">
      {actions.map((action) => (
        <div
          key={(action.label as ReactElement)?.props?.id}
          className={clsx(
            'flex flex-col items-center justify-center space-y-2 rounded-lg border-[1px] border-neutral p-4 text-black transition-colors',
            action.disabled
              ? 'cursor-not-allowed opacity-50 hover:border-neutral hover:bg-transparent'
              : 'cursor-pointer hover:border-accent-dark hover:bg-accent-light/30'
          )}
          onClick={() => {
            if (!action.disabled) {
              setCurrentStep(action.step)
            }
          }}
        >
          {action.icon}
          <span>{action.label}</span>
        </div>
      ))}
    </div>
  )
}
