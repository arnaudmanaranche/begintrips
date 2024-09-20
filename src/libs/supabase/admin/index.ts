import type { NextApiRequest, NextApiResponse } from 'next'
import type Stripe from 'stripe'

import createClient from '../api'

export async function handleCheckoutSessionCompleted({
  req,
  res,
  session,
}: {
  req: NextApiRequest
  res: NextApiResponse
  session: Stripe.Checkout.Session
}): Promise<void> {
  const supabase = createClient(req, res)

  await supabase.from('payments').insert({
    internal_product_id: session.metadata?.internalProductId,
    status: 'succeeded',
    external_payment_id: session.payment_intent as string,
    user_id: session.metadata?.userId as string,
  })

  await supabase.rpc('update_user_credits', {
    user_id: session.metadata?.userId as string,
    change_direction: 1,
    amount: 5,
  })
}

export async function getUserByPaymentIntentId({
  req,
  res,
  paymentIntentId,
}: {
  req: NextApiRequest
  res: NextApiResponse
  paymentIntentId: string
}): Promise<{
  user_id: string | null
} | null> {
  const supabase = createClient(req, res)

  const { data } = await supabase
    .from('payments')
    .select('user_id')
    .eq('external_payment_id', paymentIntentId)
    .single()

  return data
}
