import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

interface LogoProps {
  isBlack?: boolean
  href?: string
  size?: '40' | '60'
}

export function Logo({
  isBlack = false,
  href = '/',
  size = '60',
}: LogoProps): ReactNode {
  return (
    <Link href={href} className="flex items-center space-x-2">
      <Image src="/logo.svg" alt="Begintrips logo" width={size} height={size} />
      <span
        className={clsx('hidden font-medium sm:flex', {
          'text-black': isBlack,
          'text-white': !isBlack,
          'text-3xl': size === '60',
          'text-2xl': size === '40',
        })}
      >
        Begintrips
      </span>
    </Link>
  )
}
