import { useQuery } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

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
        label={<FormattedMessage id="name" defaultMessage="Name" />}
        id="expense-name"
        value={newExpense.name}
        onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
      />
      <Input
        label={<FormattedMessage id="amount" defaultMessage="Amount" />}
        id="expense-amount"
        type="number"
        value={newExpense.amount}
        onChange={(e) =>
          setNewExpense({ ...newExpense, amount: parseInt(e.target.value) })
        }
      />
      <Input
        label={<FormattedMessage id="date" defaultMessage="Date" />}
        id="expense-date"
        type="date"
        value={newExpense.startDate}
        onChange={(e) =>
          setNewExpense({ ...newExpense, startDate: e.target.value })
        }
      />
      <div className="flex flex-col space-y-1">
        <label htmlFor="expense-category" className="px-4 text-xs text-accent">
          <FormattedMessage id="categories" defaultMessage="Categories" />
        </label>
        <select
          id="expense-category"
          className="rounded-md border-2 border-gray-100 bg-slate-50 px-4 py-4 outline-none transition-all placeholder:text-black/50 focus:border-neutral-dark focus:outline-none"
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
            isPendingUpdate || isPendingDelete || newExpense === expense
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
      </div>
    </div>
  )
}
