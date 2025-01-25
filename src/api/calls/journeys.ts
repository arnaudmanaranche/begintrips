import type { AddJourneyOnboarding } from '@/stores/onboarding.store'
import type { JourneyPage } from '@/types'

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

export const updateJourney = async ({
  journeyId,
  budget,
  destination,
  departureDate,
  returnDate,
}: {
  journeyId: string
  budget: number
  destination: string
  departureDate: string
  returnDate: string
}): Promise<{ message: string }> => {
  const { data } = await apiInstance.patch<{ message: string }>(
    `/journeys/${journeyId}`,
    {
      budget,
      destination,
      departureDate,
      returnDate,
    }
  )

  return data
}
