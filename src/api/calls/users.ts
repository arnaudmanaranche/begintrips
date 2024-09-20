import { apiInstance } from '@/api/config'
import type { Journey, Payments } from '@/types'

export const getUserJourneys = async (): Promise<Journey[]> => {
  const { data } = await apiInstance.get<Journey[]>(`/users/journeys`)

  return data
}

export const getUserPayments = async (): Promise<Payments[]> => {
  const { data } = await apiInstance.get<Payments[]>(`/users/bills`)

  return data
}
