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
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        height="15"
        width="15"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
        />
      </svg>
    ),
  },
  {
    id: 'account',
    name: 'My account',
    href: '/account',
    icon: (
      <svg
        height="15"
        width="15"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
      >
        <path d="M12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2Z" />
        <path d="M8 14C5.23858 14 3 16.2386 3 19C3 20.6569 4.34315 22 6 22H18C19.6569 22 21 20.6569 21 19C21 16.2386 18.7614 14 16 14H8Z" />
      </svg>
    ),
  },
]

export function NavBar(): ReactNode {
  const router = useRouter()

  return (
    <div className="mb-10 hidden bg-[#113B57] px-6 ring-1 ring-slate-200 lg:block">
      <nav className="mx-auto flex max-w-screen-xl items-center justify-between space-x-10">
        <Logo size="40" />
        <ul className="flex flex-1 items-center space-x-6 px-10 lg:px-0">
          {navItems.map((item) => {
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
                  className="flex items-center space-x-2 py-6 text-white"
                >
                  {item.icon}
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
