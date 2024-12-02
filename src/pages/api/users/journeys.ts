import type { NextApiRequest, NextApiResponse } from 'next'

import createClient from '@/libs/supabase/api'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const supabase = createClient(req, res)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (req.method === 'GET') {
    const { data } = await supabase
      .from('journeys')
      .select('*')
      .eq('userId', user?.id as string)

    const locale = req.headers['accept-language']?.split('-')[0] || 'en'

    const userJourneys = data?.map(async (journey) => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/search/geocode/v6/forward?q=${journey.destination}&language=${locale}&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
        )

        const data = await response.json()

        if (data.features.length > 0) {
          journey.destination = data.features[0]?.properties.name
        } else {
          journey.destination = 'Unknown'
        }
      } catch {
        journey.destination = 'Unknown'
      }

      return {
        ...journey,
        destination: journey.destination,
      }
    })

    const resolvedJourneys = await Promise.all(userJourneys || [])

    res.status(200).json(resolvedJourneys)
  } else {
    res.status(405).json({
      message: 'Method not allowed',
    })
  }
}
