import type { SearchBoxSuggestion, SessionToken } from '@mapbox/search-js-core'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import type { ChangeEvent, ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Drawer } from 'vaul'

import { getJourney, updateJourney } from '@/api/calls/journeys'
import { QUERY_KEYS } from '@/api/queryKeys'
import { Button } from '@/components/Button/Button'
import { Input } from '@/components/Input/Input'
import { useSearchDestination } from '@/hooks/useSearchDestination'
import type { Journey } from '@/types'

import { useDrawerActions } from '../Drawer.Provider'

export function EditTripView(): ReactNode {
  const { id: journeyId } = useParams()
  const queryClient = useQueryClient()
  const { setIsOpen } = useDrawerActions()
  const [trip, setTrip] = useState<{
    destination: {
      id: string
      name: string
    }
    budget: number
    departureDate: string
    returnDate: string
  }>({
    destination: {
      id: '',
      name: '',
    },
    departureDate: '',
    returnDate: '',
    budget: 0,
  })
  const { searchBoxRef, sessionTokenRef } = useSearchDestination()
  const [suggestions, setSuggestions] = useState<SearchBoxSuggestion[]>()
  const [isEdited, setIsEdited] = useState(false)

  const { data, isPending: isFetchingJourney } = useQuery({
    queryKey: QUERY_KEYS.JOURNEY(journeyId as string),
    queryFn: () => getJourney({ journeyId: journeyId as string }),
  })

  useEffect(() => {
    if (data) {
      setTrip({
        destination: {
          id: data.journey.destination.id,
          name: data.journey.destination.name,
        },
        departureDate: data.journey.departureDate,
        returnDate: data.journey.returnDate,
        budget: data.journey.budget || 0,
      })
    }
  }, [data])

  const { mutateAsync: handleSubmit, isPending: isUpdating } = useMutation({
    mutationFn: () =>
      updateJourney({
        ...trip,
        destination: trip.destination.id,
        journeyId: journeyId as string,
      }),
    onMutate: async () => {
      const previousJourney = queryClient.getQueryData<Journey>(
        QUERY_KEYS.JOURNEY(journeyId as string)
      )

      queryClient.setQueryData(QUERY_KEYS.JOURNEY(journeyId as string), {
        ...previousJourney,
        ...trip,
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
      setIsOpen(false)
    },
  })

  useEffect(() => {
    if (
      trip.destination.name !== data?.journey.destination.name ||
      trip.departureDate !== data?.journey.departureDate ||
      trip.returnDate !== data?.journey.returnDate ||
      trip.budget !== data?.journey.budget
    ) {
      setIsEdited(true)
    } else {
      setIsEdited(false)
    }
  }, [trip, data])

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setTrip({ ...trip, destination: { id: '', name: e.target.value } })

    if (e.target.value.length >= 2) {
      const response = await searchBoxRef.current?.suggest(e.target.value, {
        sessionToken: sessionTokenRef.current as SessionToken,
      })

      if (response?.suggestions) {
        setSuggestions(response.suggestions)
      }
    } else {
      setSuggestions([])
    }
  }

  return (
    <div className="flex h-full w-full grow flex-col space-y-4 rounded-[16px] bg-white p-5">
      <Drawer.Title className="mb-2 text-2xl font-medium text-zinc-900" asChild>
        <h3>Edit trip</h3>
      </Drawer.Title>
      <form
        onSubmit={(e) => {
          e.preventDefault()
        }}
        className="flex flex-col space-y-6"
      >
        <div className="relative">
          <Input
            label={
              <FormattedMessage
                id="inputDestinationLabel"
                defaultMessage="Destination"
              />
            }
            value={trip.destination.name}
            id="destination"
            type="text"
            onChange={(e) => handleChange(e)}
          />
          <motion.ul
            className="absolute left-0 top-[100%] z-10 mt-2 max-h-[200px] w-full max-w-xl overflow-y-scroll rounded-md bg-white shadow-md"
            animate={{
              height: suggestions?.length ? 'auto' : 0,
            }}
          >
            {suggestions?.length
              ? suggestions.map((suggestion) => {
                  return (
                    <li
                      key={suggestion.mapbox_id}
                      className="flex cursor-pointer flex-col px-4 py-2 text-start hover:bg-slate-100"
                      tabIndex={-1}
                      onClick={() => {
                        setTrip((prev) => ({
                          ...prev,
                          destination: {
                            id: suggestion.mapbox_id,
                            name: suggestion.name,
                          },
                        }))
                        setSuggestions([])
                      }}
                    >
                      <p className="text-black">{suggestion.name}</p>
                      <span className="text-sm text-black/70">
                        {suggestion.place_formatted}
                      </span>
                    </li>
                  )
                })
              : null}
          </motion.ul>
        </div>
        <Input
          label={
            <FormattedMessage
              id="inputDepartureDateLabel"
              defaultMessage="Departure date"
            />
          }
          value={trip.departureDate}
          id="departureDate"
          type="date"
          onChange={(e) => setTrip({ ...trip, departureDate: e.target.value })}
        />
        <Input
          label={
            <FormattedMessage
              id="inputReturnDateLabel"
              defaultMessage="Return"
            />
          }
          value={trip.returnDate}
          id="returnDate"
          type="date"
          onChange={(e) => setTrip({ ...trip, returnDate: e.target.value })}
        />
        <Input
          label={
            <FormattedMessage id="inputBudgetLabel" defaultMessage="Budget" />
          }
          value={trip.budget}
          id="budget"
          type="number"
          onChange={(e) => setTrip({ ...trip, budget: Number(e.target.value) })}
        />
        <Button
          onClick={handleSubmit}
          isDisabled={isFetchingJourney || isUpdating || !isEdited}
          className="bg-accent w-full rounded-md px-4 py-2 text-white"
        >
          {isFetchingJourney ? (
            <FormattedMessage id="sendFeedback" defaultMessage="Editing..." />
          ) : (
            <FormattedMessage id="sendFeedback" defaultMessage="Edit my trip" />
          )}
        </Button>
      </form>
    </div>
  )
}
