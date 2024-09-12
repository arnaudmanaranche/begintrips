import { motion } from 'framer-motion'
import type { Dispatch, ReactNode, SetStateAction } from 'react'

import { useCreateExpense } from '@/api/hooks/createExpense'
import { Button } from '@/components/Button/Button'
import { Callout } from '@/components/Callout/Callout'
import { Input } from '@/components/Input/Input'
import { useQuickActionsModalActions } from '@/providers/QuickActions.Provider'
import type { AddExpense, Day } from '@/types'
import { formatDate } from '@/utils/date'

interface AddManuallyExpenseProps {
  newExpense: AddExpense
  setNewExpense: Dispatch<SetStateAction<AddExpense>>
  days: Day[]
}

export function AddManuallyExpense({
  newExpense,
  setNewExpense,
  days,
}: AddManuallyExpenseProps): ReactNode {
  const { setIsOpen, setCurrentStep } = useQuickActionsModalActions()

  const { handleCreateExpense, isPending, isError, error } = useCreateExpense({
    onSuccessCallback: () => {
      setIsOpen(false)
      setCurrentStep('Select action')
    },
  })

  return (
    <div className="flex flex-col space-y-6">
      {isError ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="transition-opacity"
        >
          <Callout.Danger>{error?.message}</Callout.Danger>
        </motion.div>
      ) : null}
      <Input
        id="expense-name"
        type="text"
        label="Name"
        value={newExpense.name}
        onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
      />
      <Input
        id="expense-amount"
        label="Amount"
        type="number"
        value={newExpense.amount}
        onChange={(e) =>
          setNewExpense({
            ...newExpense,
            amount: parseFloat(e.target.value),
          })
        }
      />
      <label htmlFor="expense-day">Date</label>
      <select
        id="expense-day"
        className="rounded-md border-2 border-gray-100 bg-slate-50 px-2 py-4 outline-none transition-all placeholder:text-black/50 focus:border-neutral-dark focus:outline-none"
        onChange={(e) => {
          const selectedDay = JSON.parse(e.target.value)
          setNewExpense((prev) => ({
            ...prev,
            dayId: selectedDay.id,
            startDate: selectedDay.startDate,
          }))
        }}
        defaultValue={JSON.stringify({
          id: newExpense.dayId,
          startDate: newExpense.startDate,
        })}
      >
        <option disabled value="Select a day">
          Select a day
        </option>
        {days
          .sort((a, b) => a.startDate.localeCompare(b.startDate))
          .map((day) => (
            <option
              key={new Date(day.startDate).toString()}
              value={JSON.stringify({
                id: day.id,
                startDate: day.startDate,
              })}
            >
              {formatDate(day.startDate, 'EEEE - dd MMMM yyyy')}
            </option>
          ))}
      </select>
      <Button
        onClick={() => handleCreateExpense({ expense: newExpense })}
        isDisabled={isPending}
      >
        {isPending ? 'Adding new expense...' : 'Add new expense'}
      </Button>
    </div>
  )
}
