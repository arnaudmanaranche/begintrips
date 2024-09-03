import clsx from 'clsx'
import type { ReactNode } from 'react'

export interface JourneyCardProps {
  children: ReactNode
  isFetching?: boolean
  isHiddenOnSmallScreens?: boolean
  title: ReactNode
}

export function JourneyCard({
  children,
  isFetching,
  isHiddenOnSmallScreens = false,
  title,
}: JourneyCardProps) {
  if (isFetching) {
    return (
      <div className="flex-1 space-y-4 rounded-md bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <div className="mx-auto flex max-w-screen-sm flex-col space-y-4">
          <div className="h-[20px] w-full animate-pulse rounded-lg bg-slate-200" />
          <div className="h-[50px] w-full animate-pulse rounded-lg bg-slate-200" />
        </div>
      </div>
    )
  }

  return (
    <div
      className={clsx(
        'flex-1 space-y-4 rounded-md bg-white p-4 shadow-sm ring-1 ring-slate-200',
        isHiddenOnSmallScreens && 'hidden lg:block'
      )}
    >
      <h3 className="mb-2 text-3xl">{title}</h3>
      {children}
    </div>
  )
}
