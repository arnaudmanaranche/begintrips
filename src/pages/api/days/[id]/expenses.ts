import type { NextApiRequest, NextApiResponse } from 'next'

import createClient from '@/libs/supabase/api'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query
  const supabase = createClient(req, res)

  if (req.method === 'POST') {
    const { body } = req

    await supabase
      .from('expenses')
      .insert({
        amount: body.amount,
        category: body.category,
        dayId: body.dayId,
        startDate: body.startDate,
        endDate: body.endDate,
        name: body.name,
        journeyId: body.journeyId,
      })
      .eq('dayId', id!)

    res.status(201).json({ message: 'Expense created' })
  } else if (req.method === 'GET') {
    const { data } = await supabase
      .from('expenses')
      .select('*')
      .eq('dayId', id!)

    res.status(200).json(data)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
