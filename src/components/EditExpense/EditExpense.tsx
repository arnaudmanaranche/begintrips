import * as Dialog from '@radix-ui/react-dialog'
import { Cross2Icon, DotsHorizontalIcon } from '@radix-ui/react-icons'
import { useState } from 'react'

import type { Expense } from '@/types'

import { Button } from '../Button/Button'
import { EditExpenseView } from './EditExpense.View'

export interface EditExpenseProps {
  expense: Expense
}

export const EditExpense = ({ expense }: EditExpenseProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <div className="mx-auto flex justify-center space-x-2">
        <Button
          variant="ghost"
          onClick={() => {
            setOpen(true)
          }}
          className="border-none px-2 py-2 text-slate-500"
        >
          <DotsHorizontalIcon />
        </Button>
      </div>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 data-[state=open]:animate-overlayShow" />
        <Dialog.Content
          className="fixed left-[50%] top-[50%] max-h-[90vh] min-h-[500px] w-[90vw] max-w-[650px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow"
          aria-describedby={undefined}
        >
          <div className="mb-6 flex items-center justify-between">
            <Dialog.Title className="text-xl">Edit expense</Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="h-[25px] w-[25px] appearance-none items-center justify-center rounded-full outline-none"
                aria-label="Close"
              >
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </div>
          <EditExpenseView expense={expense} setOpen={setOpen} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
