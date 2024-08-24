import { deleteJourney } from '@/api/calls/journeys'
import { getUserJourneys } from '@/api/calls/users'
import { Button } from '@/components/Button/Button'
import type { Journey } from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import router from 'next/router'

export interface MyJourneysProps {
  userId: string
  journeys: Journey[]
}

export default function MyJourneys({
  userId,
  journeys: initialJourneys,
}: MyJourneysProps) {
  const queryClient = useQueryClient()
  const { mutateAsync: hanldeDeleteJourney } = useMutation({
    mutationFn: deleteJourney,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [userId, 'journeys'] })
    },
  })

  const { data: journeys, isFetching } = useQuery({
    queryKey: [userId, 'journeys'],
    queryFn: getUserJourneys,
    initialData: initialJourneys,
  })

  if (isFetching) {
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
              Dates: {format(new Date(journey.departureDate), 'dd/MM/yyyy')} -{' '}
              {format(new Date(journey.returnDate), 'dd/MM/yyyy')}
            </span>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              onClick={() => router.push(`/journey/${journey.id}`)}
            >
              Visit
            </Button>
            <Button
              variant="ghost"
              onClick={() => hanldeDeleteJourney(journey.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
