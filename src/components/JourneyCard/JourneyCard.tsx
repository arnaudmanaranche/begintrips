import clsx from 'clsx'
import type { ReactNode } from 'react'

interface JourneyCardProps {
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
}: JourneyCardProps): ReactNode {
  if (isFetching) {
    return (
      <div className="flex-1 rounded-md bg-white ring-slate-200">
        <div className="flex flex-col space-y-4">
          <div className="h-[20px] w-full animate-pulse rounded-md bg-slate-200" />
          <div className="h-[50px] w-full animate-pulse rounded-md bg-slate-200" />
        </div>
      </div>
    )
  }

  return (
    <div
      className={clsx(
        'flex-1 rounded-md bg-[#0D3553] bg-opacity-85 shadow-sm ring-1 ring-slate-200',
        isHiddenOnSmallScreens && 'hidden lg:block'
      )}
    >
      <h3 className="px-4 py-2 text-lg text-white">{title}</h3>
      <div className="mb-2 rounded-md border-t-[1px] bg-white pt-4">
        {children}
      </div>
    </div>
  )
}
