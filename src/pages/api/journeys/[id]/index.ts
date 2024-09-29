import type { NextApiRequest, NextApiResponse } from 'next'

import createClient from '@/libs/supabase/api'
import type { ExpenseWithCategories } from '@/types'
import {
  groupedExpensesByCategory,
  groupedExpensesByDay,
} from '@/utils/groupe-expenses'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
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

    const { data: expenses, error: expensesError } = await supabase
      .from('expenses')
      .select('*, categories(name)')
      .eq('journeyId', id!)

    if (expensesError) {
      return res.status(500).json({
        message: `Error fetching expenses for journey ${id}`,
      })
    }

    const { data: days, error: daysError } = await supabase
      .from('days')
      .select('*')
      .eq('journeyId', id!)

    if (daysError) {
      return res.status(500).json({
        message: `Error fetching days for journey ${id}`,
      })
    }

    const budgetSpent = expenses?.reduce((acc, expense) => {
      return acc + expense.amount
    }, 0)

    const expensesByDay = groupedExpensesByDay({
      days,
      expenses: expenses.flatMap((e) => e) as ExpenseWithCategories[],
    })

    const expensesByCategory = groupedExpensesByCategory({
      expenses: expenses as ExpenseWithCategories[],
    })

    res
      .status(200)
      .json({ journey, days, budgetSpent, expensesByCategory, expensesByDay })
  } else {
    res.status(405).json({
      message: 'Method not allowed',
    })
  }
}
