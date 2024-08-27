import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'
import { IWantToView } from './IWantTo.View'
import type { Journey } from '@/types'
import { type Day } from '@/types'
import {
  ArrowLeftIcon,
  CaretRightIcon,
  Cross2Icon,
} from '@radix-ui/react-icons'

export type IWantToStep =
  | 'Select action'
  | 'Update budget'
  | 'Change dates'
  | 'Change destination'
  | 'Select category'
  | 'Add manually expense'

export interface IWantToProps {
  days: Day[]
  journey: Journey
}

export function IWantTo({ days, journey }: IWantToProps) {
  const [currentStep, setCurrentStep] = useState<IWantToStep>('Select action')
  const [open, setOpen] = useState(false)

  return (
    <Dialog.Root
      open={open}
      onOpenChange={() => {
        if (!open) {
          setOpen(true)
          setCurrentStep('Select action')
        } else {
          setOpen(false)
        }
      }}
    >
      <Dialog.Trigger asChild>
        <div className="flex">
          <div className="flex-1 cursor-pointer rounded-md bg-gray-50 p-4 text-black/50 outline-none transition-all">
            I want to...
          </div>
          <button className="rounded-r-lg bg-accent text-white">
            <CaretRightIcon height={20} width={20} />
          </button>
        </div>
      </Dialog.Trigger>
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
            setOpen={setOpen}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            days={days}
            journey={journey}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
