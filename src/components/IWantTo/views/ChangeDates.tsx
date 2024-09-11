import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import type { ChangeEvent } from 'react'
import { useMemo, useState } from 'react'

import { updateJourneyDates } from '@/api/calls/journeys'
import { QUERY_KEYS } from '@/api/queryKeys'
import { Button } from '@/components/Button/Button'
import { Callout } from '@/components/Callout/Callout'
import { Input } from '@/components/Input/Input'
import { useQuickActionsModalActions } from '@/providers/QuickActions.Provider'
import type { Journey } from '@/types'

export interface ChangeDatesProps {
  departureDate: string
  returnDate: string
}

export function ChangeDates({
  departureDate: initialDepartureDate,
  returnDate: initialReturnDate,
}: ChangeDatesProps) {
  const [departureDate, setDepartureDate] = useState(initialDepartureDate)
  const [returnDate, setReturnDate] = useState(initialReturnDate)
  const { id: journeyId } = useParams()
  const queryClient = useQueryClient()
  const { setIsOpen, setCurrentStep } = useQuickActionsModalActions()

  const hasDatesBeenChanged = useMemo(() => {
    return (
      initialDepartureDate !== departureDate || initialReturnDate !== returnDate
    )
  }, [departureDate, initialDepartureDate, initialReturnDate, returnDate])

  const handleDepartureDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedDepartureDate = e.target.value

    setDepartureDate(selectedDepartureDate)

    if (returnDate < selectedDepartureDate) {
      setReturnDate(selectedDepartureDate)
    }
  }

  const handleReturnDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setReturnDate(e.target.value)
  }

  const {
    mutateAsync: handleSubmit,
    isPending,
    error: mutateError,
  } = useMutation({
    mutationFn: () =>
      updateJourneyDates({
        departureDate,
        returnDate,
        journeyId: journeyId as string,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.JOURNEY_DAYS(journeyId as string),
      })
      setIsOpen(false)
      setCurrentStep('Select action')
    },
    onMutate: async () => {
      const previousJourney = queryClient.getQueryData<Journey>([
        'journey',
        journeyId,
      ])

      queryClient.setQueryData(QUERY_KEYS.JOURNEY(journeyId as string), {
        ...previousJourney,
        departureDate,
        returnDate,
      })

      return { previousJourney }
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(
        QUERY_KEYS.JOURNEY(journeyId as string),
        context?.previousJourney
      )
      // @TODO: Add toast error
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.JOURNEY(journeyId as string),
      })
    },
  })

  return (
    <div className="flex flex-col space-y-10">
      {mutateError ? (
        <Callout.Danger>{mutateError.message}</Callout.Danger>
      ) : (
        <Callout.Danger>
          If you delete days which have expenses, the expenses will be deleted.
        </Callout.Danger>
      )}

      <div className="flex flex-col space-y-4">
        <Input
          value={departureDate || new Date().toISOString().split('T')[0]}
          id="departureDate"
          label="Departure date"
          type="date"
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => handleDepartureDateChange(e)}
        />
        <Input
          value={returnDate || new Date().toISOString().split('T')[0]}
          id="returnDate"
          label="Return date"
          type="date"
          min={departureDate}
          onChange={(e) => handleReturnDateChange(e)}
        />
        <Button
          isDisabled={
            isPending || !hasDatesBeenChanged || !departureDate || !returnDate
          }
          onClick={handleSubmit}
        >
          Change dates
        </Button>
      </div>
    </div>
  )
}