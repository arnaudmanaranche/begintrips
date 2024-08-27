import type { Journey } from '@/types'
import { type AddExpense, type Day } from '@/types'
import { useState } from 'react'
import { type IWantToStep } from './IWantTo'
import { AddManuallyExpense } from './views/AddManuallyExpense'
import { ChangeDates } from './views/ChangeDates'
import { ChangeDestination } from './views/ChangeDestination'
import { SelectAction } from './views/SelectAction'
import { SelectCategory } from './views/SelectCategory'
import { UpdateBudget } from './views/UpdateBudget'

export interface IWantToViewProps {
  currentStep: IWantToStep
  setCurrentStep: (step: IWantToStep) => void
  days: Day[]
  setOpen: (open: boolean) => void
  journey: Journey
}

export function IWantToView({
  currentStep,
  setCurrentStep,
  days,
  setOpen,
  journey,
}: IWantToViewProps) {
  const [newExpense, setNewExpense] = useState<AddExpense>({
    category: 'other',
    name: '',
    amount: 0,
    dayId: days[0].id,
    journeyId: journey.id,
    startDate: days[0].startDate,
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
          setOpen={setOpen}
        />
      )
    case 'Change destination':
      return <ChangeDestination destination={journey.destination} />
    case 'Update budget':
      return (
        <UpdateBudget budget={journey.budget as number} setOpen={setOpen} />
      )
    default:
      return (
        <AddManuallyExpense
          newExpense={newExpense}
          setNewExpense={setNewExpense}
          days={days}
          setOpen={setOpen}
        />
      )
  }
}
