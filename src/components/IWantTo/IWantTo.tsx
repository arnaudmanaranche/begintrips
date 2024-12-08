import * as Dialog from '@radix-ui/react-dialog'
import { ArrowLeftIcon, Cross2Icon } from '@radix-ui/react-icons'
import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { type ReactNode, useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { getJourney, getJourneyDays } from '@/api/calls/journeys'
import { QUERY_KEYS } from '@/api/queryKeys'
import type { IWantToStep } from '@/providers/QuickActions.Provider'
import { useQuickActionsModalActions } from '@/providers/QuickActions.Provider'
import type { Day, Journey } from '@/types'

import { Button } from '../Button/Button'
import { IWantToView } from './IWantTo.View'

interface IWantToProps {
  isOpen: boolean
  currentStep: IWantToStep
  selectedExpense: {
    startDate: string
  }
}

function FormattedIWantToTitle({ currentStep }: { currentStep: IWantToStep }) {
  switch (currentStep) {
    case 'Select action':
      return (
        <FormattedMessage id="selectAction" defaultMessage="Select action" />
      )
    case 'Select category':
      return (
        <FormattedMessage
          id="selectCategory"
          defaultMessage="Select category"
        />
      )
    case 'Change dates':
      return <FormattedMessage id="changeDates" defaultMessage="Change dates" />
    case 'Change destination':
      return (
        <FormattedMessage
          id="changeDestination"
          defaultMessage="Change destination"
        />
      )
    case 'Update budget':
      return (
        <FormattedMessage id="updateBudget" defaultMessage="Update budget" />
      )
    default:
      return (
        <FormattedMessage
          id="addManuallyExpense"
          defaultMessage="Add manually expense"
        />
      )
  }
}

export function IWantTo({
  isOpen,
  currentStep,
  selectedExpense,
}: IWantToProps): ReactNode {
  const { setCurrentStep, setIsOpen } = useQuickActionsModalActions()
  const {
    query: { id: journeyId },
  } = useRouter()

  const { data: days } = useQuery({
    queryKey: QUERY_KEYS.JOURNEY_DAYS(journeyId as string),
    queryFn: () => getJourneyDays({ journeyId: journeyId as string }),
  })

  const { data } = useQuery({
    queryKey: QUERY_KEYS.JOURNEY(journeyId as string),
    queryFn: () => getJourney({ journeyId: journeyId as string }),
  })

  const [footer, setFooter] = useState<{
    cta: {
      label: string
      onClick: () => void
      disabled?: boolean
    }
  }>()

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={() => {
        if (!open) {
          setCurrentStep('Select action')
          setIsOpen(true)
        } else {
          setCurrentStep('Select action')
          setIsOpen(false)
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 data-[state=open]:animate-overlayShow" />
        <Dialog.Content
          className="fixed left-[50%] top-[50%] w-[90vw] max-w-[650px] translate-x-[-50%] translate-y-[-50%] rounded-xl bg-white shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow"
          aria-describedby={undefined}
        >
          <div className="flex flex-col">
            <div className="flex items-center justify-between p-4">
              {currentStep !== 'Select action' ? (
                <button
                  onClick={() => {
                    setCurrentStep(
                      currentStep === 'Add manually expense'
                        ? 'Select category'
                        : 'Select action'
                    )
                  }}
                  className="rounded-full p-1 hover:bg-gray-100"
                  aria-label="Go back"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                </button>
              ) : null}
              <Dialog.Title asChild>
                <h3 className="text-2xl">
                  <FormattedIWantToTitle currentStep={currentStep} />
                </h3>
              </Dialog.Title>
              <div className="flex items-center space-x-4">
                <Dialog.Close asChild>
                  <button
                    className="rounded-full p-1 hover:bg-gray-100"
                    aria-label="Close"
                  >
                    <Cross2Icon className="h-5 w-5" />
                  </button>
                </Dialog.Close>
              </div>
            </div>
            <div className="flex-grow overflow-y-auto p-4">
              <IWantToView
                currentStep={currentStep}
                selectedExpense={selectedExpense}
                setCurrentStep={setCurrentStep}
                days={days as Day[]}
                journey={data?.journey as Journey}
                setFooter={setFooter}
              />
            </div>
            <AnimatePresence>
              {footer &&
              currentStep !== 'Select action' &&
              currentStep !== 'Select category' ? (
                <motion.div
                  className="flex justify-end rounded-b-xl border-t bg-gray-100 p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Dialog.Close asChild>
                    <Button
                      onClick={footer.cta.onClick}
                      isDisabled={footer.cta.disabled}
                    >
                      <FormattedMessage
                        id={footer.cta.label.toLowerCase().replace(/\s/g, '')}
                        defaultMessage={footer.cta.label}
                      />
                    </Button>
                  </Dialog.Close>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
