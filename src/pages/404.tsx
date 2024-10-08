import { PersonIcon } from '@radix-ui/react-icons'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { type ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import { Button } from '@/components/Button/Button'
import { Footer } from '@/components/Footer/Footer'

export default function Custom404(): ReactNode {
  const router = useRouter()

  return (
    <>
      <section className="pb-4">
        <div className="mx-auto flex max-w-screen-xl flex-col justify-start space-y-16 px-10 pt-10">
          <nav className="flex flex-row items-center justify-between px-10 md:space-y-0 xl:px-0">
            <Link href="/" className="text-3xl">
              Planner
              <span className="text-accent-dark">.so</span>
            </Link>
            <Button
              onClick={() => router.push('/welcome')}
              className="hidden lg:flex"
            >
              <FormattedMessage id="menuLogin" defaultMessage="Login" />
            </Button>
            <Button
              onClick={() => router.push('/account')}
              className="flex lg:hidden"
              icon={<PersonIcon />}
              ariaLabel="My account"
            />
          </nav>
        </div>
      </section>
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <Head>
          <title>Oops! Journey Delayed | Planner.so</title>
        </Head>
        <h1 className="mb-4 text-center text-4xl font-bold">
          <FormattedMessage
            id="components.error.title"
            defaultMessage="Oops! Your journey flight has been delayed"
          />
        </h1>
        <p className="mb-8 text-center text-xl">
          <FormattedMessage
            id="components.error.subtitle"
            defaultMessage="We are experiencing some turbulence on our end. Our team of expert
      digital pilots is working to get you back on course."
          />
        </p>

        <p className="mb-8 text-center text-lg">
          <FormattedMessage
            id="components.error.description"
            defaultMessage="We apologize for the inconvenience. We are working hard to get you back on course."
          />
        </p>

        <Button onClick={() => router.push('/')}>
          <FormattedMessage
            id="components.error.returnToHome"
            defaultMessage="Return to Home"
          />
        </Button>
      </div>
      <Footer />
    </>
  )
}
