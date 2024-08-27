import { Button } from '@/components/Button/Button'
import type { Journey } from '@/types'
import { formatDate } from '@/utils/date'
import { hasJourneyPassed } from '@/utils/has-journey-passed'
import router from 'next/router'

export interface MyJourneysProps {
  journeys: Journey[]
  isLoading: boolean
}

export default function MyJourneys({ journeys, isLoading }: MyJourneysProps) {
  if (isLoading) {
    return (
      <div className="mx-auto mt-20 flex min-h-[500px] max-w-screen-sm flex-col space-y-4">
        <div className="h-[100px] w-full animate-pulse rounded-lg bg-slate-200" />
        <div className="h-[100px] w-full animate-pulse rounded-lg bg-slate-200" />
        <div className="h-[100px] w-full animate-pulse rounded-lg bg-slate-200" />
      </div>
    )
  }

  return journeys.length === 0 ? (
    <p className="text-center text-lg text-slate-400">No journeys yet</p>
  ) : (
    <div className="flex flex-col space-y-4">
      {journeys.map((journey) => (
        <div
          key={journey.id}
          className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0"
        >
          <div className="flex flex-col space-y-1">
            <span>Destination: {journey.destination}</span>
            <span>
              Dates: {formatDate(journey.departureDate, 'dd/MM/yyyy')} -{' '}
              {formatDate(journey.returnDate, 'dd/MM/yyyy')}
            </span>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => router.push(`/journey/${journey.id}`)}>
              {hasJourneyPassed(new Date(journey.departureDate))
                ? 'Visit'
                : 'Edit'}
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
