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
        placeholder=" " // Keeps the placeholder space for the label
        className="duration-400 w-full rounded-md border border-gray-100 bg-slate-50 px-4 py-3 transition-all ease-in-out focus:border-neutral-dark focus:outline-none disabled:bg-gray-300 disabled:text-gray-500"
      />
      <label
        htmlFor={id}
        className={clsx(
          'duration-400 absolute left-3 top-1/2 -translate-y-1/2 transform px-1 text-sm transition-all ease-in-out',
          isFocused || value || value === 0
            ? 'left-3 top-[-0.75rem] text-sm text-accent'
            : 'text-black/50'
        )}
      >
        {label}
      </label>
    </div>
  )
}
