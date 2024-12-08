import { Outfit } from 'next/font/google'
import type { ReactNode } from 'react'
import { createContext, useContext, useState } from 'react'
import { Drawer } from 'vaul'

import { FeedbackView } from './views/Feedback.view'

export type DrawerType = 'Feedback'

interface DrawerState {
  isOpen: boolean
  currentType: DrawerType
  selectedExpense: {
    startDate: string
  }
}

interface DrawerActions {
  setIsOpen: (value: boolean) => void
  setCurrentType: (step: DrawerType) => void
  setSelectedExpense: ({
    startDate,
    endDate,
  }: {
    startDate: string
    endDate?: string
  }) => void
}

const DrawerStateContext = createContext<DrawerState | undefined>(undefined)
const DrawerActionsContext = createContext<DrawerActions | undefined>(undefined)

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-outfit',
  display: 'optional',
})

export function DrawerProvider({
  children,
}: {
  children: ReactNode
}): ReactNode {
  const [isOpen, setIsOpen] = useState(false)
  const [currentType, setCurrentType] = useState<DrawerType>('Feedback')
  const [selectedExpense, setSelectedExpense] = useState<{
    startDate: string
    endDate?: string
  }>({
    startDate: '',
  })

  const state: DrawerState = { isOpen, currentType, selectedExpense }
  const actions: DrawerActions = {
    setIsOpen,
    setCurrentType,
    setSelectedExpense,
  }

  return (
    <DrawerStateContext.Provider value={state}>
      <DrawerActionsContext.Provider value={actions}>
        <Drawer.Root direction="right">
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-black/40" />
            <Drawer.Content
              className={`${outfit.variable} fixed bottom-2 right-2 top-2 z-10 flex w-[410px] outline-none`}
              // The gap between the edge of the screen and the drawer is 8px in this case.
              style={
                {
                  '--initial-transform': 'calc(100% + 8px)',
                } as React.CSSProperties
              }
            >
              {currentType === 'Feedback' && <FeedbackView />}
            </Drawer.Content>
          </Drawer.Portal>
          {children}
        </Drawer.Root>
      </DrawerActionsContext.Provider>
    </DrawerStateContext.Provider>
  )
}

export function useDrawerActions(): DrawerActions {
  const context = useContext(DrawerActionsContext)
  if (context === undefined) {
    throw new Error(
      'useDrawerActions must be used within a QuickActionsModalProvider'
    )
  }
  return context
}
