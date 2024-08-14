import createClient from '@/libs/supabase/api'
import { groupedExpensesByCategory } from '@/utils/groupe-expenses'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createClient(req, res)

  if (req.method === 'GET') {
    const { data: expenses } = await supabase
      .from('expenses')
      .select('*')
      .eq('journeyId', req.query.id!)

    if (!expenses) {
      return res.status(404).json({ message: 'Expenses not found' })
    }

    const expensesByCategory = groupedExpensesByCategory({
      expenses,
    })

    return res.status(200).json(expensesByCategory)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
