import type { NextApiRequest, NextApiResponse } from 'next'
import createClient from '@/libs/supabase/api'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createClient(req, res)

  if (req.method === 'GET') {
    const { data } = await supabase
      .from('journeys')
      .select('*')
      .eq('userId', req.query.userId!)

    res.status(200).json(data)
  } else {
    res.status(405).json({
      message: 'Method not allowed',
    })
  }
}
