import { PersonIcon } from '@radix-ui/react-icons'
import type { IconProps } from '@radix-ui/react-icons/dist/types'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { ForwardRefExoticComponent, RefAttributes } from 'react'
import { type ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import { jounryeNavigationItems } from '@/utils/navigationItems'

function BottomBarItem({
  href,
  icon,
  label,
  isActive,
  isEnabled,
}: {
  href: string
  icon: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>
  label: ReactNode
  isActive: boolean
  isEnabled: boolean
}): ReactNode {
  const Icon = icon

  return (
    <li>
      <Link
        href={href}
        className={clsx(
          'flex flex-col items-center space-y-1 text-xs',
          isActive ? 'text-accent' : 'text-black',
          !isEnabled ? 'pointer-events-none text-black/50' : ''
        )}
      >
        <Icon
          className={clsx(
            'h-5 w-5',
            isActive ? 'text-accent' : 'text-black',
            !isEnabled ? 'text-black/50' : ''
          )}
        />
        <div className="flex flex-col items-center space-x-2">
          {!isEnabled ? (
            <span className="rounded-md bg-accent px-2 text-xs text-white">
              <FormattedMessage id="soon" defaultMessage="Soon" />
            </span>
          ) : (
            <span>{label}</span>
          )}
        </div>
      </Link>
    </li>
  )
}

export function BottomBar(): ReactNode {
  const router = useRouter()
  const id = router.query.id as string

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white lg:hidden">
      <ul className="flex h-16  items-center justify-around ring-1 ring-slate-200">
        {jounryeNavigationItems.map((item, index) => {
          const href = item.href.replace('[id]', id)
          const Icon = item.icon
          const isActive = router.pathname === item.href

          return (
            <BottomBarItem
              isEnabled={item.isEnabled}
              key={`bottombar-item-${index}`}
              isActive={isActive}
              href={href}
              icon={Icon}
              label={item.label}
            />
          )
        })}
        <li>
          <Link
            href="/account"
            className="flex flex-col items-center space-y-1"
          >
            <PersonIcon className="h-6 w-6 text-black" />
            <span className="text-xs text-black">
              <FormattedMessage id="account" defaultMessage="Account" />
            </span>
          </Link>
        </li>
      </ul>
    </div>
  )
}
