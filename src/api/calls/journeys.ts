import type { Journey, AddJourney, Expense, Day } from '@/types'
import { apiInstance } from '../config'

export const deleteJourney = async (id: string) => {
  return apiInstance.delete(`/journeys/${id}`)
}

export const createJourney = async (journey: AddJourney) => {
  const { data } = await apiInstance.post('/journeys', journey)

  return data
}

export const getExpensesByCategory = async ({
  journeyId,
}: {
  journeyId: string
}) => {
  const { data } = await apiInstance.get<Record<string, Expense[]>>(
    `/journeys/${journeyId}/expenses-by-category`
  )

  return data
}

export const getExpensesByDay = async ({
  journeyId,
}: {
  journeyId: string
}) => {
  const { data } = await apiInstance.get<Record<string, Expense[]>>(
    `/journeys/${journeyId}/expenses-by-day`
  )
  return data
}

export const getJourney = async ({ journeyId }: { journeyId: string }) => {
  const { data } = await apiInstance.get<Journey>(`/journeys/${journeyId}`)

  return data
}

export const getJourneyDays = async ({ journeyId }: { journeyId: string }) => {
  const { data } = await apiInstance.get<Day[]>(`/journeys/${journeyId}/days`)

  return data
}

export const getJourneyExpenses = async ({
  journeyId,
}: {
  journeyId: string
}) => {
  const { data } = await apiInstance.get<Expense[]>(
    `/journeys/${journeyId}/expenses`
  )

  return data
}
