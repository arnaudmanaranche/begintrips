import type { AddJourneyOnboarding } from '@/stores/onboarding.store'
import type { Day, JourneyPage } from '@/types'
import { isInvalidDate } from '@/utils/date'

import { apiInstance } from '../config'

interface GetJourneyParams {
  journeyId: string
}

export const createJourney = async (
  journey: AddJourneyOnboarding
): Promise<{ message: string; journeyId: string }> => {
  const { data } = await apiInstance.post('/journeys', journey)

  return data
}

export const getJourney = async ({
  journeyId,
}: GetJourneyParams): Promise<JourneyPage> => {
  const { data } = await apiInstance.get<JourneyPage>(`/journeys/${journeyId}`)

  if (!data.journey.status) {
    throw new Error('Journey is not active')
  }

  return data
}

export const getJourneyDays = async ({
  journeyId,
}: {
  journeyId: string
}): Promise<Day[]> => {
  const { data } = await apiInstance.get<Day[]>(`/journeys/${journeyId}/days`)

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
}): Promise<{ message: string }> => {
  if (
    isInvalidDate(new Date(departureDate)) ||
    isInvalidDate(new Date(returnDate))
  ) {
    throw new Error('You need to set a valid start and end date')
  }

  const { data } = await apiInstance.patch<{ message: string }>(
    `/journeys/${journeyId}/dates`,
    {
      departureDate,
      returnDate,
    }
  )

  return data
}

export const updateJourneyDestination = async ({
  journeyId,
  destination,
}: {
  journeyId: string
  destination: string
}): Promise<{ message: string }> => {
  const { data } = await apiInstance.patch<{ message: string }>(
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
}): Promise<{ message: string }> => {
  const { data } = await apiInstance.patch<{ message: string }>(
    `/journeys/${journeyId}/budget`,
    {
      budget,
    }
  )

  return data
}
