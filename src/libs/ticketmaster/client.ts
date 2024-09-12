import { useState } from 'react'

import type { EventResponse } from '@/types/ticketmaster'

const TICKETMASTER_API_URL = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${process.env.NEXT_PUBLIC_TICKETMASTER_CONSUMER_KEY}`

interface SearchParams {
  query: string
  startDate: string
  endDate: string
  city: string
}

export const useSearchEvents = (): {
  events: EventResponse['_embedded']['events']
  isLoading: boolean
  error: Error | null
  searchEvents: (params: SearchParams) => Promise<void>
} => {
  const [events, setEvents] = useState<EventResponse['_embedded']['events']>([]) // Typed as an array of Event
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const searchEvents = async ({
    query,
    startDate,
    endDate,
    city,
  }: SearchParams): Promise<void> => {
    if (query.length >= 4) {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(
          `${TICKETMASTER_API_URL}&keyword=${query}&size=5&city=${city}&locale=*&startDateTime=${startDate}&endDateTime=${endDate}`
        )
        const data: EventResponse = await response.json() // Assuming the response structure
        if (data._embedded?.events) {
          setEvents(data._embedded.events)
        } else {
          setEvents([])
        }
      } catch (error) {
        setError(error as Error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return { events, isLoading, error, searchEvents }
}
