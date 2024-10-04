import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { FormattedMessage } from 'react-intl'

import { useCreateExpense } from '@/api/hooks/createExpense'
import { Button } from '@/components/Button/Button'
import { Callout } from '@/components/Callout/Callout'
import { Input } from '@/components/Input/Input'
import { useQuickActionsModalActions } from '@/providers/QuickActions.Provider'
import type { AddExpenseWithCategories, Day } from '@/types'
import { formatDate } from '@/utils/date'

interface AddManuallyExpenseProps {
  newExpense: AddExpenseWithCategories
  setNewExpense: Dispatch<SetStateAction<AddExpenseWithCategories>>
  days: Day[]
}

export function AddManuallyExpense({
  newExpense,
  setNewExpense,
  days,
}: AddManuallyExpenseProps): ReactNode {
  const { setIsOpen, setCurrentStep } = useQuickActionsModalActions()
  const router = useRouter()
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
        label={<FormattedMessage id="inputNameLabel" defaultMessage="Name" />}
        id="expense-name"
        type="text"
        value={newExpense.name}
        onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
      />
      <Input
        label={
          <FormattedMessage id="inputAmountLabel" defaultMessage="Amount" />
        }
        id="expense-amount"
        type="number"
        value={newExpense.amount}
        onChange={(e) =>
          setNewExpense({
            ...newExpense,
            amount: parseFloat(e.target.value),
          })
        }
      />
      <div className="flex flex-col space-y-1">
        <label htmlFor="expense-day" className="px-4 text-xs text-accent">
          Date
        </label>
        <select
          id="expense-day"
          className="rounded-md border-2 border-gray-100 bg-slate-50 px-4 py-4 outline-none transition-all placeholder:text-black/50 focus:border-neutral-dark focus:outline-none"
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
                {formatDate(
                  day.startDate,
                  'EEEE - dd MMMM yyyy',
                  true,
                  router.locale
                )}
              </option>
            ))}
        </select>
      </div>
      <Button
        onClick={() => handleCreateExpense({ expense: newExpense })}
        isDisabled={isPending}
      >
        {isPending ? (
          <FormattedMessage
            id="addingExpense"
            defaultMessage="Adding new expense..."
          />
        ) : (
          <FormattedMessage
            id="addNewExpense"
            defaultMessage="Add new expense"
          />
        )}
      </Button>
    </div>
  )
}
