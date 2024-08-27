import { Button } from '@/components/Button/Button'
import { createClient } from '@/libs/supabase/client'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Callout } from '../Callout/Callout'
import { Input } from '../Input/Input'

export function SignUpForm() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSignUp(e: React.MouseEvent<HTMLButtonElement>) {
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
      className="w-full space-y-4"
    >
      {error ? <Callout.Danger>{error}</Callout.Danger> : null}
      <form className="flex flex-col space-y-4">
        <div className="flex flex-col">
          <Input
            label="Email"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <Input
            label="Password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <Input
            label="Confirm password"
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <Button
          stretch
          onClick={async (e: React.MouseEvent<HTMLButtonElement>) =>
            await handleSignUp(e)
          }
          isDisabled={isLoading}
        >
          {isLoading ? 'Signing up...' : 'Sign up'}
        </Button>
      </form>
    </motion.div>
  )
}
