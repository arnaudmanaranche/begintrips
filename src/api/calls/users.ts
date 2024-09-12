import { apiInstance } from '@/api/config'
import type { Journey } from '@/types'

export const getUserJourneys = async (): Promise<Journey[]> => {
  const { data } = await apiInstance.get<Journey[]>(`/users/journeys`)

  return data
}
