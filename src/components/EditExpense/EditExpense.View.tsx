import { useQuery } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useState } from 'react'

import { getUserFavoriteCategories } from '@/api/calls/users'
import { useDeleteExpense } from '@/api/hooks/deleteExpense'
import { useUpdateExpense } from '@/api/hooks/updateExpense'
import { QUERY_KEYS } from '@/api/queryKeys'
import type { AddExpenseWithCategories } from '@/types'

import { Button } from '../Button/Button'
import { Input } from '../Input/Input'

interface EditExpenseViewProps {
  expense: AddExpenseWithCategories
  setOpen: (open: boolean) => void
}

export const EditExpenseView = ({
  expense,
  setOpen,
}: EditExpenseViewProps): ReactNode => {
  const [newExpense, setNewExpense] =
    useState<AddExpenseWithCategories>(expense)
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
  const { data: categories } = useQuery({
    queryKey: QUERY_KEYS.USER_FAVORITE_CATEGORIES(),
    queryFn: () => getUserFavoriteCategories(),
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
          onChange={(e) => {
            setNewExpense({
              ...newExpense,
              category_id: e.target.value,
            })
          }}
          defaultValue={newExpense.categories.id}
        >
          {categories?.map((category) => {
            return (
              <option key={category.name} value={category.id}>
                {category.name}
              </option>
            )
          })}
        </select>
      </div>
      <div className="flex justify-between space-x-4">
        <Button
          onClick={() => {
            handleDeleteExpense(expense.id as string)
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
