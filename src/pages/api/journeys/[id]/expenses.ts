import createClient from '@/libs/supabase/api'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createClient(req, res)

  if (req.method === 'GET') {
    const { data } = await supabase
      .from('expenses')
      .select('*')
      .eq('journeyId', req.query.id as string)

    res.status(200).json(data)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
