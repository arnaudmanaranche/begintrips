import type { ReactNode } from 'react'
import { useState } from 'react'

import type { IWantToStep } from '@/providers/QuickActions.Provider'
import type { AddExpenseWithCategories, Journey } from '@/types'
import { type Day } from '@/types'

import { AddManuallyExpense } from './views/AddManuallyExpense'
import { ChangeDates } from './views/ChangeDates'
import { ChangeDestination } from './views/ChangeDestination'
import { SelectAction } from './views/SelectAction'
import { SelectCategory } from './views/SelectCategory'
import { UpdateBudget } from './views/UpdateBudget'

interface IWantToViewProps {
  currentStep: IWantToStep
  setCurrentStep: (step: IWantToStep) => void
  days: Day[]
  journey: Journey
  selectedExpense: {
    startDate: string
    endDate?: string
  }
  setFooter: (
    footer:
      | {
          cta: {
            label: string
            onClick: () => void
            disabled?: boolean
          }
        }
      | undefined
  ) => void
}

export function IWantToView({
  currentStep,
  setCurrentStep,
  days,
  journey,
  selectedExpense,
  setFooter,
}: IWantToViewProps): ReactNode {
  const dayId = selectedExpense.startDate
    ? days.find((day) => day.startDate === selectedExpense.startDate)?.id || ''
    : days[0].id

  const [newExpense, setNewExpense] = useState<AddExpenseWithCategories>({
    name: '',
    amount: 0,
    dayId,
    journeyId: journey.id,
    startDate: selectedExpense.startDate,
    category_id: '',
    categories: {
      name: '',
    },
    endDate: selectedExpense.endDate,
  })

  switch (currentStep) {
    case 'Select action':
      return (
        <SelectAction
          setCurrentStep={setCurrentStep}
          departureDate={journey.departureDate}
        />
      )
    case 'Select category':
      return (
        <SelectCategory
          setCurrentStep={setCurrentStep}
          setNewExpense={setNewExpense}
        />
      )
    case 'Change dates':
      return (
        <ChangeDates
          departureDate={journey.departureDate}
          returnDate={journey.returnDate}
          setFooter={setFooter}
        />
      )
    case 'Change destination':
      return (
        <ChangeDestination
          destination={journey.destination}
          setFooter={setFooter}
        />
      )
    case 'Update budget':
      return (
        <UpdateBudget budget={journey.budget as number} setFooter={setFooter} />
      )
    default:
      return (
        <AddManuallyExpense
          newExpense={newExpense}
          setNewExpense={setNewExpense}
          days={days}
          setFooter={setFooter}
        />
      )
  }
}
