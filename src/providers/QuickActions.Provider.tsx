import { IWantTo } from '@/components/IWantTo/IWantTo'
import type { ReactNode } from 'react'
import { createContext, useContext, useState } from 'react'

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
  selectedDay: string | null
}

interface QuickActionsModalActions {
  setIsOpen: (value: boolean) => void
  setCurrentStep: (step: IWantToStep) => void
  setSelectedDay: (day: string) => void
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
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

  const state: QuickActionsModalState = { isOpen, currentStep, selectedDay }
  const actions: QuickActionsModalActions = {
    setIsOpen,
    setCurrentStep,
    setSelectedDay,
  }

  return (
    <QuickActionsModalStateContext.Provider value={state}>
      <QuickActionsModalActionsContext.Provider value={actions}>
        {children}
        <IWantTo
          isOpen={isOpen}
          currentStep={currentStep}
          selectedDay={selectedDay}
        />
      </QuickActionsModalActionsContext.Provider>
    </QuickActionsModalStateContext.Provider>
  )
}

// Custom hook to access state
export function useQuickActionsModalState(): QuickActionsModalState {
  const context = useContext(QuickActionsModalStateContext)
  if (context === undefined) {
    throw new Error(
      'useQuickActionsModalState must be used within a QuickActionsModalProvider'
    )
  }
  return context
}

// Custom hook to access actions
export function useQuickActionsModalActions(): QuickActionsModalActions {
  const context = useContext(QuickActionsModalActionsContext)
  if (context === undefined) {
    throw new Error(
      'useQuickActionsModalActions must be used within a QuickActionsModalProvider'
    )
  }
  return context
}
