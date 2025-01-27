import clsx from 'clsx'
import type { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react'
import { useState } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode
  id: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  min?: string
  isDisabled?: boolean
}

export const Input = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  min,
  isDisabled,
}: InputProps): ReactNode => {
  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(value !== '')

  return (
    <div className="relative">
      <input
        type={type}
        id={id}
        value={value}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={isDisabled}
        onChange={onChange}
        min={min}
        className={clsx(
          'w-full rounded-lg border bg-white px-4 py-3 text-gray-700 transition-all duration-300 focus:outline-none',
          isDisabled
            ? 'cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:hover:border-gray-200'
            : 'focus:border-accent focus:ring-accent focus:ring focus:ring-opacity-40',
          isFocused || value ? 'border-accent' : 'border-gray-300'
        )}
        placeholder=" "
      />
      <label
        htmlFor={id}
        className={clsx(
          'pointer-events-none absolute left-3 transition-all duration-300',
          isDisabled && 'bg-gray-100 text-gray-400',
          isFocused || value || type === 'number'
            ? 'text-accent -top-2 bg-white px-1 text-xs'
            : 'top-3 text-gray-500'
        )}
      >
        {label}
      </label>
    </div>
  )
}
