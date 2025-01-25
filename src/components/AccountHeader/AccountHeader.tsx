import type { ReactNode } from 'react'

import { Logo } from '../Logo/Logo'

export function AccountHeader(): ReactNode {
  return (
    <div className="bg-accent-light px-4 py-2 lg:hidden">
      <Logo size="40" />
    </div>
  )
}
