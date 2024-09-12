import { GearIcon, PaperPlaneIcon } from '@radix-ui/react-icons'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { type ReactNode } from 'react'

const navItems = [
  { name: 'My journeys', href: '/my-journeys', icon: PaperPlaneIcon },
  { name: 'Settings', href: '/account', icon: GearIcon },
]

export function NavBar(): ReactNode {
  const router = useRouter()

  return (
    <div className="mb-10 hidden bg-white px-6 ring-1 ring-slate-200 lg:block">
      <nav className="mx-auto flex max-w-screen-xl items-center justify-between space-x-10">
        <Link href="/" className="text-3xl">
          Planner
          <span className="text-accent">.so</span>
        </Link>
        <ul className="flex flex-1 items-center space-x-6 px-10 lg:px-0">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = item.href === router.asPath

            return (
              <li
                className={clsx(
                  'flex items-center border-b-2 px-2 ',
                  isActive ? 'border-accent' : 'border-transparent'
                )}
                key={item.name}
              >
                <Link
                  href={item.href}
                  className="flex items-center space-x-2 py-6"
                >
                  <Icon
                    className={clsx(
                      'h-6 w-6',
                      isActive ? 'text-accent' : 'text-black'
                    )}
                  />
                  <span
                    className={clsx(isActive ? 'text-accent' : 'text-black')}
                  >
                    {item.name}
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
