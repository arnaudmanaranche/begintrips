import type { CalendarEventExternal } from '@schedule-x/calendar'
import clsx from 'clsx'
import { Open_Sans, Outfit } from 'next/font/google'
import type { MutableRefObject, ReactNode } from 'react'
import { createContext, useContext, useRef, useState } from 'react'
import { Drawer } from 'vaul'

import { useMediaQuery } from '@/hooks/useMediaQuery'

import { AddExpenseView } from './views/AddExpense.view'
import { EditTripView } from './views/EditTrip.view'
import { FeedbackView } from './views/Feedback.view'

type DrawerType = 'Feedback' | 'EditTrip' | 'AddExpense' | 'EditExpense'

interface DrawerState {
  isOpen: boolean
  currentType: DrawerType
  selectedExpense: {
    startDate: string
    startTime: string
    endTime: string
    endDate?: string
    name: string
    id?: string
    amount: number
    category_id?: string
  }
}

interface DrawerActions {
  setIsOpen: (value: boolean) => void
  setCurrentType: (step: DrawerType) => void
  setSelectedExpense: ({
    startDate,
    startTime,
    endTime,
    amount,
    name,
    endDate,
    id,
    category_id,
  }: {
    startDate: string
    startTime: string
    name: string
    amount: number
    endTime: string
    endDate?: string
    id?: string
    category_id?: string
  }) => void
  ref: MutableRefObject<
    (e: CalendarEventExternal, action: 'patch' | 'delete') => void
  >
}

const DrawerStateContext = createContext<DrawerState | undefined>(undefined)
const DrawerActionsContext = createContext<DrawerActions | undefined>(undefined)

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-outfit',
  display: 'optional',
})

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-open-sans',
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
    startTime: string
    endTime: string
    name: string
    amount: number
    endDate?: string
    id?: string
    category_id?: string
  }>({
    startDate: '',
    endTime: '',
    startTime: '',
    id: '',
    category_id: '',
    name: '',
    amount: 0,
  })
  const ref = useRef(null)

  const matches = useMediaQuery('(min-width: 1024px)')

  const state: DrawerState = { isOpen, currentType, selectedExpense }
  const actions: DrawerActions = {
    setIsOpen,
    setCurrentType,
    setSelectedExpense,
    ref,
  }

  return (
    <DrawerStateContext.Provider value={state}>
      <DrawerActionsContext.Provider value={actions}>
        <Drawer.Root
          direction={matches ? 'right' : 'bottom'}
          open={isOpen}
          onOpenChange={setIsOpen}
        >
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-black/40" />
            <Drawer.Title />
            <Drawer.Content
              className={clsx(
                matches
                  ? 'fixed bottom-2 right-2 top-2 z-10 flex min-w-[310px] outline-none'
                  : 'fixed bottom-0 left-0 right-0 mt-24 flex h-fit flex-col rounded-t-[10px] bg-gray-100 outline-none',
                `${outfit.variable} ${openSans.variable}`
              )}
              style={
                {
                  '--initial-transform': 'calc(100% + 8px)',
                } as React.CSSProperties
              }
              aria-describedby={undefined}
            >
              {currentType === 'Feedback' && <FeedbackView />}
              {currentType === 'EditTrip' && <EditTripView />}
              {(currentType === 'AddExpense' ||
                currentType === 'EditExpense') && (
                <AddExpenseView
                  calendarRef={ref}
                  selectedExpense={selectedExpense}
                  isEditMode={currentType === 'EditExpense'}
                />
              )}
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
    throw new Error('useDrawerActions must be used within a DrawerProvider')
  }

  return context
}
