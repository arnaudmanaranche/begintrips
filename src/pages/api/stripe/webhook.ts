import { handleCheckoutSessionCompleted } from '@/libs/supabase/admin'

import { NextApiRequest, NextApiResponse } from 'next'
import { buffer } from 'micro'
import Stripe from 'stripe'

enum STRIPE_EVENTS_ENUM {
  CHECKOUT_SESSION_COMPLETED = 'checkout.session.completed',
}

export const config = {
  api: {
    bodyParser: false,
  },
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const sig = req.headers['stripe-signature']

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('Webhook secret not found')
    return res.status(400).json({
      message: 'Missing Stripe webhook secret',
    })
  }

  const buf = await buffer(req)

  if (req.method === 'POST') {
    let event

    try {
      event = stripe.webhooks.constructEvent(
        buf,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err}`)
    }

    switch (event.type) {
      case STRIPE_EVENTS_ENUM.CHECKOUT_SESSION_COMPLETED:
        const session = event.data.object

        await handleCheckoutSessionCompleted({
          req,
          res,
          session,
        })
        break
      default:
        console.info(`Unhandled event: ${event.type}`)
    }

    res.status(200).json({ status: 'ok' })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}
