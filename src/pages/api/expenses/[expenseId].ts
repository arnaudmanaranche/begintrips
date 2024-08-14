import type { NextApiRequest, NextApiResponse } from 'next'
import createClient from '@/libs/supabase/api'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { expenseId } = req.query
  const supabase = createClient(req, res)

  if (req.method === 'DELETE') {
    await supabase.from('expenses').delete().eq('id', expenseId!)

    res.status(204).json({ message: 'Expense deleted' })
  } else if (req.method === 'PATCH') {
    await supabase.from('expenses').update(req.body).eq('id', expenseId!)

    res.status(204).json({ message: 'Expense updated' })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
