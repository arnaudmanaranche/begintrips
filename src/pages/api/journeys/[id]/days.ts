import type { NextApiRequest, NextApiResponse } from 'next'
import createClient from '@/libs/supabase/api'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createClient(req, res)
  const { id } = req.query

  if (req.method === 'GET') {
    const { data: days } = await supabase
      .from('days')
      .select('*')
      .eq('journeyId', id!)

    return res.status(200).json(days)
  } else {
    res.status(405).json({
      message: 'Method not allowed',
    })
  }
}
