import type { SearchBoxSuggestion, SessionToken } from '@mapbox/search-js-core'
import { CalendarIcon } from '@radix-ui/react-icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import * as m from 'motion/react-m'
import { useParams } from 'next/navigation'
import type { ChangeEvent, ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { DayPicker } from 'react-day-picker'
import { FormattedMessage } from 'react-intl'
import { Drawer } from 'vaul'

import { getJourney, updateJourney } from '@/api/calls/journeys'
import { QUERY_KEYS } from '@/api/queryKeys'
import { Button } from '@/components/Button/Button'
import { Input } from '@/components/Input/Input'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useSearchDestination } from '@/hooks/useSearchDestination'
import type { Journey } from '@/types'
import { hasJourneyPassed } from '@/utils/has-journey-passed'

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

  const [showDatePicker, setShowDatePicker] = useState(false)

  const datePickerRef = useRef<HTMLDivElement>(null)
  const matches = useMediaQuery('(min-width: 1024px)')

  const { data, isPending: isFetchingJourney } = useQuery({
    queryKey: QUERY_KEYS.JOURNEY(journeyId as string),
    queryFn: () => getJourney({ journeyId: journeyId as string }),
  })

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setShowDatePicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleDateRangeChange = ({ from, to }: DateRange) => {
    if (from && new Date(trip.departureDate) > from) {
      setTrip((prev) => ({
        ...prev,
        departureDate: from as unknown as string,
        returnDate: from as unknown as string,
      }))
    } else {
      setTrip((prev) => ({
        ...prev,
        departureDate: from as unknown as string,
        returnDate:
          to === undefined
            ? (from as unknown as string)
            : (to as unknown as string),
      }))
    }
  }

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
        <h3>
          <FormattedMessage id="editTrip" defaultMessage="Edit trip" />
        </h3>
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
            isDisabled={hasJourneyPassed(new Date(trip.departureDate))}
            id="destination"
            type="text"
            onChange={(e) => handleChange(e)}
          />
          <m.ul
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
          </m.ul>
        </div>
        <div className="relative flex-1">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="flex w-full items-center rounded-md border border-gray-200 bg-white px-6 py-4 text-left text-gray-700 shadow-sm transition-all hover:border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:hover:border-gray-200"
            disabled={hasJourneyPassed(new Date(trip.departureDate))}
          >
            <CalendarIcon className="mr-2 h-5 w-5 text-gray-400" />
            <span>
              {trip.departureDate && trip.returnDate
                ? `${new Date(trip.departureDate).toLocaleDateString()} - ${new Date(
                    trip.returnDate
                  ).toLocaleDateString()}`
                : 'Select dates'}
            </span>
          </button>
          {showDatePicker ? (
            <div
              ref={datePickerRef}
              className="absolute bottom-full z-50 mt-2 lg:right-0 lg:top-full"
            >
              <div className="rounded-lg bg-white p-4 shadow-lg ring-1 ring-black ring-opacity-5">
                <DayPicker
                  mode="range"
                  selected={{
                    from: trip.departureDate as unknown as Date,
                    to: trip.returnDate as unknown as Date,
                  }}
                  numberOfMonths={matches ? 2 : 1}
                  disabled={{ before: new Date() }}
                  styles={{
                    months: {
                      flexWrap: 'unset',
                    },
                  }}
                  classNames={{
                    selected: 'text-black',
                    range_start:
                      'bg-primary-light border-primary-light text-white',
                    range_end:
                      'bg-primary-light border-primary-light text-white',
                    range_middle: 'bg-slate-100',
                    today: 'text-black',
                    chevron: '',
                  }}
                  min={1}
                  required
                  onSelect={handleDateRangeChange}
                />
              </div>
            </div>
          ) : null}
        </div>
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
            <FormattedMessage id="editingTrip" defaultMessage="Editing..." />
          ) : (
            <FormattedMessage id="editTrip" defaultMessage="Edit my trip" />
          )}
        </Button>
      </form>
    </div>
  )
}
