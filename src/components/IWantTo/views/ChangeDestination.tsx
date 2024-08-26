import { updateJourneyDestination } from '@/api/calls/journeys'
import { Button } from '@/components/Button/Button'
import { Input } from '@/components/Input/Input'
import type { Journey } from '@/types'
import * as Dialog from '@radix-ui/react-dialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useState } from 'react'

export interface ChangeDestinationProps {
  destination: string
}

export function ChangeDestination({
  destination: initialDestination,
}: ChangeDestinationProps) {
  const [destination, setDestination] = useState(initialDestination)
  const { id: journeyId } = useParams()
  const queryClient = useQueryClient()

  const { mutateAsync: handleSubmit, isPending } = useMutation({
    mutationFn: () =>
      updateJourneyDestination({
        destination,
        journeyId: journeyId as string,
      }),
    onMutate: async () => {
      const previousJourney = queryClient.getQueryData<Journey>([
        'journey',
        journeyId,
      ])

      queryClient.setQueryData(['journey', journeyId], {
        ...previousJourney,
        destination,
      })

      return { previousJourney }
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['journey', journeyId], context?.previousJourney)
      // @TODO: Add toast error
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['journey', journeyId] })
    },
  })

  return (
    <div className="mt-10 flex flex-col space-y-4">
      <Input
        value={destination}
        id="destination"
        label="Destination"
        type="text"
        onChange={(e) => setDestination(e.target.value)}
      />
      <Dialog.Close asChild>
        <Button
          isDisabled={
            isPending || destination === initialDestination || !destination
          }
          onClick={handleSubmit}
        >
          Change destination
        </Button>
      </Dialog.Close>
    </div>
  )
}
