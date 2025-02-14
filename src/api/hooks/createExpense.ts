import type { UseMutateAsyncFunction } from '@tanstack/react-query'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

import type { AddExpenseWithCategories, Expense, JourneyPage } from '@/types'
import { addExpenseByDay } from '@/utils/add-expense-by-day'

import { createExpense } from '../calls/expenses'
import { QUERY_KEYS } from '../queryKeys'

interface UseCreateExpenseProps {
  onSuccessCallback?: () => void
}

export const useCreateExpense = ({
  onSuccessCallback,
}: UseCreateExpenseProps): {
  handleCreateExpense: UseMutateAsyncFunction<
    Expense,
    Error,
    { expense: AddExpenseWithCategories }
  >
  isPending: boolean
  isError: boolean
  error: Error | null
} => {
  const queryClient = useQueryClient()
  const { id: journeyId } = useParams()

  const {
    mutateAsync: handleCreateExpense,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: ({ expense }: { expense: AddExpenseWithCategories }) =>
      createExpense({ expense }),
    onSuccess() {
      onSuccessCallback?.()
    },
    onMutate: async ({ expense }: { expense: AddExpenseWithCategories }) => {
      const previousJourney = queryClient.getQueryData<JourneyPage>(
        QUERY_KEYS.JOURNEY(journeyId as string)
      )

      queryClient.setQueryData<JourneyPage>(
        QUERY_KEYS.JOURNEY(journeyId as string),
        // @ts-expect-error TODO
        (oldData) => {
          if (!oldData) return

          const expensesByDay = addExpenseByDay(expense, oldData.expensesByDay)

          const newBudgetSpent = oldData.budgetSpent + expense.amount

          return {
            ...oldData,
            expensesByDay,
            budgetSpent: newBudgetSpent,
            calendarExpenses: [
              ...oldData.calendarExpenses,
              {
                ...expense,
                id: 'temp',
                calendarId: 'personal',
              },
            ],
          }
        }
      )

      return { previousJourney }
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(
        QUERY_KEYS.JOURNEY(journeyId as string),
        context?.previousJourney
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.JOURNEY(journeyId as string),
      })
    },
  })

  return {
    handleCreateExpense,
    isPending,
    isError,
    error,
  }
}
