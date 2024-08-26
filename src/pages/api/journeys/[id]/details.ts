import createClient from '@/libs/supabase/api'
import type { NextApiRequest, NextApiResponse } from 'next'
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createClient(req, res)
  const { id } = req.query
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (req.method === 'GET') {
    const { data: journey, error: journeyError } = await supabase
      .from('journeys')
      .select('*')
      .eq('id', id!)
      .eq('userId', user?.id as string)
      .single()

    if (!journey || journeyError) {
      return res.status(404).json({
        message: 'Journey not found',
      })
    }

    res.status(200).json(journey)
  } else {
    res.status(405).json({
      message: 'Method not allowed',
    })
  }
}
