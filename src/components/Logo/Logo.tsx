import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

interface LogoProps {
  isBlack?: boolean
  href?: string
}

export function Logo({ isBlack = false, href = '/' }: LogoProps): ReactNode {
  return (
    <Link href={href} className="flex items-center space-x-2">
      <Image src="/logo.svg" alt="Begintrips logo" width={60} height={60} />
      <span
        className={clsx('text-3xl font-bold', {
          'text-black': isBlack,
          'text-white': !isBlack,
        })}
      >
        Begintrips
      </span>
    </Link>
  )
}
