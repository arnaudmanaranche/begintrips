import type { ReactNode } from 'react'
import { useMemo } from 'react'

import { mappedExpensesWithColors } from '@/utils/expense-labels'

interface ExpenseLabelProps {
  expenseCategory: string
}

export function ExpenseLabel({
  expenseCategory,
}: ExpenseLabelProps): ReactNode {
  const color = useMemo(() => {
    return mappedExpensesWithColors.find(
      (expense) => expense.category === expenseCategory
    )?.color
  }, [expenseCategory])

  return (
    <div
      className={`flex items-center justify-center rounded-md border-[1px] border-opacity-50 bg-opacity-5 px-1 py-[0.5] text-[11px] bg-[${color}] border-[${color}] text-[${color}] `}
    >
      <p>{expenseCategory}</p>
    </div>
  )
}
