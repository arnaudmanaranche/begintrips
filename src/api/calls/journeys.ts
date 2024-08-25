import type { Journey, AddJourney, Expense, Day } from '@/types'
import { apiInstance } from '../config'

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
