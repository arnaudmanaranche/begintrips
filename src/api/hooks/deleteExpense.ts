import type { UseMutateAsyncFunction } from '@tanstack/react-query'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

import type { JourneyPage } from '@/types'
import { removeExpenseById } from '@/utils/remove-expense-by-id'

import { deleteExpense } from '../calls/expenses'
import { QUERY_KEYS } from '../queryKeys'

interface UseDeleteExpenseProps {
  onSuccessCallback?: () => void
}

export const useDeleteExpense = ({
  onSuccessCallback,
}: UseDeleteExpenseProps): {
  handleDeleteExpense: UseMutateAsyncFunction<
    { message: string },
    Error,
    string
  >
  isPending: boolean
  isError: boolean
  error: Error | null
} => {
  const queryClient = useQueryClient()
  const { id: journeyId } = useParams()

  const {
    mutateAsync: handleDeleteExpense,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: (expenseId: string) => deleteExpense({ id: expenseId }),
    onSuccess() {
      onSuccessCallback?.()
    },
    onMutate: async (expenseId: string) => {
      const previousJourney = queryClient.getQueryData<JourneyPage>(
        QUERY_KEYS.JOURNEY(journeyId as string)
      )

      queryClient.setQueryData<JourneyPage>(
        QUERY_KEYS.JOURNEY(journeyId as string),
        (oldData) => {
          if (!oldData) return oldData

          const { updatedRecord, removedExpense } = removeExpenseById(
            oldData.expensesByCategory,
            expenseId
          )

          if (!removedExpense) return oldData

          const { updatedRecord: updatedRecord2 } = removeExpenseById(
            oldData.expensesByDay,
            expenseId
          )

          const newBudgetSpent = oldData.budgetSpent - removedExpense.amount

          return {
            ...oldData,
            expensesByCategory: updatedRecord,
            expensesByDay: updatedRecord2,
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
    handleDeleteExpense,
    isPending,
    isError,
    error,
  }
}
