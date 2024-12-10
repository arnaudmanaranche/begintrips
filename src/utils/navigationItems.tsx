import type { ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

interface NavigationItem {
  href: string
  icon: ({
    isActive,
    isMobile,
  }: {
    isActive: boolean
    isMobile: boolean
  }) => ReactNode
  label: ReactNode
  isEnabled: boolean
}

export const journeyNavigationItems: NavigationItem[] = [
  {
    href: '/journey/[id]',
    icon: ({ isActive, isMobile }): ReactNode => (
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
          stroke={
            isActive
              ? '#151035'
              : !isMobile && !isActive
                ? '#FFFFFF'
                : '#151035'
          }
          className="group-hover:stroke-[#151035]"
          d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
        />
      </svg>
    ),
    label: <FormattedMessage id="myJourney" defaultMessage="My journey" />,
    isEnabled: true,
  },
  {
    href: '/journey/[id]/calendar',
    icon: ({ isActive, isMobile }): ReactNode => (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 1C8.55228 1 9 1.44772 9 2V3.03923C9.8048 2.99996 10.7588 2.99998 11.916 3H12.084C13.2412 2.99998 14.1952 2.99996 15 3.03923V2C15 1.44772 15.4477 1 16 1C16.5523 1 17 1.44772 17 2V3.30517C17.2333 3.3668 17.4586 3.44164 17.6788 3.53284C19.394 4.2433 20.7567 5.60602 21.4672 7.32122C21.6812 7.8379 21.8059 8.38545 21.8805 9L2.11952 9C2.19414 8.38545 2.31883 7.8379 2.53284 7.32122C3.2433 5.60602 4.60602 4.2433 6.32122 3.53284C6.5414 3.44164 6.76667 3.3668 7 3.30517V2C7 1.44772 7.44772 1 8 1Z"
          stroke={
            isActive
              ? '#151035'
              : !isMobile && !isActive
                ? '#FFFFFF'
                : '#151035'
          }
          className="group-hover:stroke-[#151035]"
        />
        <path
          d="M2.00919 11C2 11.5811 2 12.2348 2 12.974V13.0368C2 14.4035 1.99999 15.4801 2.05941 16.351C2.11997 17.2387 2.2456 17.9853 2.53284 18.6788C3.2433 20.394 4.60602 21.7567 6.32122 22.4672C7.01469 22.7544 7.76134 22.88 8.649 22.9406C9.51986 23 10.5965 23 11.9631 23H12.0369C13.4035 23 14.4801 23 15.351 22.9406C16.2387 22.88 16.9853 22.7544 17.6788 22.4672C19.394 21.7567 20.7567 20.394 21.4672 18.6788C21.7544 17.9853 21.88 17.2387 21.9406 16.351C22 15.4801 22 14.4035 22 13.0369V12.9741C22 12.2348 22 11.5811 21.9908 11L2.00919 11Z"
          stroke={
            isActive
              ? '#151035'
              : !isMobile && !isActive
                ? '#FFFFFF'
                : '#151035'
          }
          className="group-hover:stroke-[#151035]"
        />
      </svg>
    ),
    label: <FormattedMessage id="calendar" defaultMessage="Calendar" />,
    isEnabled: true,
  },
  {
    href: '/journey/[id]/categories',
    icon: ({ isActive, isMobile }): ReactNode => (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.8004 0.999912C10.1314 0.999469 9.05199 0.999182 8.14584 1.29361C6.31922 1.88711 4.88711 3.31922 4.29361 5.14584C3.99918 6.05199 3.99947 7.13137 3.99991 8.80038L3.99995 21.9999C3.99995 22.3905 4.22729 22.7453 4.58209 22.9085C4.93689 23.0716 5.35423 23.0134 5.65074 22.7592L7.44441 21.2218C8.37984 20.42 9.03958 19.8554 9.5933 19.4494C10.1369 19.0508 10.5195 18.8503 10.8813 18.745C11.6119 18.5321 12.388 18.5321 13.1186 18.745C13.4804 18.8503 13.863 19.0508 14.4066 19.4494C14.9603 19.8554 15.6201 20.42 16.5555 21.2218L18.3492 22.7592C18.6457 23.0134 19.063 23.0716 19.4178 22.9085C19.7726 22.7453 19.9999 22.3905 19.9999 21.9999L20 8.80038C20.0004 7.13138 20.0007 6.05199 19.7063 5.14584C19.1128 3.31922 17.6807 1.88711 15.854 1.29361C14.9479 0.999182 13.8685 0.999469 12.1995 0.999912H11.8004Z"
          fill="transparent"
          stroke={
            isActive ? '#151035' : !isMobile && !isActive ? '#FFF' : '#151035'
          }
          strokeWidth="1"
          className="group-hover:stroke-[#151035]"
        />
      </svg>
    ),
    label: <FormattedMessage id="categories" defaultMessage="Categories" />,
    isEnabled: true,
  },
]
