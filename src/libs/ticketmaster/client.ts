import { useState } from 'react'

import type { EventResponse } from '@/types/ticketmaster'

const TICKETMASTER_API_URI = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${process.env.NEXT_PUBLIC_TICKETMASTER_CONSUMER_KEY}`

export const useSearchEvents = () => {
  const [events, setEvents] = useState<
    EventResponse['_embedded']['events'] | []
  >([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const searchEvents = async ({
    query,
    startDate,
    endDate,
    city,
  }: {
    query: string
    startDate: string
    endDate: string
    city: string
  }) => {
    if (query.length >= 4) {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(
          `${TICKETMASTER_API_URI}&keyword=${query}&size=5&city=${city}&locale=*&startDateTime=${startDate}&endDateTime=${endDate}`
        )
        const data = await response.json()
        if (data._embedded?.events) {
          setEvents(
            data._embedded.events as EventResponse['_embedded']['events']
          )
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
