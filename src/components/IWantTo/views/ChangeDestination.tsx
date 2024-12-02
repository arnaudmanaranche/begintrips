import type { SearchBoxSuggestion, SessionToken } from '@mapbox/search-js-core'
import * as Dialog from '@radix-ui/react-dialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import type { ChangeEvent, ReactNode } from 'react'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { updateJourneyDestination } from '@/api/calls/journeys'
import { QUERY_KEYS } from '@/api/queryKeys'
import { Button } from '@/components/Button/Button'
import { Input } from '@/components/Input/Input'
import { useSearchDestination } from '@/hooks/useSearchDestination'
import type { Journey } from '@/types'

interface ChangeDestinationProps {
  destination: string
}

export function ChangeDestination({
  destination: initialDestination,
}: ChangeDestinationProps): ReactNode {
  const [destination, setDestination] = useState({
    id: '',
    name: initialDestination,
  })
  const { id: journeyId } = useParams()
  const queryClient = useQueryClient()
  const { searchBoxRef, sessionTokenRef } = useSearchDestination()
  const [suggestions, setSuggestions] = useState<SearchBoxSuggestion[]>()

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setDestination({ id: '', name: e.target.value })

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

  const { mutateAsync: handleSubmit, isPending } = useMutation({
    mutationFn: () =>
      updateJourneyDestination({
        destination: destination.id,
        journeyId: journeyId as string,
      }),
    onMutate: async () => {
      const previousJourney = queryClient.getQueryData<Journey>(
        QUERY_KEYS.JOURNEY(journeyId as string)
      )

      queryClient.setQueryData(QUERY_KEYS.JOURNEY(journeyId as string), {
        ...previousJourney,
        destination,
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
    <div className="mt-10 flex h-fit flex-col space-y-4">
      <div className="relative">
        <Input
          label={
            <FormattedMessage
              id="inputDestinationLabel"
              defaultMessage="Destination"
            />
          }
          value={destination.name}
          id="destination"
          type="text"
          onChange={(e) => handleChange(e)}
        />
        <motion.ul
          className="absolute left-0 top-[100%] mt-2 max-h-[200px] w-full max-w-xl overflow-y-scroll rounded-md bg-white shadow-md"
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
                      setDestination({
                        id: suggestion.mapbox_id,
                        name: suggestion.name,
                      })
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
      <Dialog.Close asChild>
        <Button
          isDisabled={
            isPending || destination.name === initialDestination || !destination
          }
          onClick={handleSubmit}
        >
          <FormattedMessage
            id="changeDestination"
            defaultMessage="Change destination"
          />
        </Button>
      </Dialog.Close>
    </div>
  )
}
