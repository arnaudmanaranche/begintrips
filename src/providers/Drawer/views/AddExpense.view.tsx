import { ChevronRightIcon } from '@radix-ui/react-icons'
import type { CalendarEventExternal } from '@schedule-x/calendar'
import { useQuery } from '@tanstack/react-query'
import { addDays } from 'date-fns'
import * as m from 'motion/react-m'
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
import {
  formatDate,
  isValidDateTimeFormat,
  isValidTimeFormat,
} from '@/utils/date'

import { useDrawerActions } from '../Drawer.Provider'

interface AddExpenseViewProps {
  selectedExpense: {
    id?: string
    startDate: string
    startTime: string
    endTime: string
    endDate?: string
    name: string
    amount: number
    category_id?: string
    categories?: {
      name: string
    }
  }
  isEditMode: boolean
  calendarRef: MutableRefObject<
    (e: CalendarEventExternal, action?: 'patch' | 'delete') => void
  >
  isExpenseOnSeveralDays?: boolean
}

export function AddExpenseView({
  selectedExpense,
  isEditMode,
  calendarRef,
  isExpenseOnSeveralDays = false,
}: AddExpenseViewProps): ReactNode {
  const { id: journeyId } = useParams()
  const [startTime, setStartTime] = useState(
    selectedExpense.startTime !== '' ? selectedExpense.startTime : '09:00'
  )
  const [endTime, setEndTime] = useState(
    selectedExpense.endTime !== '' ? selectedExpense.endTime : '10:00'
  )
  const [newExpense, setNewExpense] = useState<AddExpenseWithCategories>({
    id: selectedExpense?.id ?? '',
    name: selectedExpense?.name ?? '',
    amount: selectedExpense?.amount ?? 0,
    startDate: `${selectedExpense.startDate ?? ''} ${startTime}`,
    endDate: `${selectedExpense?.endDate ?? ''} ${endTime}`,
    category_id: selectedExpense?.category_id ?? '',
    categories: {
      name: selectedExpense?.categories?.name ?? '',
    },
    journeyId: journeyId as string,
  })
  const [isOnSeveralDays, setOnSeveralDays] = useState(isExpenseOnSeveralDays)
  const { setIsOpen, setSelectedExpense } = useDrawerActions()

  const { data: userFavoriteCategories } = useQuery({
    queryKey: QUERY_KEYS.USER_FAVORITE_CATEGORIES(),
    queryFn: () => getUserFavoriteCategories(),
  })

  const { data } = useQuery({
    queryKey: QUERY_KEYS.JOURNEY(journeyId as string),
    queryFn: () => getJourney({ journeyId: journeyId as string }),
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
      setSelectedExpense({
        startDate: '',
        endTime: '',
        startTime: '',
        id: '',
        category_id: '',
        categories: {
          name: '',
        },
        name: '',
        amount: 0,
      })
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
      setSelectedExpense({
        startDate: '',
        endTime: '',
        startTime: '',
        id: '',
        category_id: '',
        categories: {
          name: '',
        },
        name: '',
        amount: 0,
      })
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

      if (data) {
        const { departureDate, returnDate } = data.journey

        setNewExpense((prev) => {
          const formattedDepartureDate = formatDate(
            new Date(departureDate),
            'yyyy-MM-dd'
          )

          if (isChecked) {
            if (!isValidTimeFormat(prev.startDate)) {
              const nextStartDate = formattedDepartureDate
              const nextEndDate =
                prev.startDate.split(' ')[0] ===
                formatDate(new Date(returnDate), 'yyyy-MM-dd')
                  ? formattedDepartureDate
                  : formatDate(
                      addDays(new Date(prev.startDate), 1),
                      'yyyy-MM-dd'
                    )

              return {
                ...prev,
                startDate: nextStartDate,
                endDate: nextEndDate,
              }
            } else {
              return {
                ...prev,
                startDate: formattedDepartureDate,
                endDate: formatDate(
                  addDays(new Date(departureDate), 1),
                  'yyyy-MM-dd'
                ),
              }
            }
          } else {
            return {
              ...prev,
              startDate: `${data.journey.departureDate} ${startTime}`,
              endDate: `${data.journey.departureDate} ${endTime}`,
            }
          }
        })
      }
    },
    [data, endTime, startTime]
  )

  const handleOnChangeStartTime = (e: ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value

    setStartTime(time)

    setNewExpense((prev) => {
      const [date] = prev.startDate.split(' ')
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
      if (prev.endDate) {
        const [date] = prev.endDate.split(' ')
        return {
          ...prev,
          endDate: `${date} ${time}`,
        }
      }

      return prev
    })
  }

  const handleDaySelect = (date: DateRange | Date | undefined) => {
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
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="transition-opacity"
          >
            <Callout.Danger>
              <FormattedMessage id={error?.message} />
            </Callout.Danger>
          </m.div>
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
        <div className="relative flex flex-col space-y-1">
          <label
            htmlFor="expense-category"
            className="text-accent pointer-events-none absolute -top-2 left-3 bg-white px-1 text-xs transition-all duration-300"
          >
            <FormattedMessage id="categories" defaultMessage="Categories" />
          </label>
          <div className="grid">
            <select
              id="expense-category"
              className="focus:border-accent focus:ring-accent col-start-1 row-start-1 appearance-none rounded-md border border-gray-300 bg-transparent px-4 py-4 outline-none transition-all focus:outline-none focus:ring focus:ring-opacity-40"
              onChange={(e) => {
                setNewExpense({
                  ...newExpense,
                  category_id: e.target.value,
                  categories: {
                    name: e.target.options[e.target.selectedIndex].text,
                  },
                })
              }}
              defaultValue={newExpense.category_id as string}
            >
              <option value="" disabled>
                <FormattedMessage
                  id="selectCategory"
                  defaultMessage="Select a category"
                />
              </option>
              {userFavoriteCategories?.map((category) => {
                return (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                )
              })}
            </select>
            <svg
              className="pointer-events-none relative right-1 col-start-1 row-start-1 h-4 w-4 self-center justify-self-end text-black forced-colors:hidden"
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
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
              {isOnSeveralDays ? (
                <InputTime
                  selectedDates={{
                    from: newExpense.startDate
                      ? new Date(newExpense.startDate)
                      : new Date(data?.journey.departureDate as string),
                    to: newExpense.endDate
                      ? new Date(newExpense.endDate)
                      : addDays(
                          new Date(data?.journey.departureDate as string),
                          1
                        ),
                  }}
                  minDate={new Date(data?.journey.departureDate as string)}
                  maxDate={new Date(data?.journey.returnDate as string)}
                  mode="range"
                  onSelectDate={handleDaySelect}
                />
              ) : (
                <InputTime
                  selectedDates={new Date(newExpense.startDate)}
                  minDate={new Date(data?.journey.departureDate as string)}
                  maxDate={new Date(data?.journey.returnDate as string)}
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
                  (!isOnSeveralDays &&
                    (!isValidDateTimeFormat(newExpense.startDate) ||
                      !isValidDateTimeFormat(newExpense.endDate!)))
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
              isDisabled={
                isPending ||
                newExpense.name === '' ||
                newExpense.category_id === '' ||
                newExpense.startDate === '' ||
                newExpense.endDate === '' ||
                (!isOnSeveralDays &&
                  (!isValidDateTimeFormat(newExpense.startDate) ||
                    !isValidDateTimeFormat(newExpense.endDate!)))
              }
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
