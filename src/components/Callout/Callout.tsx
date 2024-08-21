import type { ReactNode } from 'react'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'

export function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-warning-light bg-warning-light/30 px-6 py-2">
      <ExclamationTriangleIcon className="h-4 w-4 text-warning-dark" />
      <p className="text-sm text-black">{children}</p>
    </div>
  )
}
