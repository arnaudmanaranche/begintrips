import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { updateJourneyBudget } from '@/api/calls/journeys'
import { QUERY_KEYS } from '@/api/queryKeys'
import { Button } from '@/components/Button/Button'
import { Callout } from '@/components/Callout/Callout'
import { Input } from '@/components/Input/Input'
import { useQuickActionsModalActions } from '@/providers/QuickActions.Provider'
import type { Journey } from '@/types'

interface UpdateBudgetProps {
  budget: number
}

export function UpdateBudget({
  budget: initialBudget,
}: UpdateBudgetProps): ReactNode {
  const [budget, setBudget] = useState(initialBudget)
  const { id: journeyId } = useParams()
  const queryClient = useQueryClient()
  const { setIsOpen, setCurrentStep } = useQuickActionsModalActions()

  const {
    mutateAsync: handleSubmit,
    isPending,
    error: mutateError,
  } = useMutation({
    mutationFn: () =>
      updateJourneyBudget({
        budget,
        journeyId: journeyId as string,
      }),
    onSuccess: () => {
      setIsOpen(false)
      setCurrentStep('Select action')
    },
    onMutate: async () => {
      const previousJourney = queryClient.getQueryData<Journey>(
        QUERY_KEYS.JOURNEY(journeyId as string)
      )

      queryClient.setQueryData(QUERY_KEYS.JOURNEY(journeyId as string), {
        ...previousJourney,
        budget,
      })

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

  return (
    <div className="mt-10 flex flex-col space-y-10">
      {mutateError ? (
        <Callout.Danger>{mutateError.message}</Callout.Danger>
      ) : null}

      <div className="flex flex-col space-y-4">
        <Input
          label={
            <FormattedMessage id="inputBudgetLabel" defaultMessage="Budget" />
          }
          value={budget}
          id="budget"
          type="number"
          onChange={(e) => setBudget(Number(e.target.value))}
        />

        <Button
          isDisabled={isPending || budget === initialBudget}
          onClick={handleSubmit}
        >
          {isPending ? (
            <FormattedMessage
              id="updatingBudget"
              defaultMessage="Updating budget..."
            />
          ) : (
            <FormattedMessage
              id="updateBudget"
              defaultMessage="Update budget"
            />
          )}
        </Button>
      </div>
    </div>
  )
}
