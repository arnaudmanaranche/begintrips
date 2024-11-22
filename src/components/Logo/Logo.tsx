import Link from 'next/link'
import type { ReactNode } from 'react'

export function Logo(): ReactNode {
  return (
    <Link href="/" className="text-3xl font-bold">
      Begin
      <span className="font-normal text-accent-dark">trips</span>
    </Link>
  )
}
