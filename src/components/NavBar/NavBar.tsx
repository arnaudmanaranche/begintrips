import { PaperPlaneIcon, PersonIcon } from '@radix-ui/react-icons'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { type ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import { Logo } from '../Logo/Logo'

const navItems = [
  {
    id: 'myJourneys',
    name: 'My journeys',
    href: '/my-journeys',
    icon: PaperPlaneIcon,
  },
  { id: 'myAccount', name: 'My account', href: '/account', icon: PersonIcon },
]

export function NavBar(): ReactNode {
  const router = useRouter()

  return (
    <div className="mb-10 hidden bg-[#113B57] px-6 ring-1 ring-slate-200 lg:block">
      <nav className="mx-auto flex max-w-screen-xl items-center justify-between space-x-10">
        <Logo />
        <ul className="flex flex-1 items-center space-x-6 px-10 lg:px-0">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = item.href === router.pathname

            return (
              <li
                className={clsx(
                  'flex items-center border-b-2 px-2',
                  isActive ? 'border-white' : 'border-transparent'
                )}
                key={item.name}
              >
                <Link
                  href={item.href}
                  className="flex items-center space-x-2 py-6"
                >
                  <Icon className="h-6 w-6 text-white" />
                  <span className="text-white">
                    <FormattedMessage
                      id={item.id}
                      defaultMessage={`{name}`}
                      values={{
                        name: item.name,
                      }}
                    />
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
