import type { Journey, AddJourney, Expense, Day } from '@/types'
import { apiInstance } from '../config'
import { isInvalidDate } from '@/utils/date'

export interface GetJourneyParams {
  journeyId: string
  userId: string
}

export const deleteJourney = async ({
  journeyId,
  userId,
}: GetJourneyParams) => {
  return apiInstance.delete(`/journeys/${journeyId}?userId=${userId}`)
}

export const createJourney = async (journey: AddJourney) => {
  const { data } = await apiInstance.post('/journeys', journey)

  return data
}

export const getExpensesByCategory = async ({
  journeyId,
  userId,
}: GetJourneyParams) => {
  const { data } = await apiInstance.get<Record<string, Expense[]>>(
    `/journeys/${journeyId}/expenses-by-category?userId=${userId}`
  )

  return data
}

export const getExpensesByDay = async ({
  journeyId,
  userId,
}: GetJourneyParams) => {
  const { data } = await apiInstance.get<Record<string, Expense[]>>(
    `/journeys/${journeyId}/expenses-by-day?userId=${userId}`
  )
  return data
}

export const getJourney = async ({ journeyId, userId }: GetJourneyParams) => {
  const { data } = await apiInstance.get<{
    journey: Journey
    expenses: Expense[]
    days: Day[]
  }>(`/journeys/${journeyId}?userId=${userId}`)

  return data
}

export const getJourneyDays = async ({ journeyId }: { journeyId: string }) => {
  const { data } = await apiInstance.get<Day[]>(`/journeys/${journeyId}/days`)

  return data
}

export const getJourneyDetails = async ({
  journeyId,
  userId,
}: GetJourneyParams) => {
  const { data } = await apiInstance.get<Journey>(
    `/journeys/${journeyId}/details?userId=${userId}`
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
