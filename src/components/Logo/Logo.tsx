import clsx from 'clsx'
import Link from 'next/link'
import type { ReactNode } from 'react'

interface LogoProps {
  isBlack?: boolean
} 

export function Logo({ isBlack =true }: LogoProps): ReactNode {
  return (
    <Link href="/" className={
      clsx("text-4xl font-bold", {
        'text-black': isBlack,
        'text-white': !isBlack,
      })
    }>
      Begin
      <span className="text-accent">trips</span>
    </Link>
  )
}
