import { getExpensesByCategory } from '@/api/calls/journeys'
import type { Expense } from '@/types'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { Alata } from 'next/font/google'
import { useRouter } from 'next/router'
import { ExpensesCharts } from '../ExpensesCharts/ExpensesCharts'

const alata = Alata({ weight: '400', subsets: ['latin'] })

export interface ExpensesProps {
  expenses: Record<string, Expense[]>
  userId: string
}

export function Expenses({ expenses: initialExpenses, userId }: ExpensesProps) {
  const { query } = useRouter()

  const { data: expensesByCategory, isFetching } = useQuery({
    queryKey: [query.id, 'expensesByCategory'],
    queryFn: () =>
      getExpensesByCategory({ journeyId: query.id as string, userId }),
    initialData: initialExpenses,
  })

  if (isFetching) {
    return (
      <div className="flex flex-col space-y-2">
        <div className="h-[400px] w-full animate-pulse rounded-lg bg-slate-200" />
        <div className="flex flex-col space-y-4">
          <div className="h-[30px] w-full animate-pulse rounded-lg bg-slate-200" />
          <div className="h-[30px] w-full animate-pulse rounded-lg bg-slate-200" />
          <div className="h-[30px] w-full animate-pulse rounded-lg bg-slate-200" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <h2
        className={clsx(alata.className, 'sticky top-0 bg-white pb-4 text-3xl')}
      >
        Expenses
      </h2>
      <ExpensesCharts expensesByCategory={expensesByCategory} />
      {expensesByCategory && Object.keys(expensesByCategory).length === 0 ? (
        <p>No expenses yet</p>
      ) : (
        <ul>
          {expensesByCategory &&
            Object.entries(expensesByCategory).map(([category, expenses]) => (
              <div key={category} className="flex justify-between">
                <h2>{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
                {expenses !== undefined ? (
                  <ul className="flex flex-col items-end">
                    {expenses.map((expense: Expense, index: number) => (
                      <li key={index}>
                        {expense.name}: ${expense.amount}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
        </ul>
      )}
    </div>
  )
}
