import { useRouter } from 'next/router'
import type { ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import { Button } from '../Button/Button'

export const PromotionSection = (): ReactNode => {
  const router = useRouter()

  return (
    <div className="my-10 flex flex-col items-center space-y-10 rounded-md bg-accent-light/40 p-6">
      <div className="flex flex-col items-center space-y-4 text-3xl">
        <p>
          <FormattedMessage
            id="promotionSection.title"
            defaultMessage="Take the Stress Out of Travel"
          />
        </p>
        <p>
          <FormattedMessage
            id="promotionSection.subtitle"
            defaultMessage="Simplify your Journey with Begintrips"
          />
        </p>
      </div>
      <Button
        onClick={() => {
          router.push('/welcome')
        }}
      >
        <FormattedMessage
          id="signUpForFree"
          defaultMessage="Sign up for free"
        />
      </Button>
    </div>
  )
}
