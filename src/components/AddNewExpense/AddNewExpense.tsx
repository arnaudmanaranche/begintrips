import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'
import { AddNewExpenseView } from './AddNewExpense.View'
import { type Day } from '@/types'
import {
  ArrowLeftIcon,
  CaretRightIcon,
  Cross2Icon,
} from '@radix-ui/react-icons'

export type AddNewExpenseStep = 'Select category' | 'Fill information'

export interface AddNewExpenseProps {
  days: Day[]
}

export function AddNewExpense({ days }: AddNewExpenseProps) {
  const [currentStep, setCurrentStep] =
    useState<AddNewExpenseStep>('Select category')
  const [open, setOpen] = useState(false)

  return (
    <Dialog.Root
      open={open}
      onOpenChange={() => {
        if (!open) {
          setOpen(true)
          setCurrentStep('Select category')
        } else {
          setOpen(false)
        }
      }}
    >
      <Dialog.Trigger
        asChild
        className="mx-auto flex justify-center space-x-0 sm:space-x-2"
      >
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0">
          <input
            type="text"
            placeholder="I want to..."
            className="rounded-md border-2 border-gray-100 bg-slate-50 px-10 py-4 outline-none transition-all placeholder:text-black/50 focus:border-neutral-dark focus:outline-none"
          />
          <button className="flex items-center justify-center rounded-2xl bg-accent p-2 text-white">
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
            <div className="mb-6 flex items-center justify-between">
              {currentStep === 'Fill information' ? (
                <ArrowLeftIcon
                  className="cursor-pointer"
                  onClick={() => setCurrentStep('Select category')}
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
            <Dialog.Title className="text-xl">Add a new expense</Dialog.Title>
          </div>
          <AddNewExpenseView
            setOpen={setOpen}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            days={days}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
