import * as m from 'motion/react-m'
import { useRouter } from 'next/router'
import type { MouseEvent, ReactNode } from 'react'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { Button } from '@/components/Button/Button'
import { createClient } from '@/libs/supabase/client'
import { useOnboardingStore } from '@/stores/onboarding.store'

import { Callout } from '../Callout/Callout'
import { Input } from '../Input/Input'

export function LogInForm(): ReactNode {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { journey } = useOnboardingStore()

  async function handleLogin(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    setIsLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('Invalid email or password')
      setIsLoading(false)
      return
    }

    if (journey.destination.name) {
      router.push('/onboarding?step=2')
      return
    }

    router.push('/account')
  }

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full space-y-4"
    >
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
            onChange={(e) => {
              setPassword(e.target.value)
              setError('')
            }}
          />
        </div>
        {error ? <Callout.Danger>{error}</Callout.Danger> : null}
        <Button
          stretch
          onClick={async (e: MouseEvent<HTMLButtonElement>) =>
            await handleLogin(e)
          }
          isDisabled={isLoading || !email || !password || error !== ''}
        >
          {isLoading ? (
            <FormattedMessage id="logginInCta" defaultMessage="Logging in..." />
          ) : (
            <FormattedMessage id="loginCta" defaultMessage="Log in" />
          )}
        </Button>
      </form>
    </m.div>
  )
}
