import {
  BarChartIcon,
  CalendarIcon,
  GlobeIcon,
  PlusIcon,
} from '@radix-ui/react-icons'
import clsx from 'clsx'
import type { ReactNode } from 'react'
import { useMemo } from 'react'

import type { IWantToStep } from '@/providers/QuickActions.Provider'
import { hasJourneyPassed } from '@/utils/has-journey-passed'

export interface SelectActionProps {
  setCurrentStep: (step: IWantToStep) => void
  departureDate: string
}

export function SelectAction({
  setCurrentStep,
  departureDate,
}: SelectActionProps) {
  const actions: {
    icon: ReactNode
    label: string
    step: IWantToStep
    disabled: boolean
  }[] = useMemo(() => {
    return [
      {
        icon: <PlusIcon />,
        label: 'Add manually expense',
        step: 'Select category',
        // Adding manually expense is always possible
        disabled: false,
      },
      {
        icon: <CalendarIcon />,
        label: 'Change dates',
        step: 'Change dates',
        disabled: hasJourneyPassed(new Date(departureDate)),
      },
      {
        icon: <GlobeIcon />,
        label: 'Change destination',
        step: 'Change destination',
        disabled: hasJourneyPassed(new Date(departureDate)),
      },
      {
        icon: <BarChartIcon />,
        label: 'Update budget',
        step: 'Update budget',
        disabled: hasJourneyPassed(new Date(departureDate)),
      },
    ]
  }, [departureDate])

  return (
    <div className="mt-10 grid grid-cols-2 gap-5">
      {actions.map((action) => (
        <div
          key={action.label}
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
