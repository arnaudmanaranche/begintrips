import { PersonIcon } from '@radix-ui/react-icons'
import type { IconProps } from '@radix-ui/react-icons/dist/types'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { ForwardRefExoticComponent, RefAttributes } from 'react'
import { type ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import { journeyNavigationItems } from '@/utils/navigationItems'

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
            'h-6 w-6',
            isActive ? 'text-accent' : 'text-black',
            !isEnabled ? 'text-black/50' : ''
          )}
        />
        {/* <div className="flex flex-col items-center space-x-2">
          {!isEnabled ? (
            <span className="rounded-md bg-accent px-2 text-xs text-white">
              <FormattedMessage id="soon" defaultMessage="Soon" />
            </span>
          ) : (
            <span>{label}</span>
          )}
        </div> */}
      </Link>
    </li>
  )
}

export function BottomBar(): ReactNode {
  const router = useRouter()
  const id = router.query.id as string

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white py-4 drop-shadow-2xl lg:hidden">
      <ul className="flex min-h-10  items-center justify-around ring-slate-200">
        {journeyNavigationItems.map((item, index) => {
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
            {/* <PersonIcon className="h-6 w-6 text-black" /> */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2Z"
                fill="#111111"
              />
              <path
                d="M8 14C5.23858 14 3 16.2386 3 19C3 20.6569 4.34315 22 6 22H18C19.6569 22 21 20.6569 21 19C21 16.2386 18.7614 14 16 14H8Z"
                fill="#111111"
              />
            </svg>
            {/* <span className="text-xs text-black">
              <FormattedMessage id="account" defaultMessage="Account" />
            </span> */}
          </Link>
        </li>
      </ul>
    </div>
  )
}
