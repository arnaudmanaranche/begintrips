import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createExpense } from '../calls/days'
import { useParams } from 'next/navigation'
import type { AddExpense } from '@/types'

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
        queryKey: [journeyId, 'expensesByDay'],
      })
      queryClient.invalidateQueries({
        queryKey: [journeyId, 'expensesByCategory'],
      })
      queryClient.invalidateQueries({
        queryKey: ['journey', journeyId, 'budgetSpent'],
      })
      queryClient.invalidateQueries({
        queryKey: ['journey', journeyId],
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
