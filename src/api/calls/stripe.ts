import { apiInstance } from '../config'

export const checkoutStripeProduct = async ({
  priceId,
}: {
  priceId: string
}) => {
  const { data } = await apiInstance.post('/stripe/checkout-session', {
    body: {
      priceId,
    },
  })

  return data
}
