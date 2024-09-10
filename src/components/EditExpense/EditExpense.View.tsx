import { useState } from 'react'

import { useDeleteExpense } from '@/api/hooks/deleteExpense'
import { useUpdateExpense } from '@/api/hooks/updateExpense'
import type { Expense } from '@/types'
import { type ExpenseCategoryEnum } from '@/types'
import { mappedExpensesWithEmojis } from '@/utils/expense-labels'

import { Button } from '../Button/Button'
import { Input } from '../Input/Input'

export interface EditExpenseViewProps {
  expense: Expense
  setOpen: (open: boolean) => void
}

export const EditExpenseView = ({ expense, setOpen }: EditExpenseViewProps) => {
  const [newExpense, setNewExpense] = useState<Expense>(expense)

  const { handleUpdateExpense, isPending: isPendingUpdate } = useUpdateExpense({
    onSuccessCallback: () => {
      setOpen(false)
    },
  })

  const { handleDeleteExpense, isPending: isPendingDelete } = useDeleteExpense({
    onSuccessCallback: () => {
      setOpen(false)
    },
  })

  return (
    <div className="flex flex-col space-y-6">
      <Input
        id="expense-name"
        label="Name"
        value={newExpense.name}
        onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
      />
      <Input
        id="expense-amount"
        type="number"
        label="Amount"
        value={newExpense.amount}
        onChange={(e) =>
          setNewExpense({ ...newExpense, amount: parseInt(e.target.value) })
        }
      />
      <Input
        id="expense-date"
        type="date"
        label="Date"
        value={newExpense.startDate}
        onChange={(e) =>
          setNewExpense({ ...newExpense, startDate: e.target.value })
        }
      />
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
            handleDeleteExpense(expense.id)
          }}
          variant="ghost"
          isDisabled={isPendingUpdate || isPendingDelete}
        >
          {isPendingDelete ? 'Deleting expense...' : 'Delete expense'}
        </Button>
        <Button
          onClick={() => {
            handleUpdateExpense(newExpense)
          }}
          isDisabled={
            isPendingUpdate || isPendingDelete || newExpense === expense
          }
        >
          {isPendingUpdate ? 'Saving expense...' : 'Edit expense'}
        </Button>
      </div>
    </div>
  )
}
