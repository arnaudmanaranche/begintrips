import Stripe from 'stripe'
import { NextApiRequest, NextApiResponse } from 'next'
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

  const { error } = await supabase.rpc('handle_payment_update', {
    payment_id: session.id,
    input_user_id: session.metadata?.user_id as string,
    payment_type: session.mode,
    payment_price_id: session.line_items?.data[0].price?.id as string,
  })
}
