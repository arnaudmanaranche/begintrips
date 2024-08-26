import { useState } from 'react'

export interface InputProps {
  label: string
  id: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  min?: string
}

export const Input = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  min,
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(value !== '')

  return (
    <div className="relative mb-6">
      <input
        type={type}
        id={id}
        value={value}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={onChange}
        min={min}
        placeholder=" " // Keeps the placeholder space for the label
        className="duration-400 w-full rounded-md border border-gray-100 bg-slate-50 px-4 py-3 transition-all ease-in-out focus:border-neutral-dark focus:outline-none"
      />
      <label
        htmlFor={id}
        className={`duration-400 absolute left-4 top-1/2 -translate-y-1/2 transform px-1 text-sm transition-all ease-in-out
        ${isFocused || value ? 'left-3 top-[-0.75rem] text-xs text-accent' : 'text-black/50'}`}
      >
        {label}
      </label>
    </div>
  )
}
