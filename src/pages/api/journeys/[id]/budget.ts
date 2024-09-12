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

  if (req.method === 'PATCH') {
    const { budget } = req.body

    if (budget === undefined || budget === null) {
      return res.status(400).json({
        message: 'Missing budget',
      })
    }

    const { error } = await supabase
      .from('journeys')
      .update({ budget })
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

    res.status(200).json({ message: 'Journey budget updated' })
  } else {
    res.status(405).json({
      message: 'Method not allowed',
    })
  }
}
