import type { IconProps } from '@radix-ui/react-icons/dist/types'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { ForwardRefExoticComponent, RefAttributes } from 'react'
import { type ReactNode } from 'react'

import { jounryeNavigationItems } from '@/utils/navigationItems'

function SidebarItem({
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
          'flex w-full items-center space-x-2 px-6 py-4',
          isActive
            ? ' border-accent bg-accent-light/10 text-accent'
            : ' border-transparent text-black',
          !isEnabled
            ? 'pointer-events-none border-l-0 text-black/50'
            : 'border-l-4'
        )}
      >
        <Icon
          className={clsx(
            'h-5 w-5',
            isActive ? 'text-accent' : 'text-black',
            !isEnabled ? 'text-black/50' : ''
          )}
        />

        <div className="flex items-center space-x-2">
          <span>{label}</span>
          {!isEnabled ? (
            <span className="rounded-md bg-accent px-2 text-xs text-white">
              Soon
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
      <div className="px-6 pt-5 text-3xl">
        Planner
        <span className="text-accent">.so</span>
      </div>
      <ul className="flex flex-col justify-center pt-20">
        {jounryeNavigationItems.map((item) => {
          const href = item.href.replace('[id]', id)
          const Icon = item.icon
          const isActive = router.pathname === item.href

          return (
            <SidebarItem
              isEnabled={item.isEnabled}
              key={item.label}
              isActive={isActive}
              href={href}
              icon={Icon}
              label={item.label}
            />
          )
        })}
      </ul>
    </div>
  )
}
