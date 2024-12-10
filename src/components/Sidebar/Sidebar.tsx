import { PersonIcon } from '@radix-ui/react-icons'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { type ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'
import { Drawer } from 'vaul'

import { useDrawerActions } from '@/providers/Drawer/Drawer.Provider'
import { journeyNavigationItems } from '@/utils/navigationItems'

import { Logo } from '../Logo/Logo'

function SidebarItem({
  href,
  icon,
  isActive,
  isEnabled,
  label,
}: {
  href: string
  icon: (props: { isActive: boolean; isMobile: boolean }) => ReactNode
  label: ReactNode
  isActive: boolean
  isEnabled: boolean
}): ReactNode {
  return (
    <li>
      <Link
        href={href}
        className={clsx(
          'group flex w-full items-center space-x-2 rounded-md px-4 py-2 hover:bg-gray-50 hover:text-[#151035]',
          isActive ? 'bg-gray-50 text-black' : 'text-white',
          !isEnabled ? 'pointer-events-none text-black/50' : ''
        )}
      >
        {icon({ isActive, isMobile: false })}
        <div className="flex items-center space-x-2">
          <span>{label}</span>
          {!isEnabled ? (
            <span className="bg-accent rounded-md px-2 text-xs text-white">
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
  const { setIsOpen, setCurrentType } = useDrawerActions()

  const id = router.query.id as string

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col bg-[#113B57] text-white lg:flex">
      <div>
        <div className="px-6 pt-5">
          <Logo href="/my-journeys" />
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
      </div>
      <ul className="mx-4 flex flex-1 flex-col justify-end space-y-2 pb-10">
        <SidebarItem
          href="/account"
          label={<FormattedMessage id="account" defaultMessage="Account" />}
          icon={() => <PersonIcon />}
          isActive={router.pathname === '/account'}
          isEnabled
        />
        <Drawer.Trigger
          className="cursor-pointer rounded-md bg-primary px-4 py-2 text-center text-white"
          asChild
          onClick={() => {
            setCurrentType('Feedback')
            setIsOpen(true)
          }}
        >
          <li>
            <FormattedMessage id="feedback" defaultMessage="Feedback" />
          </li>
        </Drawer.Trigger>
      </ul>
    </aside>
  )
}
