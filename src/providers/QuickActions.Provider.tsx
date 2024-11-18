import type { ReactNode } from 'react'
import { createContext, useContext, useState } from 'react'

import { IWantTo } from '@/components/IWantTo/IWantTo'

export type IWantToStep =
  | 'Select action'
  | 'Update budget'
  | 'Change dates'
  | 'Change destination'
  | 'Select category'
  | 'Add manually expense'

interface QuickActionsModalState {
  isOpen: boolean
  currentStep: IWantToStep
  selectedExpense: {
    startDate: string
  }
}

interface QuickActionsModalActions {
  setIsOpen: (value: boolean) => void
  setCurrentStep: (step: IWantToStep) => void
  setSelectedExpense: ({
    startDate,
    endDate,
  }: {
    startDate: string
    endDate?: string
  }) => void
}

const QuickActionsModalStateContext = createContext<
  QuickActionsModalState | undefined
>(undefined)
const QuickActionsModalActionsContext = createContext<
  QuickActionsModalActions | undefined
>(undefined)

export function QuickActionsModalProvider({
  children,
}: {
  children: ReactNode
}): ReactNode {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState<IWantToStep>('Select action')
  const [selectedExpense, setSelectedExpense] = useState<{
    startDate: string
    endDate?: string
  }>({
    startDate: '',
  })

  const state: QuickActionsModalState = { isOpen, currentStep, selectedExpense }
  const actions: QuickActionsModalActions = {
    setIsOpen,
    setCurrentStep,
    setSelectedExpense,
  }

  return (
    <QuickActionsModalStateContext.Provider value={state}>
      <QuickActionsModalActionsContext.Provider value={actions}>
        {children}
        <IWantTo
          isOpen={isOpen}
          currentStep={currentStep}
          selectedExpense={selectedExpense}
        />
      </QuickActionsModalActionsContext.Provider>
    </QuickActionsModalStateContext.Provider>
  )
}

export function useQuickActionsModalActions(): QuickActionsModalActions {
  const context = useContext(QuickActionsModalActionsContext)
  if (context === undefined) {
    throw new Error(
      'useQuickActionsModalActions must be used within a QuickActionsModalProvider'
    )
  }
  return context
}
