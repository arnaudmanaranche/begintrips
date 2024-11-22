import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'

import { Callout } from '@/components/Callout/Callout'
import { LogInForm } from '@/components/LogInForm/LogInForm'
import { Logo } from '@/components/Logo/Logo'
import { SignUpForm } from '@/components/SignUpForm/SignUpForm'
import { createClient } from '@/libs/supabase/server-props'
import { useOnboardingStore } from '@/stores/onboarding.store'
import { formatDate } from '@/utils/date'
import { SITE_URL } from '@/utils/seo'

const messages = defineMessages({
  titleLogin: {
    id: 'welcome.title',
    defaultMessage: 'Welcome to Begintrips',
  },
  titleSignUp: {
    id: 'welcome.signUp',
    defaultMessage: 'Create your account',
  },
  metaDescription: {
    id: 'welcome.metaDescription',
    defaultMessage:
      'Plan your journey with Begintrips - your ultimate travel companion',
  },
})

export default function WelcomePage(): ReactNode {
  const [form, setForm] = useState<'login' | 'signup'>('login')
  const { journey } = useOnboardingStore()
  const router = useRouter()
  const intl = useIntl()

  return (
    <main>
      <Head>
        <title>
          {form === 'login'
            ? intl.formatMessage(messages.titleLogin)
            : intl.formatMessage(messages.titleSignUp)}
        </title>
        <meta
          name="title"
          content={
            form === 'login'
              ? intl.formatMessage(messages.titleLogin)
              : intl.formatMessage(messages.titleSignUp)
          }
        />
        <meta
          name="description"
          content={intl.formatMessage(messages.metaDescription)}
        />
        <meta property="og:url" content={`${SITE_URL}/welcome`} />
        <meta
          property="og:title"
          content={
            form === 'login'
              ? intl.formatMessage(messages.titleLogin)
              : intl.formatMessage(messages.titleSignUp)
          }
        />
        <meta
          property="og:description"
          content={intl.formatMessage(messages.metaDescription)}
        />
        <meta
          property="twitter:title"
          content={
            form === 'login'
              ? intl.formatMessage(messages.titleLogin)
              : intl.formatMessage(messages.titleSignUp)
          }
        />
        <meta property="twitter:url" content={`${SITE_URL}/welcome`} />
        <meta
          property="twitter:description"
          content={intl.formatMessage(messages.metaDescription)}
        />
      </Head>
      <div className="mx-auto flex max-w-screen-xl px-10 pt-10 xl:px-0">
        <Logo />
      </div>
      <div className="mx-auto flex h-screen max-w-4xl flex-grow px-10 xl:px-0">
        <div className="flex-1 bg-white">
          <div className="relative flex h-full w-full flex-col justify-center space-y-10 md:pt-0">
            <h2 className="flex text-4xl">
              {form === 'signup' ? (
                <FormattedMessage
                  id="welcomeCreateAccount"
                  defaultMessage="Create your account"
                />
              ) : (
                <FormattedMessage
                  id="welcomeWelcomeBack"
                  defaultMessage="Welcome back"
                />
              )}
            </h2>
            {journey.destination ? (
              <Callout.Info>
                You can change your journey details later in your account.
              </Callout.Info>
            ) : null}
            <div className="flex flex-col justify-between space-y-10 md:space-y-0 lg:flex-row">
              {journey.destination ? (
                <div className="flex flex-1 flex-col space-y-8">
                  <div className="flex flex-col justify-center space-y-4">
                    <h2 className="text-2xl">Recap your journey</h2>
                    <ul className="flex flex-col space-y-4">
                      <li className="flex flex-col space-y-1 text-base font-medium">
                        <span>Destination</span>
                        <span className="font-light">
                          {journey.destination}
                        </span>
                      </li>
                      <li className="flex flex-col space-y-1 text-base font-medium">
                        <span>Departure date</span>
                        <span className="font-light">
                          {formatDate(
                            journey.departureDate,
                            'EEEE - dd MMMM yyyy',
                            true,
                            router.locale
                          )}
                        </span>
                      </li>
                      <li className="flex flex-col space-y-1 text-base font-medium">
                        <span>Return date</span>
                        <span className="font-light">
                          {formatDate(
                            journey.returnDate,
                            'EEEE - dd MMMM yyyy',
                            true,
                            router.locale
                          )}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : null}
              <div className="flex flex-1 flex-col items-center justify-center space-y-4 pb-10 md:space-y-10 md:pb-0">
                {form === 'signup' ? <SignUpForm /> : <LogInForm />}
                <span className="flex gap-1 text-sm">
                  {form === 'login' ? (
                    <FormattedMessage
                      id="welcomeDontHaveAccount"
                      defaultMessage="Don't have an account?"
                    />
                  ) : (
                    <FormattedMessage
                      id="welcomeAlreadyMember"
                      defaultMessage="Already a member?"
                    />
                  )}
                  <button
                    className="hover:underline"
                    onClick={() =>
                      setForm(form === 'login' ? 'signup' : 'login')
                    }
                  >
                    {form === 'login' ? (
                      <FormattedMessage id="signUp" defaultMessage="Sign up" />
                    ) : (
                      <FormattedMessage id="login" defaultMessage="Log in" />
                    )}
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export const getServerSideProps = (async (context) => {
  const supabase = createClient(context)
  const { data } = await supabase.auth.getUser()

  if (data.user) {
    return {
      redirect: {
        destination: '/account',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}) satisfies GetServerSideProps
