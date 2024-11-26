import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import type { MouseEvent, ReactNode } from 'react'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { toast } from 'sonner'

import { Button } from '@/components/Button/Button'
import { createClient } from '@/libs/supabase/client'
import { EMAIL_TEMPLATES } from '@/utils/emails/get-template'

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

    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, template: EMAIL_TEMPLATES.WELCOME }),
      })

      router.push('/onboarding')
    } catch {
      // Send error to Sentry
      toast.error('Error sending welcome email')
      return
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full space-y-4"
    >
      {error ? (
        <div className="mb-8">
          <Callout.Danger>{error}</Callout.Danger>
        </div>
      ) : null}
      <form className="flex flex-col space-y-8">
        <div className="flex flex-col">
          <Input
            label={
              <FormattedMessage id="inputEmailLabel" defaultMessage="Email" />
            }
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <Input
            label={
              <FormattedMessage
                id="inputPasswordLabel"
                defaultMessage="Password"
              />
            }
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <Input
            label={
              <FormattedMessage
                id="inputConfirmPasswordLabel"
                defaultMessage="Confirm password"
              />
            }
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
          isDisabled={isLoading || !email || !password || !confirmPassword}
        >
          {isLoading ? (
            <FormattedMessage id="signingUp" defaultMessage="Signing up..." />
          ) : (
            <FormattedMessage id="signUp" defaultMessage="Sign up" />
          )}
        </Button>
      </form>
    </motion.div>
  )
}
