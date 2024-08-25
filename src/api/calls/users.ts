import { apiInstance } from '@/api/config'
import type { Journey } from '@/types'

export const getUserJourneys = async ({ userId }: { userId: string }) => {
  const { data } = await apiInstance.get<Journey[]>(
    `/users/journeys?userId=${userId}`
  )

  return data
}
