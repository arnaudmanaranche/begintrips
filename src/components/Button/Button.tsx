import clsx from 'clsx'
import type { ReactNode } from 'react'

interface ButtonProps {
  children?: ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick: (...args: any[]) => void
  className?: string
  isDisabled?: boolean
  variant?: 'primary' | 'ghost'
  stretch?: boolean
  isRounded?: boolean
  icon?: ReactNode
  ariaLabel?: string
}

export function Button({
  children,
  onClick,
  className,
  isDisabled,
  variant = 'primary',
  stretch = false,
  isRounded = false,
  icon,
  ariaLabel,
}: ButtonProps): ReactNode {
  const variantClasses = {
    primary: clsx(
      isDisabled
        ? 'cursor-not-allowed bg-gray-400/50 disabled:hover:bg-gray-400/50'
        : 'bg-accent hover:bg-accent-dark text-white'
    ),
    ghost: clsx(
      isDisabled
        ? 'cursor-not-allowed bg-gray-400/30 disabled:hover:bg-transparent border-gray-400/30 disabled:hover:text-white'
        : 'bg-transparent text-accent border border-accent hover:bg-accent-dark hover:text-white'
    ),
  }

  if (icon) {
    return (
      <button
        className={clsx(
          'flex h-12 w-12 items-center justify-center rounded-full outline-none transition-colors',
          variantClasses[variant],
          className,
          stretch && 'w-full'
        )}
        onClick={onClick}
        disabled={isDisabled}
        aria-label={ariaLabel}
      >
        {icon}
      </button>
    )
  }

  return (
    <button
      className={clsx(
        'outline-none transition-colors',
        variantClasses[variant],
        className,
        stretch && 'w-full',
        isRounded ? 'h-12 w-12 rounded-full' : 'rounded-md px-10 py-3'
      )}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}
