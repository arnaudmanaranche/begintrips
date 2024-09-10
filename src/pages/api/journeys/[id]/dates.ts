import type { NextApiRequest, NextApiResponse } from 'next'

import createClient from '@/libs/supabase/api'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createClient(req, res)
  const { id } = req.query
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (req.method === 'PATCH') {
    const { departureDate, returnDate } = req.body

    if (!departureDate || !returnDate) {
      return res.status(400).json({
        message: 'Missing departure or return date',
      })
    }

    const { error } = await supabase
      .from('journeys')
      .update({ departureDate, returnDate })
      .eq('id', id!)
      .eq('userId', user?.id as string)
      .select('*')
      .single()

    if (error) {
      return res.status(500).json({
        message: 'Error updating journey dates',
        cause: error,
      })
    }

    await supabase.rpc('update_journey_dates', {
      start_date: departureDate,
      end_date: returnDate,
      journey_id: id as string,
    })

    res.status(200).json({ message: 'Journey dates updated' })
  } else {
    res.status(405).json({
      message: 'Method not allowed',
    })
  }
}
