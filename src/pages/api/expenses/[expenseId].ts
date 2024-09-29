import type { NextApiRequest, NextApiResponse } from 'next'

import createClient from '@/libs/supabase/api'
import type { UpdateExpense } from '@/types'

interface TypedNextApiRequest extends NextApiRequest {
  body: UpdateExpense
}

export default async function handler(
  req: TypedNextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { expenseId } = req.query
  const supabase = createClient(req, res)

  if (req.method === 'DELETE') {
    await supabase.from('expenses').delete().eq('id', expenseId!)

    res.status(204).json({ message: 'Expense deleted' })
  } else if (req.method === 'PATCH') {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { categories: _, ...rest } = req.body

    const { error } = await supabase
      .from('expenses')
      .update({
        ...rest,
      })
      .eq('id', expenseId!)

    if (error) {
      return res.status(500).json({
        message: 'Error updating expense',
        cause: error,
      })
    }

    res.status(204).json({ message: 'Expense updated' })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
