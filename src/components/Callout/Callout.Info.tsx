import { InfoCircledIcon } from '@radix-ui/react-icons'
import type { ReactNode } from 'react'

export function CalloutInfo({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-info-light bg-info-light/30 px-6 py-2">
      <InfoCircledIcon className="h-4 w-4 text-info-dark" />
      {children}
    </div>
  )
}
