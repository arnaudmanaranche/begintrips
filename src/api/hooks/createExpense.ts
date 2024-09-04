import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createExpense } from '../calls/days'
import { useParams } from 'next/navigation'
import type { AddExpense } from '@/types'
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
    mutationFn: (expense: AddExpense) => createExpense(expense),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.EXPENSES_BY_DAY(journeyId as string),
      })
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.EXPENSES_BY_CATEGORY(journeyId as string),
      })
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.JOURNEY_BUDGET_SPENT(journeyId as string),
      })
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.JOURNEY(journeyId as string),
      })
      onSuccessCallback?.()
    },
  })

  return {
    handleCreateExpense,
    isPending,
    isError,
    error,
  }
}
