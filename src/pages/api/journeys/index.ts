import createClient from '@/libs/supabase/api'
import type { AddJourney, AddDay } from '@/types'
import { unsplash } from '@/libs/unsplash'
import { addDays, differenceInDays } from 'date-fns'
import type { NextApiRequest, NextApiResponse } from 'next'

async function createJourney(data: AddJourney): Promise<AddJourney> {
  const { departureDate, returnDate, destination, budget } = data

  const imageCover = await unsplash.photos.getRandom({
    query: destination,
    orientation: 'landscape',
    count: 1,
  })

  return {
    departureDate,
    returnDate,
    destination: destination ?? '',
    budget: budget ?? 0,
    image_cover: Array.isArray(imageCover.response)
      ? (imageCover.response[0]?.urls?.regular ?? null)
      : (imageCover.response?.urls?.regular ?? null ?? ''),
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createClient(req, res)

  if (req.method === 'POST') {
    const journey = req.body

    // 1. Create journey
    const createdJourney = await createJourney(journey)
    // 2. Save journey
    const { data, error } = await supabase
      .from('journeys')
      .upsert(createdJourney)
      .select('id')
      .single()

    if (!data || error) {
      res.status(500).json({ message: 'Error when creating journey', error })
      return
    }
    // 3. Save days
    const journeyLength =
      differenceInDays(
        new Date(journey.returnDate),
        new Date(journey.departureDate)
      ) + 1

    const days: AddDay[] = Array.from({ length: journeyLength }, (_, index) => {
      const date = addDays(new Date(journey.departureDate), index)

      return {
        startDate: date.toISOString(),
        journeyId: data.id,
      }
    })

    await supabase.from('days').insert(days)

    res.status(200).json({ message: 'Journey created', journeyId: data.id })
  } else {
    // Handle any other HTTP method
    res.status(405).json({ message: 'Method not allowed' })
  }
}
