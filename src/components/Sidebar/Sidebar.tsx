import { PersonIcon } from '@radix-ui/react-icons'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { type ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'
import { Drawer } from 'vaul'

import { journeyNavigationItems } from '@/utils/navigationItems'

import { Button } from '../Button/Button'
import { Logo } from '../Logo/Logo'
import { Logo } from '../Logo/Logo'

function SidebarItem({
  href,
  icon,
  isActive,
  isEnabled,
  label,
}: {
  href: string
  icon: (props: { isActive: boolean }) => ReactNode
  label: ReactNode
  isActive: boolean
  isEnabled: boolean
}): ReactNode {
  return (
    <li>
      <Link
        href={href}
        className={clsx(
          'flex w-full items-center space-x-2 rounded-md px-4 py-2 hover:bg-gray-100 hover:font-bold',
          isActive ? 'bg-gray-100 font-medium' : 'text-black',
          !isEnabled ? 'pointer-events-none text-black/50' : ''
        )}
      >
        {icon({ isActive })}
        <div className="flex items-center space-x-2">
          <span>{label}</span>
          {!isEnabled ? (
            <span className="rounded-md bg-accent px-2 text-xs text-white">
              <FormattedMessage id="soon" defaultMessage="Soon" />
            </span>
          ) : null}
        </div>
      </Link>
    </li>
  )
}

export function Sidebar(): ReactNode {
  const router = useRouter()
  const id = router.query.id as string

  return (
    <div className="hidden h-screen flex-col border-r-[1px] lg:flex">
      <div className="px-6 pt-5 text-3xl font-bold">
        <Logo isBlack />
      </div>
      <ul className="mx-4 flex flex-1 flex-col justify-start space-y-2 pt-10">
        {journeyNavigationItems.map((item, index) => {
          const href = item.href.replace('[id]', id)
          const isActive = router.pathname === item.href

          return (
            <SidebarItem
              isEnabled={item.isEnabled}
              key={`sidebar-item-${index}`}
              isActive={isActive}
              href={href}
              label={item.label}
              icon={item.icon}
            />
          )
        })}
      </ul>
      <ul className="mx-4 flex flex-1 flex-col justify-end space-y-2 pb-10">
        <SidebarItem
          href="/account"
          label="Account"
          icon={() => <PersonIcon />}
          isActive={router.pathname === '/account'}
          isEnabled
        />
        <Drawer.Trigger
          className="cursor-pointer rounded-md bg-accent px-4 py-2 text-center text-white"
          asChild
        >
          <li>Help Us Improve</li>
        </Drawer.Trigger>
      </ul>
    </div>
  )
}
