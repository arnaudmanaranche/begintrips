import { addDays, isAfter, isBefore, isSameDay, subDays } from 'date-fns'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import type { ChangeEvent } from 'react'
import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useCallback,
  useState,
} from 'react'
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
  const [isOnSeveralDays, setOnSeveralDays] = useState(false)

  const { handleCreateExpense, isPending, isError, error } = useCreateExpense({
    onSuccessCallback: () => {
      setIsOpen(false)
      setCurrentStep('Select action')
    },
  })

  const handleOnToggleSeveralDays = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const isChecked = e.target.checked
      setOnSeveralDays(isChecked)

      if (isChecked && newExpense.startDate) {
        setNewExpense((prev) => ({
          ...prev,
          endDate: formatDate(
            addDays(new Date(prev.startDate), 1),
            'yyyy-MM-dd'
          ),
        }))
      } else if (!isChecked) {
        setNewExpense((prev) => ({
          ...prev,
          endDate: null,
        }))
      }
    },
    [newExpense.startDate, setNewExpense]
  )

  const handleStartDateChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const selectedDay = JSON.parse(e.target.value)
      const newStartDate = new Date(selectedDay.startDate)
      const previousEndDate = newExpense.endDate
        ? new Date(newExpense.endDate)
        : null

      setNewExpense((prev) => ({
        ...prev,
        dayId: selectedDay.id,
        startDate: selectedDay.startDate,
      }))

      if (
        previousEndDate &&
        (isBefore(previousEndDate, newStartDate) ||
          isSameDay(previousEndDate, newStartDate) ||
          isAfter(previousEndDate, new Date(days[days.length - 1].startDate)))
      ) {
        setNewExpense((prev) => ({
          ...prev,
          endDate: formatDate(addDays(newStartDate, 1), 'yyyy-MM-dd'),
        }))
      }
    },
    [days, newExpense.endDate, setNewExpense]
  )

  const handleEndDateChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const newEndDate = new Date(e.target.value)
      const previousStartDate = newExpense.startDate
        ? new Date(newExpense.startDate)
        : null

      setNewExpense((prev) => ({
        ...prev,
        endDate: formatDate(newEndDate, 'yyyy-MM-dd'),
      }))

      if (
        previousStartDate &&
        (isBefore(newEndDate, previousStartDate) ||
          isSameDay(previousStartDate, newEndDate))
      ) {
        const day = days.find(
          (day) =>
            day.startDate === formatDate(subDays(newEndDate, 1), 'yyyy-MM-dd')
        )

        setNewExpense((prev) => ({
          ...prev,
          dayId: day?.id as string,
          startDate: formatDate(subDays(newEndDate, 1), 'yyyy-MM-dd'),
        }))
      }
    },
    [days, newExpense.startDate, setNewExpense]
  )

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
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <label htmlFor="expense-several-days" className="text-sm text-accent">
            <FormattedMessage
              id="severalDays"
              defaultMessage="On several days"
            />
          </label>
          <input
            type="checkbox"
            id="expense-several-days"
            checked={isOnSeveralDays}
            onChange={handleOnToggleSeveralDays}
          />
        </div>
        <div className="flex space-x-3">
          <div className="flex flex-grow flex-col space-y-1">
            <label
              htmlFor="expense-startDate"
              className="px-4 text-xs text-accent"
            >
              {isOnSeveralDays ? (
                <FormattedMessage id="startDate" defaultMessage="Start date" />
              ) : (
                <FormattedMessage id="date" defaultMessage="Date" />
              )}
            </label>
            <select
              id="expense-startDate"
              className="rounded-md border-2 border-gray-100 bg-slate-50 px-4 py-4 outline-none transition-all placeholder:text-black/50 focus:border-neutral-dark focus:outline-none"
              onChange={handleStartDateChange}
              value={JSON.stringify({
                id: newExpense.dayId,
                startDate: newExpense.startDate,
              })}
            >
              <option disabled value="Select a day">
                <FormattedMessage
                  id="selectDay"
                  defaultMessage="Select a day"
                />
              </option>
              {days
                .sort((a, b) => a.startDate.localeCompare(b.startDate))
                .map((day, index) => (
                  <option
                    key={new Date(day.startDate).toString()}
                    value={JSON.stringify({
                      id: day.id,
                      startDate: day.startDate,
                    })}
                    disabled={index === days.length - 1 && isOnSeveralDays}
                  >
                    {formatDate(
                      day.startDate,
                      'EEEE, dd MMMM yyyy',
                      true,
                      router.locale
                    )}
                  </option>
                ))}
            </select>
          </div>
          {isOnSeveralDays ? (
            <div className="flex flex-grow flex-col space-y-1">
              <label
                htmlFor="expense-endDate"
                className="px-4 text-xs text-accent"
              >
                <FormattedMessage id="endDate" defaultMessage="End date" />
              </label>
              <select
                id="expense-endDate"
                className="rounded-md border-2 border-gray-100 bg-slate-50 px-4 py-4 outline-none transition-all placeholder:text-black/50 focus:border-neutral-dark focus:outline-none"
                onChange={handleEndDateChange}
                value={newExpense.endDate as string}
              >
                <option disabled value="Select a day">
                  <FormattedMessage
                    id="selectDay"
                    defaultMessage="Select a day"
                  />
                </option>
                {days
                  .sort((a, b) => a.startDate.localeCompare(b.startDate))
                  .map((day, index) => (
                    <option
                      key={new Date(day.startDate).toString()}
                      value={day.startDate}
                      disabled={index === 0}
                    >
                      {formatDate(
                        day.startDate,
                        'EEEE, dd MMMM yyyy',
                        true,
                        router.locale
                      )}
                    </option>
                  ))}
              </select>
            </div>
          ) : null}
        </div>
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
