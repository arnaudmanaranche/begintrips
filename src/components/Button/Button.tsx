import type { ReactNode } from 'react'
import clsx from 'clsx'

export interface ButtonProps {
  children: ReactNode
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
  isDisabled?: boolean
  variant?: 'primary' | 'ghost'
  stretch?: boolean
}

export function Button({
  children,
  onClick,
  className,
  isDisabled,
  variant = 'primary',
  stretch = false,
}: ButtonProps) {
  const variantClasses = {
    primary: clsx(
      'bg-accent text-white hover:bg-accent-dark',
      isDisabled &&
        'cursor-not-allowed bg-gray-400/30 text-black/60 disabled:hover:bg-gray-400/30'
    ),
    ghost: clsx(
      'bg-transparent text-accent border border-accent hover:bg-accent-dark hover:text-white',
      isDisabled &&
        'cursor-not-allowed bg-gray-400/30 text-black/60 disabled:hover:bg-transparent border-gray-400/30 disabled:hover:text-black/60'
    ),
  }

  return (
    <button
      className={clsx(
        'rounded-md px-10 py-3 outline-none transition-colors',
        variantClasses[variant],
        className,
        stretch && 'w-full'
      )}
      onClick={onClick}
      disabled={isDisabled}
    >
      {children}
    </button>
  )
}
