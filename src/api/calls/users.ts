import { apiInstance } from '@/api/config'
import type { Journey, Payments, UserFavoriteCategories } from '@/types'

export const getUserJourneys = async (): Promise<Journey[]> => {
  const { data } = await apiInstance.get<Journey[]>(`/users/journeys`)

  return data
}

export const getUserPayments = async (): Promise<Payments[]> => {
  const { data } = await apiInstance.get<Payments[]>(`/users/bills`)

  return data
}

export const getUserFavoriteCategories = async (): Promise<
  UserFavoriteCategories[]
> => {
  const { data } =
    await apiInstance.get<UserFavoriteCategories[]>(`/users/categories`)

  return data
}

export const updateUserFavoriteCategory = async (
  categoryId: string
): Promise<void> => {
  const { data } = await apiInstance.patch(`/users/categories/${categoryId}`)

  return data
}
