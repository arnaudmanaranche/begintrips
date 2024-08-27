import { ExclamationTriangleIcon, InfoCircledIcon } from '@radix-ui/react-icons'
import type { ReactNode } from 'react'

export interface CalloutProps {
  type: 'danger' | 'info'
  children: ReactNode
}

const Callout = ({ type, children }: CalloutProps) => {
  const types = {
    danger: {
      icon: <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />,
      borderColor: 'border-red-600',
      bgColor: 'bg-red-100',
      textColor: 'text-red-900',
    },
    info: {
      icon: <InfoCircledIcon className="h-4 w-4 text-blue-600" />,
      borderColor: 'border-info',
      bgColor: 'bg-info-light/30',
      textColor: 'text-info-dark',
    },
  }

  const { icon, borderColor, bgColor, textColor } = types[type] || types.info

  return (
    <div
      className={`flex items-center gap-2 rounded-md border ${borderColor} ${bgColor} px-6 py-2`}
    >
      {icon}
      <p className={`text-sm ${textColor}`}>{children}</p>
    </div>
  )
}

const Danger = ({ children }: { children: ReactNode }) => (
  <Callout type="danger">{children}</Callout>
)

Danger.displayName = 'Callout.Danger'

const Info = ({ children }: { children: ReactNode }) => (
  <Callout type="info">{children}</Callout>
)

Info.displayName = 'Callout.Info'

Callout.Info = Info
Callout.Danger = Danger

export { Callout }
