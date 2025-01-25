import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

const links = [
  {
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
    label: 'myJourneys',
  },
  {
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
    label: 'account',
  },
]

export function AccountBottomBar(): ReactNode {
  const router = useRouter()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white drop-shadow-2xl lg:hidden">
      <ul className="flex h-16 items-center justify-around">
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
