import { ChevronRightIcon } from '@radix-ui/react-icons'
import type { CalendarEventExternal } from '@schedule-x/calendar'
import { useQueries } from '@tanstack/react-query'
import { addDays } from 'date-fns'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import type { ChangeEvent, MutableRefObject } from 'react'
import { type ReactNode, useCallback, useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { FormattedMessage } from 'react-intl'
import { Drawer } from 'vaul'

import { getJourney } from '@/api/calls/journeys'
import { getUserFavoriteCategories } from '@/api/calls/users'
import { useCreateExpense } from '@/api/hooks/createExpense'
import { useDeleteExpense } from '@/api/hooks/deleteExpense'
import { useUpdateExpense } from '@/api/hooks/updateExpense'
import { QUERY_KEYS } from '@/api/queryKeys'
import { Button } from '@/components/Button/Button'
import { Callout } from '@/components/Callout/Callout'
import { InputTime } from '@/components/DateTimePicker/DateTimePicker'
import { Input } from '@/components/Input/Input'
import type { AddExpenseWithCategories } from '@/types'
import { formatDate } from '@/utils/date'

import { useDrawerActions } from '../Drawer.Provider'

interface AddExpenseViewProps {
  selectedExpense: {
    id: string
    startDate: string
    startTime: string
    endTime: string
    endDate?: string
    name: string
    amount: number
    category_id: string
    categories: {
      name: string
    }
  }
  isEditMode: boolean
  calendarRef: MutableRefObject<
    (e: CalendarEventExternal, action?: 'patch' | 'delete') => void
  >
}

export function AddExpenseView({
  selectedExpense,
  isEditMode,
  calendarRef,
}: AddExpenseViewProps): ReactNode {
  const { id: journeyId } = useParams()
  const [startTime, setStartTime] = useState(selectedExpense.startTime ?? '')
  const [endTime, setEndTime] = useState(selectedExpense.endTime ?? '')
  const [newExpense, setNewExpense] = useState<AddExpenseWithCategories>({
    id: selectedExpense?.id ?? '',
    name: selectedExpense?.name ?? '',
    amount: selectedExpense?.amount ?? 0,
    startDate: `${selectedExpense.startDate ?? ''} ${startTime}`,
    endDate: `${selectedExpense?.startDate ?? ''} ${endTime}`,
    category_id: selectedExpense?.category_id ?? '',
    categories: {
      name: selectedExpense?.categories?.name ?? '',
    },
    journeyId: journeyId as string,
  })
  const [isOnSeveralDays, setOnSeveralDays] = useState(false)
  const { setIsOpen } = useDrawerActions()

  const data = useQueries({
    queries: [
      {
        queryKey: QUERY_KEYS.USER_FAVORITE_CATEGORIES(),
        queryFn: () => getUserFavoriteCategories(),
      },
      {
        queryKey: QUERY_KEYS.JOURNEY(journeyId as string),
        queryFn: () => getJourney({ journeyId: journeyId as string }),
      },
    ],
    combine: (results) => {
      return {
        data: results.map((result) => result.data),
        pending: results.some((result) => result.isPending),
      }
    },
  })

  const { handleCreateExpense, isPending, isError, error } = useCreateExpense({
    onSuccessCallback: () => {
      setIsOpen(false)
      if (calendarRef) {
        calendarRef.current(newExpense as unknown as CalendarEventExternal)
      }
    },
  })

  const { handleUpdateExpense, isPending: isPendingUpdate } = useUpdateExpense({
    onSuccessCallback: () => {
      setIsOpen(false)
      if (calendarRef) {
        calendarRef.current(
          newExpense as unknown as CalendarEventExternal,
          'patch'
        )
      }
    },
  })
  const { handleDeleteExpense, isPending: isPendingDelete } = useDeleteExpense({
    onSuccessCallback: () => {
      setIsOpen(false)
      if (calendarRef) {
        calendarRef.current(
          newExpense as unknown as CalendarEventExternal,
          'delete'
        )
      }
    },
  })

  const handleOnToggleSeveralDays = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const isChecked = e.target.checked
      setOnSeveralDays(isChecked)

      if (isChecked) {
        if (newExpense?.startDate !== ' ') {
          setNewExpense((prev) => ({
            ...prev,
            endDate: formatDate(
              addDays(new Date(prev.startDate), 1),
              'yyyy-MM-dd'
            ),
          }))
        } else {
          setNewExpense((prev) => ({
            ...prev,
            startDate: formatDate(
              new Date(data.data.journey.departureDate),
              'yyyy-MM-dd'
            ),
            endDate: formatDate(
              addDays(new Date(data.data.journey.departureDate), 1),
              'yyyy-MM-dd'
            ),
          }))
        }
      } else {
        setNewExpense((prev) => ({
          ...prev,
          endDate: null,
          startDate: prev.startDate,
        }))
      }
    },
    [data.data[1].journey.departureDate, newExpense?.startDate]
  )

  const handleOnChangeStartTime = (e: ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value

    setStartTime(time)

    setNewExpense((prev) => {
      const [date] = prev.startDate.split(' ') // Extract only the date part
      const newStartDate = `${date} ${time}`
      const newEndDate = endTime < time ? newStartDate : prev.endDate

      return {
        ...prev,
        startDate: newStartDate,
        endDate: newEndDate,
      }
    })

    if (endTime < time) {
      setEndTime(time)
    }
  }

  const handleOnChangeEndTime = (e: ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value

    setEndTime(time)

    setNewExpense((prev) => {
      const [date] = prev.endDate.split(' ')
      return {
        ...prev,
        endDate: `${date} ${time}`,
      }
    })
  }

  function handleDaySelect(date: DateRange | Date | undefined) {
    if (!date) return

    if (!isOnSeveralDays) {
      setNewExpense((prev) => ({
        ...prev,
        startDate: `${formatDate(date as Date, 'yyyy-MM-dd')} ${startTime}`,
        endDate: `${formatDate(date as Date, 'yyyy-MM-dd')} ${endTime}`,
      }))
    } else {
      setNewExpense((prev) => ({
        ...prev,
        startDate: formatDate((date as DateRange).from as Date, 'yyyy-MM-dd'),
        endDate: formatDate((date as DateRange).to as Date, 'yyyy-MM-dd'),
      }))
    }
  }

  if (data.pending) {
    return null
  }

  return (
    <div className="flex h-full w-full grow flex-col space-y-4 rounded-[16px] bg-white p-5">
      <Drawer.Title className="mb-2 text-2xl font-medium text-zinc-900" asChild>
        <h3>
          <FormattedMessage
            id={isEditMode ? 'editExpense' : 'addExpense'}
            defaultMessage={isEditMode ? 'Edit expense' : 'Add expense'}
          />
        </h3>
      </Drawer.Title>
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
          value={newExpense?.name}
          onChange={(e) =>
            setNewExpense({ ...newExpense, name: e.target.value })
          }
        />
        <Input
          label={
            <FormattedMessage id="inputAmountLabel" defaultMessage="Amount" />
          }
          id="expense-amount"
          type="number"
          value={newExpense?.amount}
          onChange={(e) =>
            setNewExpense({
              ...newExpense,
              amount: parseFloat(e.target.value),
            })
          }
        />
        <div className="flex flex-col space-y-1">
          <label
            htmlFor="expense-category"
            className="text-accent px-4 text-xs"
          >
            <FormattedMessage id="categories" defaultMessage="Categories" />
          </label>
          <select
            id="expense-category"
            className="appearance-none rounded-md border-2 border-gray-100 bg-slate-50 px-4 py-4 outline-none transition-all placeholder:text-black/50 focus:border-neutral-dark focus:outline-none"
            onChange={(e) => {
              setNewExpense({
                ...newExpense,
                category_id: e.target.value,
                categories: {
                  name: e.target.options[e.target.selectedIndex].text,
                },
              })
            }}
            defaultValue={selectedExpense.category_id ?? data.data[0][0].id}
          >
            {data.data[0].map((category) => {
              return (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              )
            })}
          </select>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <label
              htmlFor="expense-several-days"
              className="text-accent text-sm"
            >
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
                className="text-accent text-xs"
              >
                <FormattedMessage id="date" defaultMessage="Date" />
              </label>
              {isOnSeveralDays ? (
                <InputTime
                  selectedDates={{
                    from: newExpense.startDate
                      ? new Date(newExpense.startDate)
                      : new Date(data.data[1].journey.departureDate),
                    to: newExpense.endDate
                      ? new Date(newExpense.endDate)
                      : addDays(
                          new Date(data.data[1].journey.departureDate),
                          1
                        ),
                  }}
                  minDate={new Date(data.data[1].journey.departureDate)}
                  maxDate={new Date(data.data[1].journey.returnDate)}
                  mode="range"
                  onSelectDate={handleDaySelect}
                />
              ) : (
                <InputTime
                  selectedDates={new Date(newExpense.startDate)}
                  minDate={new Date(data.data[1].journey.departureDate)}
                  maxDate={new Date(data.data[1].journey.returnDate)}
                  mode="single"
                  onSelectDate={handleDaySelect}
                />
              )}
              {!isOnSeveralDays ? (
                <div className="flex items-center justify-between">
                  <input
                    type="time"
                    className="flex grow justify-center"
                    disabled={isOnSeveralDays}
                    onChange={handleOnChangeStartTime}
                    value={startTime}
                  />
                  <ChevronRightIcon />
                  <input
                    type="time"
                    className="flex grow justify-center"
                    disabled={isOnSeveralDays}
                    onChange={handleOnChangeEndTime}
                    value={endTime}
                    min={startTime}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          {isEditMode ? (
            <>
              <Button
                onClick={() => {
                  handleDeleteExpense(newExpense.id as string)
                }}
                variant="ghost"
                isDisabled={isPendingUpdate || isPendingDelete}
              >
                {isPendingDelete ? (
                  <FormattedMessage
                    id="deletingExpense"
                    defaultMessage="Deleting expense..."
                  />
                ) : (
                  <FormattedMessage
                    id="deleteExpense"
                    defaultMessage="Delete expense"
                  />
                )}
              </Button>
              <Button
                onClick={() => {
                  handleUpdateExpense(newExpense)
                }}
                isDisabled={
                  isPendingUpdate ||
                  isPendingDelete ||
                  newExpense === selectedExpense
                }
              >
                {isPendingUpdate ? (
                  <FormattedMessage
                    id="updatingExpense"
                    defaultMessage="Updating expense..."
                  />
                ) : (
                  <FormattedMessage
                    id="updateExpense"
                    defaultMessage="Update expense"
                  />
                )}
              </Button>
            </>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  )
}
