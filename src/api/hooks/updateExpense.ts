import type { UseMutateAsyncFunction } from '@tanstack/react-query'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

import type { Expense, UpdateExpense } from '@/types'
import { type JourneyPage } from '@/types'
import { updateExpenseById } from '@/utils/update-expense-by-id'

import { updateExpense } from '../calls/expenses'
import { QUERY_KEYS } from '../queryKeys'

interface useUpdateExpense {
  onSuccessCallback?: () => void
}

export const useUpdateExpense = ({
  onSuccessCallback,
}: useUpdateExpense): {
  handleUpdateExpense: UseMutateAsyncFunction<
    { message: string },
    Error,
    Expense
  >
  isPending: boolean
  isError: boolean
  error: Error | null
} => {
  const queryClient = useQueryClient()
  const { id: journeyId } = useParams()

  const {
    mutateAsync: handleUpdateExpense,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: (expense: UpdateExpense) => updateExpense({ expense }),
    onSuccess() {
      onSuccessCallback?.()
    },
    onMutate: async (expense: Expense) => {
      const previousJourney = queryClient.getQueryData<JourneyPage>(
        QUERY_KEYS.JOURNEY(journeyId as string)
      )

      queryClient.setQueryData<JourneyPage>(
        QUERY_KEYS.JOURNEY(journeyId as string),
        (oldData) => {
          if (!oldData) return oldData

          const { updatedRecord } = updateExpenseById(
            oldData.expensesByCategory,
            expense.id as string,
            expense
          )

          const { updatedRecord: updatedRecord2 } = updateExpenseById(
            oldData.expensesByDay,
            expense.id as string,
            expense
          )

          return {
            ...oldData,
            expensesByCategory: updatedRecord,
            expensesByDay: updatedRecord2,
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
    handleUpdateExpense,
    isPending,
    isError,
    error,
  }
}
