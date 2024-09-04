import { Button } from '@/components/Button/Button'
import { Callout } from '@/components/Callout/Callout'
import { Input } from '@/components/Input/Input'
import { createClient } from '@/libs/supabase/client'
import { useState } from 'react'

export interface ChangePasswordModalProps {
  onPasswordChangedCallback: () => void
}

export function ChangePasswordModalView({
  onPasswordChangedCallback,
}: ChangePasswordModalProps) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formError, setFormError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handleChangePassword = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault()
    setIsLoading(true)

    if (password !== confirmPassword) {
      setFormError('Passwords do not match')
      setIsLoading(false)
      return
    }

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setFormError('Unable to sign up at the moment. Please try again later.')
      setIsLoading(false)
      return
    }

    onPasswordChangedCallback()
  }

  return (
    <div className="mt-6 flex flex-col gap-6">
      {formError ? <Callout.Danger>{formError}</Callout.Danger> : null}
      <div className="flex flex-col gap-6">
        <Input
          label="Password"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          label="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          id="confirmPassword"
          type="password"
        />
      </div>
      <Button
        onClick={handleChangePassword}
        isDisabled={
          password !== confirmPassword ||
          isLoading ||
          !password ||
          !confirmPassword
        }
      >
        {isLoading ? 'Changing password...' : 'Change password'}
      </Button>
    </div>
  )
}
