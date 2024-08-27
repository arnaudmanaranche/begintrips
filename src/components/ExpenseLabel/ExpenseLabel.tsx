import type { ExpenseCategoryEnum } from '@/types'
import { mappedExpensesWithColors } from '@/utils/expense-labels'
import { getTextColor } from '@/utils/get-text-color'
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

  const textColor = useMemo(() => {
    return getTextColor(color as string)
  }, [color])

  return (
    <div
      className={clsx(
        'flex items-center justify-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
        `bg-[${color}] ring-[${color}] text-${textColor}`
      )}
    >
      <p>{expenseCategory}</p>
    </div>
  )
}
