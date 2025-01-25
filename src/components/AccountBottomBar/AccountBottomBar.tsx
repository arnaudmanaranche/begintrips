import { PaperPlaneIcon, PersonIcon } from '@radix-ui/react-icons'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

const links = [
  {
    href: '/my-journeys',
    icon: <PaperPlaneIcon className="h-6 w-6" />,
    label: 'myJourneys',
  },
  {
    href: '/account',
    icon: <PersonIcon className="h-6 w-6" />,
    label: 'myAccount',
  },
]

export function AccountBottomBar(): ReactNode {
  const router = useRouter()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white lg:hidden">
      <ul className="flex h-16 items-center justify-around ring-1 ring-slate-200">
        {links.map(({ href, icon, label }) => (
          <li className="flex items-center" key={href}>
            <Link
              href={href}
              className={clsx(
                'flex flex-col items-center gap-1 text-xs',
                router.asPath === href ? 'text-primary' : 'text-black'
              )}
            >
              {icon}
              <span>
                <FormattedMessage id={label} defaultMessage={label} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
