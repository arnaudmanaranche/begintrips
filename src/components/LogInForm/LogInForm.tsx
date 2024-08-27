import { Button } from '@/components/Button/Button'
import { createClient } from '@/libs/supabase/client'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Callout } from '../Callout/Callout'
import { Input } from '../Input/Input'
import { useOnboardingStore } from '@/stores/onboarding.store'

export function LogInForm() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { journey } = useOnboardingStore()

  async function handleLogin(e: React.MouseEvent<HTMLButtonElement>) {
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

    if (journey.destination) {
      router.push('/onboarding?step=2')
      return
    }

    router.push('/account')
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
        <Button
          stretch
          onClick={async (e: React.MouseEvent<HTMLButtonElement>) =>
            await handleLogin(e)
          }
          isDisabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </motion.div>
  )
}
