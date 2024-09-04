import { getJourney, getJourneyDays } from '@/api/calls/journeys'
import type { IWantToStep } from '@/providers/QuickActions.Provider'
import { useQuickActionsModalActions } from '@/providers/QuickActions.Provider'
import type { Day, Journey } from '@/types'
import * as Dialog from '@radix-ui/react-dialog'
import { ArrowLeftIcon, Cross2Icon } from '@radix-ui/react-icons'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { IWantToView } from './IWantTo.View'

export interface IWantToProps {
  isOpen: boolean
  currentStep: IWantToStep
  selectedDay: string | null
}

export function IWantTo({ isOpen, currentStep, selectedDay }: IWantToProps) {
  const { setCurrentStep, setIsOpen } = useQuickActionsModalActions()
  const { query } = useRouter()

  const { data: days } = useQuery({
    queryKey: ['journey', 'days', query.id],
    queryFn: () => getJourneyDays({ journeyId: query.id as string }),
  })

  const { data: journey } = useQuery({
    queryKey: ['journey', query.id],
    queryFn: () => getJourney({ journeyId: query.id as string }),
  })

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={() => {
        if (!open) {
          setIsOpen(true)
          setCurrentStep('Select action')
        } else {
          setIsOpen(false)
          setCurrentStep('Select action')
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
              <h3 className="font-serif text-xl">{currentStep}</h3>
            </Dialog.Title>
          </div>
          <IWantToView
            setOpen={setIsOpen}
            currentStep={currentStep}
            selectedDay={selectedDay}
            setCurrentStep={setCurrentStep}
            days={days as Day[]}
            journey={journey as unknown as Journey}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
