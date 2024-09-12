import createClient from '@/libs/supabase/api'
import { error } from 'console'
import { buffer } from 'micro'

import { NextApiRequest, NextApiResponse } from 'next'

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
])

export const config = {
  api: {
    bodyParser: false,
  },
}

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
    const supabase = createClient(req, res)

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
      case 'checkout.session.completed':
        const session = event.data.object

        const { error } = await supabase.rpc('handle_payment_update', {
          payment_id: session.id,
          input_user_id: session.metadata?.user_id as string,
          payment_type: session.mode,
          payment_price_id: session.line_items?.data[0].price?.id as string,
        })
        console.log(error)
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
