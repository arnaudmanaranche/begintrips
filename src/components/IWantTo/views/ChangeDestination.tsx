import { updateJourneyDestination } from '@/api/calls/journeys'
import { Button } from '@/components/Button/Button'
import { Input } from '@/components/Input/Input'
import { useSearchDestination } from '@/hooks/useSearchDestination'
import type { Journey } from '@/types'
import type { SearchBoxSuggestion, SessionToken } from '@mapbox/search-js-core'
import * as Dialog from '@radix-ui/react-dialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import type { ChangeEvent } from 'react'
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
  const { searchBoxRef, sessionTokenRef } = useSearchDestination()
  // const [isFocused, setIsFocused] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchBoxSuggestion[]>()

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setDestination(e.target.value)

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
    <div className="mt-10 flex h-fit flex-col space-y-4">
      <div className="relative">
        <Input
          value={destination}
          id="destination"
          label="Destination"
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
                      setDestination(suggestion.name)
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
