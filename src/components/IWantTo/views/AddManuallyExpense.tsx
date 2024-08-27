import { createExpense } from '@/api/calls/days'
import { Button } from '@/components/Button/Button'
import { Callout } from '@/components/Callout/Callout'
import type { AddExpense, Day } from '@/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import type { Dispatch, SetStateAction } from 'react'

export interface AddManuallyExpenseProps {
  newExpense: AddExpense
  setNewExpense: Dispatch<SetStateAction<AddExpense>>
  days: Day[]
  setOpen: (open: boolean) => void
}

export function AddManuallyExpense({
  newExpense,
  setNewExpense,
  days,
  setOpen,
}: AddManuallyExpenseProps) {
  const queryClient = useQueryClient()
  const { id: journeyId } = useParams()
  const {
    mutateAsync: handleCreateExpense,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: () => createExpense(newExpense),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [journeyId, 'expensesByDay'],
      })
      queryClient.invalidateQueries({
        queryKey: [journeyId, 'expensesByCategory'],
      })
      setOpen(false)
    },
  })

  return (
    <div className="flex flex-col space-y-4">
      {isError ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="transition-opacity"
        >
          <Callout.Danger>{error?.message}</Callout.Danger>
        </motion.div>
      ) : null}
      <div className="flex flex-col space-y-1">
        <label htmlFor="expense-name">Name</label>
        <input
          id="expense-name"
          className="rounded-md border-2 border-gray-100 bg-slate-50 px-10 py-4 outline-none transition-all placeholder:text-black/50 focus:border-neutral-dark focus:outline-none"
          type="text"
          placeholder="Taylor Swift concert"
          defaultValue={newExpense.name}
          onChange={(e) =>
            setNewExpense({ ...newExpense, name: e.target.value })
          }
        />
      </div>
      <div className="flex flex-col space-y-1">
        <label htmlFor="expense-amount">Amount</label>
        <input
          id="expense-amount"
          className="rounded-md border-2 border-gray-100 bg-slate-50 px-10 py-4 outline-none transition-all placeholder:text-black/50 focus:border-neutral-dark focus:outline-none"
          type="number"
          placeholder="3000"
          defaultValue={newExpense.amount}
          onChange={(e) =>
            setNewExpense({
              ...newExpense,
              amount: parseFloat(e.target.value),
            })
          }
        />
      </div>
      <label htmlFor="expense-day">Day</label>
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
        {days.map((day) => (
          <option
            key={new Date(day.startDate).toString()}
            value={JSON.stringify({
              id: day.id,
              startDate: day.startDate,
            })}
          >
            {format(new Date(day.startDate), 'EEEE - dd MMMM yyyy')}
          </option>
        ))}
      </select>
      <Button onClick={() => handleCreateExpense()} isDisabled={isPending}>
        {isPending ? 'Adding new expense...' : 'Add new expense'}
      </Button>
    </div>
  )
}
