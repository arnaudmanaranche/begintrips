import { apiInstance } from '../config'

export const checkoutSession = async ({
  externalProductId,
  internalProductId,
  mode,
}: {
  externalProductId: string
  internalProductId: string
  mode: string
}): Promise<{ id: string }> => {
  const { data } = await apiInstance.post<Promise<{ id: string }>>(
    '/stripe/checkout-session',
    {
      externalProductId,
      internalProductId,
      mode,
    }
  )

  return data
}
