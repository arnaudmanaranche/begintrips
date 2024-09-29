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
  selectedDay: string | null
}

export function IWantToView({
  currentStep,
  setCurrentStep,
  days,
  journey,
  selectedDay,
}: IWantToViewProps): ReactNode {
  const dayId = selectedDay
    ? days.find((day) => day.startDate === selectedDay)?.id || ''
    : days[0].id

  const startDate = selectedDay
    ? days.find((day) => day.startDate === selectedDay)?.startDate || ''
    : days[0].startDate

  const [newExpense, setNewExpense] = useState<AddExpenseWithCategories>({
    name: '',
    amount: 0,
    dayId,
    journeyId: journey.id,
    startDate,
    category_id: '',
    categories: {
      name: '',
    },
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
        />
      )
    case 'Change destination':
      return <ChangeDestination destination={journey.destination} />
    case 'Update budget':
      return <UpdateBudget budget={journey.budget as number} />
    default:
      return (
        <AddManuallyExpense
          newExpense={newExpense}
          setNewExpense={setNewExpense}
          days={days}
        />
      )
  }
}
