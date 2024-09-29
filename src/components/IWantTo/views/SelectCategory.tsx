import { StarFilledIcon } from '@radix-ui/react-icons'
import { useQuery } from '@tanstack/react-query'
import type { Dispatch, ReactNode, SetStateAction } from 'react'

import { getUserFavoriteCategories } from '@/api/calls/users'
import { QUERY_KEYS } from '@/api/queryKeys'
import type { IWantToStep } from '@/providers/QuickActions.Provider'
import type { AddExpenseWithCategories } from '@/types'

interface SelectCategoryProps {
  setCurrentStep: (step: IWantToStep) => void
  setNewExpense: Dispatch<SetStateAction<AddExpenseWithCategories>>
}

export function SelectCategory({
  setCurrentStep,
  setNewExpense,
}: SelectCategoryProps): ReactNode {
  const { data: categories, isPending } = useQuery({
    queryKey: QUERY_KEYS.USER_FAVORITE_CATEGORIES(),
    queryFn: () => getUserFavoriteCategories(),
  })

  return (
    <div className="mt-10 grid max-h-[500px] grid-cols-2 gap-5 overflow-y-scroll">
      {isPending ? (
        <>
          <div className="h-[40px] animate-pulse rounded-lg bg-slate-100" />
          <div className="h-[40px] animate-pulse rounded-lg bg-slate-100" />
          <div className="h-[40px] animate-pulse rounded-lg bg-slate-100" />
          <div className="h-[40px] animate-pulse rounded-lg bg-slate-100" />
          <div className="h-[40px] animate-pulse rounded-lg bg-slate-100" />
          <div className="h-[40px] animate-pulse rounded-lg bg-slate-100" />
        </>
      ) : null}
      {categories?.map((category) => (
        <div
          key={category.name}
          className="relative flex cursor-pointer flex-col items-center rounded-lg border-[1px] p-4 transition-colors hover:bg-slate-100"
          onClick={() => {
            setNewExpense((prev) => ({
              ...prev,
              category_id: category.id,
              categories: {
                name: category.name,
              },
            }))
            setCurrentStep('Add manually expense')
          }}
        >
          {category.isFavorite ? (
            <StarFilledIcon className="absolute right-3 top-3 text-yellow-500" />
          ) : null}
          {category.emoji}
          <span className="capitalize">{category.name}</span>
        </div>
      ))}
    </div>
  )
}
