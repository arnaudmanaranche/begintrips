import clsx from 'clsx'
import type { ReactNode } from 'react'
import { useMemo } from 'react'

import { mappedExpensesWithColors } from '@/utils/expense-labels'

export function ExpenseLabel({
  expenseCategory,
}: {
  expenseCategory: string
}): ReactNode {
  const color = useMemo(() => {
    return mappedExpensesWithColors.find(
      (expense) => expense.category === expenseCategory
    )?.color
  }, [expenseCategory])

  return (
    <div
      className={clsx(
        'flex items-center justify-center rounded-md border-[1px] px-2 py-1 text-xs font-medium',
        `bg-[${color}] border-[${color}] text-[${color}] border-opacity-50 bg-opacity-5`
      )}
    >
      <p>{expenseCategory}</p>
    </div>
  )
}
