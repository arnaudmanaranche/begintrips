import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import type { MouseEvent, ReactNode } from 'react'
import { useState } from 'react'

import { Button } from '@/components/Button/Button'
import { createClient } from '@/libs/supabase/client'

import { Callout } from '../Callout/Callout'
import { Input } from '../Input/Input'

const PASSWORD_MISSMATCH_ERROR_MESSAGE = 'Passwords do not match'
const SIGN_UP_ERROR_MESSAGE =
  'Unable to sign up at the moment. Please try again later.'

export function SignUpForm(): ReactNode {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSignUp(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    setIsLoading(true)

    if (password !== confirmPassword) {
      setError(PASSWORD_MISSMATCH_ERROR_MESSAGE)
      setIsLoading(false)
      return
    }

    const { data, error: userSignUpError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (userSignUpError) {
      setError(SIGN_UP_ERROR_MESSAGE)
      setIsLoading(false)
      return
    }

    const { error: userCreationError } = await supabase.from('users').insert({
      username: email,
      id: data.user?.id,
    })

    if (userCreationError) {
      setError(SIGN_UP_ERROR_MESSAGE)
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
      <form className="flex flex-col space-y-6">
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
          onClick={async (e: MouseEvent<HTMLButtonElement>) =>
            await handleSignUp(e)
          }
          isDisabled={isLoading || (!email && !password && !confirmPassword)}
        >
          {isLoading ? 'Signing up...' : 'Sign up'}
        </Button>
      </form>
    </motion.div>
  )
}
