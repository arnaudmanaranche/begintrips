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
        ? 'cursor-not-allowed bg-gray-400/50 disabled:hover:bg-gray-400/50 text-gray-500'
        : 'bg-primary hover:bg-primary-dark text-white'
    ),
    ghost: clsx(
      isDisabled
        ? 'cursor-not-allowed bg-gray-400/30 disabled:hover:bg-transparent border-gray-400/30 disabled:hover:text-white'
        : 'bg-transparent text-primary border border-primary hover:bg-primary-dark hover:text-white'
    ),
  }

  if (icon && !children) {
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
        'flex items-center gap-2 outline-none transition-colors',
        variantClasses[variant],
        className,
        stretch && 'w-full',
        isRounded ? 'h-12 w-12 rounded-full' : 'rounded-md px-10 py-3'
      )}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={ariaLabel}
    >
      {icon}
      {children}
    </button>
  )
}
