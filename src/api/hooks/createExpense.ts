import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

import type { AddExpense, JourneyPage } from '@/types'
import { addExpenseByCategory } from '@/utils/add-expense-by-category'
import { addExpenseByDay } from '@/utils/add-expense-by-day'

import { createExpense } from '../calls/days'
import { QUERY_KEYS } from '../queryKeys'

export interface UseCreateExpenseProps {
  onSuccessCallback?: () => void
}

export const useCreateExpense = ({
  onSuccessCallback,
}: UseCreateExpenseProps) => {
  const queryClient = useQueryClient()
  const { id: journeyId } = useParams()

  const {
    mutateAsync: handleCreateExpense,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: ({ expense }: { expense: AddExpense }) =>
      createExpense({ expense }),
    onSuccess() {
      onSuccessCallback?.()
    },
    onMutate: async ({ expense }: { expense: AddExpense }) => {
      const previousJourney = queryClient.getQueryData<JourneyPage>(
        QUERY_KEYS.JOURNEY(journeyId as string)
      )
      queryClient.setQueryData<JourneyPage>(
        QUERY_KEYS.JOURNEY(journeyId as string),
        (oldData) => {
          if (!oldData) return oldData

          const expensesByCategory = addExpenseByCategory(
            // @ts-expect-error TODO: Fix this
            expense,
            oldData.expensesByCategory
          )
          const expensesByDay = addExpenseByDay(
            // @ts-expect-error TODO: Fix this
            expense,
            oldData.expensesByCategory
          )

          const newBudgetSpent = oldData.budgetSpent + expense.amount

          return {
            ...oldData,
            expensesByCategory,
            expensesByDay,
            budgetSpent: newBudgetSpent,
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
