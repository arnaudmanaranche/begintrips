import { apiInstance } from '../config'

export const checkoutSession = async ({
  email,
  externalProductId,
  internalProductId,
  mode,
}: {
  email: string
  externalProductId: string
  internalProductId: string
  mode: string
}): Promise<{ id: string }> => {
  const { data } = await apiInstance.post<Promise<{ id: string }>>(
    '/stripe/checkout-session',
    {
      email,
      externalProductId,
      internalProductId,
      mode,
    }
  )

  return data
}
