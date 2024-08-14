import type { Expense, ExpenseCategoryEnum } from '@/types'
import { mappedExpensesWithEmojis } from '@/utils/expense-labels'
import { Button } from '../Button/Button'
import { deleteExpense, updateExpense } from '@/api/calls/expenses'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useRouter } from 'next/router'

export interface EditExpenseViewProps {
  expense: Expense
  setOpen: (open: boolean) => void
}

export const EditExpenseView = ({ expense, setOpen }: EditExpenseViewProps) => {
  const [newExpense, setNewExpense] = useState(expense)
  const { query } = useRouter()
  const queryClient = useQueryClient()

  const { mutateAsync: updatteExpense, isPending: isPendingUpdate } =
    useMutation({
      mutationFn: updateExpense,
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

  const { mutateAsync: handleDeleteExpense, isPending: isPendingDelete } =
    useMutation({
      mutationFn: deleteExpense,
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

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-2">
        <label htmlFor="expense-name">Name</label>
        <input
          id="expense-name"
          className="rounded-md border-2 border-gray-100 bg-slate-50 px-10 py-4 outline-none transition-all placeholder:text-black/50 focus:border-neutral-dark focus:outline-none"
          type="text"
          placeholder="Taylor Swift concert"
          defaultValue={expense.name}
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
          placeholder="Taylor Swift concert"
          defaultValue={expense.amount}
          onChange={(e) =>
            setNewExpense({ ...newExpense, amount: parseInt(e.target.value) })
          }
        />
      </div>
      <div className="flex flex-col space-y-1">
        <label htmlFor="expense-date">Date</label>
        <input
          id="expense-date"
          type="date"
          className="rounded-md border-2 border-gray-100 bg-slate-50 px-10 py-4 outline-none transition-all placeholder:text-black/50 focus:border-neutral-dark focus:outline-none"
          defaultValue={expense.startDate}
          onChange={(e) =>
            setNewExpense({ ...newExpense, startDate: e.target.value })
          }
        />
      </div>
      <div className="flex flex-col space-y-1">
        <label htmlFor="expense-category">Category</label>
        <select
          id="expense-category"
          className="rounded-md border-2 border-gray-100 bg-slate-50 px-10 py-4 outline-none transition-all placeholder:text-black/50 focus:border-neutral-dark focus:outline-none"
          defaultValue={expense.category}
          onChange={(e) =>
            setNewExpense({
              ...newExpense,
              category: e.target.value as ExpenseCategoryEnum,
            })
          }
        >
          {mappedExpensesWithEmojis.map((category) => (
            <option key={category.name} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-between space-x-4">
        <Button
          onClick={() => {
            handleDeleteExpense({ id: expense.id })
          }}
          variant="ghost"
          isDisabled={isPendingUpdate || isPendingDelete}
        >
          {isPendingDelete ? 'Deleting expense...' : 'Delete expense'}
        </Button>
        <Button
          onClick={() => {
            updatteExpense({ expense: newExpense })
          }}
          isDisabled={isPendingUpdate || isPendingDelete}
        >
          {isPendingUpdate ? 'Saving expense...' : 'Edit expense'}
        </Button>
      </div>
    </div>
  )
}
