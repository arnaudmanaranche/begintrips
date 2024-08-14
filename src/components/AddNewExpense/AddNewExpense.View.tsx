import { createExpense } from '@/api/calls/days'
import { type AddExpense, type Day } from '@/types'
import { mappedExpensesWithEmojis } from '@/utils/expense-labels'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Button } from '../Button/Button'
import { Callout } from '../Callout/Callout'
import { type AddNewExpenseStep } from './AddNewExpense'

export interface AddNewExpenseViewProps {
  currentStep: AddNewExpenseStep
  setCurrentStep: (step: AddNewExpenseStep) => void
  days: Day[]
  setOpen: (open: boolean) => void
}

export function AddNewExpenseView({
  currentStep,
  setCurrentStep,
  days,
  setOpen,
}: AddNewExpenseViewProps) {
  const { query } = useRouter()
  const [newExpense, setNewExpense] = useState<AddExpense>({
    category: 'other',
    name: '',
    amount: 0,
    dayId: '',
    journeyId: query.id as string,
    startDate: '',
  })
  const queryClient = useQueryClient()

  const {
    mutateAsync: handleCreateExpense,
    isPending,
    isError,
  } = useMutation({
    mutationFn: () => createExpense(newExpense),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [query.id, 'expensesByDay'],
      })
      queryClient.invalidateQueries({
        queryKey: [query.id, 'expensesByCategory'],
      })
      setOpen(false)
    },
  })

  switch (currentStep) {
    case 'Select category':
      return (
        <div className="grid grid-cols-2 gap-5">
          {mappedExpensesWithEmojis.map((mappedExpense) => (
            <div
              key={mappedExpense.name}
              className="flex cursor-pointer flex-col items-center rounded-lg border-[1px] p-4 transition-colors hover:bg-slate-100"
              onClick={() => {
                setNewExpense((prev) => ({
                  ...prev,
                  category: mappedExpense.category,
                }))
                setCurrentStep('Fill information')
              }}
            >
              {mappedExpense.emoji}
              <span className="capitalize">{mappedExpense.name}</span>
            </div>
          ))}
        </div>
      )
    default:
      return (
        <div className="flex flex-col space-y-4">
          {isError ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="transition-opacity"
            >
              <Callout>
                An error occurred while adding the expense. Please try again.
              </Callout>
            </motion.div>
          ) : null}
          <div className="flex flex-col space-y-1">
            <label htmlFor="expense-name">Name</label>
            <input
              id="expense-name"
              className="rounded-md border-2 border-gray-100 bg-slate-50 px-10 py-4 outline-none transition-all placeholder:text-black/50 focus:border-neutral-dark focus:outline-none"
              type="text"
              placeholder="Taylor Swift concert"
              value={newExpense.name}
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
              value={newExpense.amount}
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
            onChange={(e) =>
              setNewExpense((prev) => ({
                ...prev,
                dayId: JSON.parse(e.target.value).id,
                startDate: JSON.parse(e.target.value).startDate,
              }))
            }
            defaultValue="Select a day"
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
}
