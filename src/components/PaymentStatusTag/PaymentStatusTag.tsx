import clsx from 'clsx'
import type { ReactNode } from 'react'

import type { PaymentStatusEnum } from '@/types'

interface BadgeProps {
  children: React.ReactNode
  className?: string
}

function Badge({ children, className = '' }: BadgeProps) {
  return (
    <span
      className={clsx(
        'rounded-full border-[0.5px] px-2.5 py-0.5 text-xs font-medium',
        className
      )}
    >
      {children}
    </span>
  )
}

interface PaymentStatusTagProps {
  status: PaymentStatusEnum
}

export function PaymentStatusTag({ status }: PaymentStatusTagProps): ReactNode {
  const getStatusStyles = (status: PaymentStatusEnum) => {
    switch (status) {
      case 'succeeded':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'refunded':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'failed':
        return 'bg-gray-100 text-gray-800 border-gray-300'
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300'
    }
  }

  return <Badge className={getStatusStyles(status)}>{status}</Badge>
}
