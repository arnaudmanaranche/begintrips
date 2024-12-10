import type { NextApiRequest, NextApiResponse } from 'next'

import createClient from '@/libs/supabase/api'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { id } = req.query
  const supabase = createClient(req, res)

  if (req.method === 'POST') {
    const { body } = req

    const { error } = await supabase
      .from('expenses')
      .insert({
        amount: body.amount,
        category_id: body.category_id,
        startDate: body.startDate,
        endDate: body.endDate,
        name: body.name,
        journeyId: body.journeyId,
      })
      .eq('dayId', id!)

    if (error) {
      res.status(400).json({
        status: 'error',
        message: error.message,
      })
    } else {
      res.status(201).json({
        status: 'success',
        message: 'Expense created',
      })
    }
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
