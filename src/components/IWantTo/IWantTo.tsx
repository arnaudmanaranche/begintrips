import * as Dialog from '@radix-ui/react-dialog'
import { ArrowLeftIcon, Cross2Icon } from '@radix-ui/react-icons'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { type ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import { getJourney, getJourneyDays } from '@/api/calls/journeys'
import { QUERY_KEYS } from '@/api/queryKeys'
import type { IWantToStep } from '@/providers/QuickActions.Provider'
import { useQuickActionsModalActions } from '@/providers/QuickActions.Provider'
import type { Day, Journey } from '@/types'

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
          className="fixed left-[50%] top-[50%] max-h-[90vh] min-h-[500px] w-[90vw] max-w-[650px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow"
          aria-describedby={undefined}
        >
          <div className="mb-5 flex flex-col">
            <div className="flex items-center justify-between">
              {currentStep !== 'Select action' ? (
                <ArrowLeftIcon
                  className="cursor-pointer"
                  onClick={() => setCurrentStep('Select action')}
                />
              ) : (
                <div />
              )}
              <Dialog.Close asChild>
                <button
                  className="h-[25px] w-[25px] appearance-none items-center justify-center rounded-full outline-none"
                  aria-label="Close"
                >
                  <Cross2Icon />
                </button>
              </Dialog.Close>
            </div>
            <Dialog.Title asChild>
              <h3 className="font-serif text-xl">
                <FormattedIWantToTitle currentStep={currentStep} />
              </h3>
            </Dialog.Title>
          </div>
          <IWantToView
            currentStep={currentStep}
            selectedExpense={selectedExpense}
            setCurrentStep={setCurrentStep}
            days={days as Day[]}
            journey={data?.journey as Journey}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
