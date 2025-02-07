import { useRouter } from 'next/router'
import type { ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import { Button } from '../Button/Button'

export function CallToAction(): ReactNode {
  const router = useRouter()

  return (
    <section className="mx-auto max-w-screen-xl px-6 md:px-10">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-primary/80 px-6 py-20 text-center text-white md:px-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-4 -top-4 h-32 w-32 rotate-45 rounded-xl bg-white" />
          <div className="absolute -bottom-4 -right-4 h-32 w-32 rotate-45 rounded-xl bg-white" />
        </div>
        <div className="relative flex flex-col items-center">
          <h2 className="mb-6 text-4xl font-bold md:text-5xl">
            <FormattedMessage
              id="readyToStart"
              defaultMessage="Ready to start your journey?"
            />
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">
            <FormattedMessage
              id="readyToStartSubtitle"
              defaultMessage="Join thousands of travelers who trust BeginTrips to create their perfect journey. Start planning your next adventure today!"
            />
          </p>
          <Button
            onClick={() => router.push('/welcome')}
            className="bg-white text-black"
            variant="ghost"
          >
            <FormattedMessage
              id="getStartedForFree"
              defaultMessage="Get Started for Free"
            />
          </Button>
        </div>
      </div>
    </section>
  )
}
