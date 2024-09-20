import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

import createClient from '@/libs/supabase/api'
import { SITE_URL } from '@/utils/seo'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const REDIRECT_URL = `${SITE_URL}/account`

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const supabase = createClient(req, res)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { externalProductId, internalProductId, mode } = req.body

  if (!externalProductId || !mode || !user?.id) {
    return res.status(400).json({ error: 'Malformed request' })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode,
      metadata: {
        userId: user.id,
        externalProductId,
        internalProductId,
      },
      line_items: [
        {
          price: externalProductId,
          quantity: 1,
        },
      ],
      success_url: `${REDIRECT_URL}?payment_status=succeeded`,
      cancel_url: `${REDIRECT_URL}?payment_status=declined`,
    })

    return res.json({ id: session.id })
  } catch (error) {
    return res.json({
      error: 'An error occurred while creating the checkout session',
      message: error,
    })
  }
}
