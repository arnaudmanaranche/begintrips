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

  if (req.method === 'PATCH') {
    const { budget } = req.body

    if (!budget) {
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
  }
  if (req.method === 'GET') {
    const { data: expenses, error } = await supabase
      .from('expenses')
      .select('amount')
      .eq('journeyId', id!)

    if (error) {
      return res.status(500).json({
        message: 'Error fetching journey budget spent',
        cause: error,
      })
    }

    const budgetSpent = expenses?.reduce((acc, expense) => {
      return acc + expense.amount
    }, 0)

    res.status(200).json(budgetSpent)
  } else {
    res.status(405).json({
      message: 'Method not allowed',
    })
  }
}
