import createClient from '@/libs/supabase/api'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createClient(req, res)
  const { id, userId } = req.query

  if (req.method === 'DELETE') {
    await supabase.from('journeys').delete().eq('id', id!).eq('userId', userId!)

    res.status(204).end()
  } else if (req.method === 'GET') {
    const { data: journey, error: journeyError } = await supabase
      .from('journeys')
      .select('*')
      .eq('id', id!)
      .eq('userId', userId!)
      .single()

    if (!journey || journeyError) {
      return res.status(404).json({
        message: 'Journey not found',
      })
    }

    const { data: expenses } = await supabase
      .from('expenses')
      .select('*')
      .eq('journeyId', id!)

    const { data: days } = await supabase
      .from('days')
      .select('*')
      .eq('journeyId', id!)

    res.status(200).json({ journey, expenses, days })
  } else {
    res.status(405).json({
      message: 'Method not allowed',
    })
  }
}
