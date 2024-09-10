import type { AddJourney, Day, Journey, JourneyPage } from '@/types'
import { isInvalidDate } from '@/utils/date'

import { apiInstance } from '../config'

export interface GetJourneyParams {
  journeyId: string
}

export const createJourney = async (journey: AddJourney) => {
  const { data } = await apiInstance.post('/journeys', journey)

  return data
}

export const getJourney = async ({ journeyId }: GetJourneyParams) => {
  const { data } = await apiInstance.get<JourneyPage>(`/journeys/${journeyId}`)

  return data
}

export const getJourneyDays = async ({ journeyId }: { journeyId: string }) => {
  const { data } = await apiInstance.get<Day[]>(`/journeys/${journeyId}/days`)

  return data
}

export const getJourneyDetails = async ({ journeyId }: GetJourneyParams) => {
  const { data } = await apiInstance.get<Journey>(
    `/journeys/${journeyId}/details`
  )

  return data
}

export const updateJourneyDates = async ({
  journeyId,
  departureDate,
  returnDate,
}: {
  journeyId: string
  departureDate: string
  returnDate: string
}) => {
  if (
    isInvalidDate(new Date(departureDate)) ||
    isInvalidDate(new Date(returnDate))
  ) {
    throw new Error('You need to set a valid start and end date')
  }

  const { data } = await apiInstance.patch(`/journeys/${journeyId}/dates`, {
    departureDate,
    returnDate,
  })

  return data
}

export const updateJourneyDestination = async ({
  journeyId,
  destination,
}: {
  journeyId: string
  destination: string
}) => {
  const { data } = await apiInstance.patch(
    `/journeys/${journeyId}/destination`,
    {
      destination,
    }
  )

  return data
}

export const updateJourneyBudget = async ({
  journeyId,
  budget,
}: {
  journeyId: string
  budget: number
}) => {
  const { data } = await apiInstance.patch(`/journeys/${journeyId}/budget`, {
    budget,
  })

  return data
}
