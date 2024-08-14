import { Button } from '@/components/Button/Button'
import { createClient } from '@/libs/supabase/client'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Callout } from '../Callout/Callout'

export function SignUpForm() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function signUp(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    setIsLoading(true)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError('Unable to sign up at the moment. Please try again later.')
      setIsLoading(false)
      return
    }

    router.push('/onboarding')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {error ? <Callout>{error}</Callout> : null}
      <form className="flex flex-col space-y-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            className="rounded-md border-2 border-gray-100 bg-slate-50 px-10 py-4 outline-none transition-all placeholder:text-black/50 focus:border-neutral-dark focus:outline-none"
            id="email"
            type="email"
            placeholder="name@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className="rounded-md border-2 border-gray-100 bg-slate-50 px-10 py-4 outline-none transition-all placeholder:text-black/50 focus:border-neutral-dark focus:outline-none"
            type="password"
            placeholder="•••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium" htmlFor="confirm-password">
            Confirm password
          </label>
          <input
            id="confirm-password"
            className="rounded-md border-2 border-gray-100 bg-slate-50 px-10 py-4 outline-none transition-all placeholder:text-black/50 focus:border-neutral-dark focus:outline-none"
            type="password"
            placeholder="•••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <Button
          stretch
          onClick={async (e: React.MouseEvent<HTMLButtonElement>) =>
            await signUp(e)
          }
          isDisabled={isLoading}
        >
          {isLoading ? 'Signing up...' : 'Sign up'}
        </Button>
      </form>
    </motion.div>
  )
}
