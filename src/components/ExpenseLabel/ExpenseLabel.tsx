import type { ExpenseCategoryEnum } from '@/types'
import { mappedExpensesWithColors } from '@/utils/expense-labels'
import clsx from 'clsx'
import { useMemo } from 'react'

export function ExpenseLabel({
  expenseCategory,
}: {
  expenseCategory: ExpenseCategoryEnum
}) {
  const color = useMemo(() => {
    return mappedExpensesWithColors.find(
      (expense) => expense.category === expenseCategory
    )?.color
  }, [expenseCategory])

  return (
    <div
      className={clsx(
        'flex items-center justify-center rounded-lg p-2 text-xs text-white',
        `bg-[${color}]`
      )}
    >
      <p>{expenseCategory}</p>
    </div>
  )
}
