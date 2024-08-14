import type { NextApiRequest, NextApiResponse } from 'next'
import createClient from '@/libs/supabase/api'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createClient(req, res)
  const { id } = req.query

  if (req.method === 'DELETE') {
    await supabase.from('journeys').delete().eq('id', id!)
    res.status(204).json({
      message: 'Journey deleted',
    })
  } else if (req.method === 'GET') {
    const { data: journey } = await supabase
      .from('journeys')
      .select('*')
      .eq('id', id!)
      .single()

    res.status(200).json(journey)
  } else {
    res.status(405).json({
      message: 'Method not allowed',
    })
  }
}
