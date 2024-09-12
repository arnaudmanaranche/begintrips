import type { NextApiRequest, NextApiResponse } from 'next'

import createClient from '@/libs/supabase/api'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const supabase = createClient(req, res)
  const { id } = req.query
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (req.method === 'GET') {
    const { data: days } = await supabase
      .from('days')
      .select(
        `
    *,
    journeys!inner(userId)
  `
      )
      .eq('journeys.userId', user?.id as string)
      .eq('journeyId', id!)

    res.status(200).json(days)
  } else {
    res.status(405).json({
      message: 'Method not allowed',
    })
  }
}
