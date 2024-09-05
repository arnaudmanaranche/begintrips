import type { NextApiRequest, NextApiResponse } from 'next'

import createClient from '@/libs/supabase/api'
import { groupedExpensesByDay } from '@/utils/groupe-expenses'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createClient(req, res)

  if (req.method === 'GET') {
    const { data: days } = await supabase
      .from('days')
      .select('id, startDate')
      .eq('journeyId', req.query.id!)

    if (!days) {
      return res.status(404).json({ message: 'Days not found' })
    }

    const expenses = days.map(async (day) => {
      const { data } = await supabase
        .from('expenses')
        .select('*')
        .eq('dayId', day.id)

      return data
    })

    if (!expenses) {
      return res.status(404).json({ message: 'Expenses not found' })
    }

    const exp = await Promise.all(expenses)

    const exp2 = groupedExpensesByDay({
      days,
      // @ts-expect-error TODO: fix type
      expenses: exp.flatMap((e) => e),
    })

    return res.status(200).json(exp2)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
