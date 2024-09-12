import { id } from 'date-fns/locale'
import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

import createClient from '@/libs/supabase/api'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createClient(req, res)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  try {
    const {
      body: { priceId },
    } = req.body
    // console.log(req.body?.priceId)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      metadata: {
        user_id: user?.id as string,
      },
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: 'http://localhost:3000/account',
      cancel_url: 'http://localhost:3000/account',
    })

    return res.json({ id: session.id })
  } catch (err) {
    return res.json({
      error: 'An error occurred while creating the checkout session.',
    })
  }
}
