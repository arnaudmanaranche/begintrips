import type { NextApiRequest, NextApiResponse } from 'next'

import createClient from '@/libs/supabase/api'

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
      return res.status(401).json({
        message: `Journey ${id} not found for userId ${user?.id}`,
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

    const budgetSpent = expenses?.reduce((acc, expense) => {
      return acc + expense.amount
    }, 0)

    res.status(200).json({ journey, expenses, days, budgetSpent })
  } else {
    res.status(405).json({
      message: 'Method not allowed',
    })
  }
}
