import type { NextApiRequest, NextApiResponse } from 'next'

import createClient from '@/libs/supabase/api'
import type { AddJourneyOnboarding } from '@/stores/onboarding.store'
import type { AddJourney } from '@/types'

async function createJourney(data: AddJourneyOnboarding): Promise<AddJourney> {
  const { departureDate, returnDate, destination, budget } = data

  return {
    departureDate,
    returnDate,
    destination: destination.id ?? '',
    budget: budget ?? 0,
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const supabase = createClient(req, res)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (req.method === 'POST') {
    const { data: userEntity } = await supabase
      .from('users')
      .select('credits')
      .eq('id', user?.id as string)
      .single()

    if (userEntity?.credits === 0) {
      return res
        .status(403)
        .json({ message: 'Insufficient credits to create a journey' })
    }

    const journey = req.body

    const createdJourney = await createJourney(journey)

    const { data, error } = await supabase
      .from('journeys')
      .upsert(createdJourney)
      .select('id')
      .single()

    if (!data || error) {
      res.status(500).json({ message: 'Error when creating journey', error })
      return
    }

    await supabase.rpc('update_user_credits', {
      user_id: user?.id as string,
      change_direction: -1,
      amount: 1,
    })

    res.status(200).json({ message: 'Journey created', journeyId: data.id })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
