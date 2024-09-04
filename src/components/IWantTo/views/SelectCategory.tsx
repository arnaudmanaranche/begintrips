import type { IWantToStep } from '@/providers/QuickActions.Provider'
import type { AddExpense } from '@/types'
import { mappedExpensesWithEmojis } from '@/utils/expense-labels'
import type { Dispatch, SetStateAction } from 'react'

export interface SelectCategoryProps {
  setCurrentStep: (step: IWantToStep) => void
  setNewExpense: Dispatch<SetStateAction<AddExpense>>
}

export function SelectCategory({
  setCurrentStep,
  setNewExpense,
}: SelectCategoryProps) {
  return (
    <div className="mt-10 grid max-h-[500px] grid-cols-2 gap-5 overflow-y-scroll">
      {mappedExpensesWithEmojis.map((mappedExpense) => (
        <div
          key={mappedExpense.name}
          className="flex cursor-pointer flex-col items-center rounded-lg border-[1px] p-4 transition-colors hover:bg-slate-100"
          onClick={() => {
            setNewExpense((prev) => ({
              ...prev,
              category: mappedExpense.category,
            }))
            setCurrentStep('Add manually expense')
          }}
        >
          {mappedExpense.emoji}
          <span className="capitalize">{mappedExpense.name}</span>
        </div>
      ))}
    </div>
  )
}
