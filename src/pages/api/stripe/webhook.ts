import { buffer } from 'micro'
import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

import {
  getUserByPaymentIntentId,
  getUserJourneysAfterPaymentDate,
  handleCheckoutSessionCompleted,
} from '@/libs/supabase/admin'
import createClient from '@/libs/supabase/api'

enum STRIPE_EVENTS_ENUM {
  CHECKOUT_SESSION_COMPLETED = 'checkout.session.completed',
  CHARGE_DISPUTE_CREATED = 'charge.dispute.created',
  CHARGE_REFUNDED = 'charge.refunded',
  RADAR_EARLY_FRAUD_WARNING_CREATED = 'radar.early_fraud_warning.created',
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
): Promise<void> {
  const sig = req.headers['stripe-signature']

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(400).json({
      message: 'Missing Stripe webhook secret',
    })
  }
  const supabase = createClient(req, res)

  const payload = await buffer(req)

  if (req.method === 'POST') {
    let event

    try {
      event = stripe.webhooks.constructEvent(
        payload,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err}`)
    }

    switch (event.type) {
      case STRIPE_EVENTS_ENUM.CHARGE_DISPUTE_CREATED: {
        const disputeSession = event.data.object

        const chargeId = disputeSession.charge

        await stripe.refunds.create({
          charge: chargeId as string,
        })

        break
      }
      case STRIPE_EVENTS_ENUM.CHARGE_REFUNDED: {
        const refundSession = event.data.object
        const paymentIntentId = refundSession.payment_intent

        if (!paymentIntentId) {
          throw new Error('No `paymentIntentId` linked')
        }

        const user = await getUserByPaymentIntentId({
          req,
          res,
          paymentIntentId: paymentIntentId as string,
        })

        if (!user) {
          throw new Error(
            `No user found linked to paymentIntentId ${paymentIntentId}`
          )
        }

        const { user_id, created_at } = user

        const { error } = await supabase
          .from('payments')
          .update({
            status: 'refunded',
          })
          .eq('external_payment_id', paymentIntentId as string)

        if (error) {
          throw new Error('Error updating payments: ' + error.message)
        }

        const { error: error2 } = await supabase.rpc('update_user_credits', {
          user_id: user_id as string,
          change_direction: -1,
          amount: 5,
        })

        if (error2) {
          throw new Error('Error updating credits: ' + error2.message)
        }

        const journeys = await getUserJourneysAfterPaymentDate({
          req,
          res,
          date: created_at as string,
          userId: user_id as string,
        })

        if (journeys?.length && journeys?.length > 0) {
          const journeyIds = journeys.map((journey) => journey.id)

          const { error } = await supabase
            .from('journeys')
            .update({ status: false })
            .in('id', journeyIds)
            .eq('userId', user_id as string)

          if (error) {
            throw new Error('Error updating journeys: ' + error.message)
          }
        }

        break
      }
      case STRIPE_EVENTS_ENUM.RADAR_EARLY_FRAUD_WARNING_CREATED: {
        const warningSession = event.data.object

        const chargeId = warningSession.charge

        await stripe.refunds.create({
          charge: chargeId as string,
        })

        break
      }
      case STRIPE_EVENTS_ENUM.CHECKOUT_SESSION_COMPLETED: {
        const session = event.data.object

        await handleCheckoutSessionCompleted({
          req,
          res,
          session,
        })
        break
      }
      default:
        // eslint-disable-next-line no-console
        console.info(`Unhandled event: ${event.type}`)
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}
