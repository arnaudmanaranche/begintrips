import { deleteExpense, updateExpense } from '@/api/calls/expenses'
import type { Expense, ExpenseCategoryEnum } from '@/types'
import { mappedExpensesWithEmojis } from '@/utils/expense-labels'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Button } from '../Button/Button'
import { Input } from '../Input/Input'

export interface EditExpenseViewProps {
  expense: Expense
  setOpen: (open: boolean) => void
}

export const EditExpenseView = ({ expense, setOpen }: EditExpenseViewProps) => {
  const [newExpense, setNewExpense] = useState(expense)
  const { query } = useRouter()
  const queryClient = useQueryClient()

  const { mutateAsync: handleUpdateExpense, isPending: isPendingUpdate } =
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
      onMutate: async () => {
        const previousBudgetSpent = queryClient.getQueryData<number>([
          'journey',
          query.id,
          'budgetSpent',
        ])

        queryClient.setQueryData(
          ['journey', query.id, 'budgetSpent'],
          newExpense.amount
        )

        return { previousBudgetSpent }
      },
      onError: (err, newTodo, context) => {
        queryClient.setQueryData(
          ['journey', query.id, 'budgetSpent'],
          context?.previousBudgetSpent
        )
        // @TODO: Add toast error
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: ['journey', query.id, 'budgetSpent'],
        })
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
        queryClient.invalidateQueries({
          queryKey: ['journey', query.id, 'budgetSpent'],
        })
        queryClient.invalidateQueries({
          queryKey: ['journey', query.id],
        })
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
            handleDeleteExpense({ id: expense.id })
          }}
          variant="ghost"
          isDisabled={isPendingUpdate || isPendingDelete}
        >
          {isPendingDelete ? 'Deleting expense...' : 'Delete expense'}
        </Button>
        <Button
          onClick={() => {
            handleUpdateExpense({ expense: newExpense })
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
