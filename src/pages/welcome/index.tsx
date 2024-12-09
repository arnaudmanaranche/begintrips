import { CalendarIcon, GlobeIcon } from '@radix-ui/react-icons'
import { motion } from 'framer-motion'
import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'

import { LogInForm } from '@/components/LogInForm/LogInForm'
import { Logo } from '@/components/Logo/Logo'
import { SignUpForm } from '@/components/SignUpForm/SignUpForm'
import { createClient } from '@/libs/supabase/server-props'
import { useOnboardingStore } from '@/stores/onboarding.store'
import { formatDate } from '@/utils/date'
import { useMainFeatures } from '@/utils/homepage'
import { SITE_URL } from '@/utils/seo'

const messages = defineMessages({
  // Metadata
  pageMetaTitle: {
    id: 'page.welcome.meta.title',
    defaultMessage: 'Welcome to Begintrips',
  },
  pageMetaDescription: {
    id: 'page.welcome.meta.description',
    defaultMessage:
      'Plan your journey with Begintrips - your ultimate travel companion',
  },
  // Page content
  pageSignUpTitle: {
    id: 'page.welcome.title.signup',
    defaultMessage: 'Create your account',
  },
  pageLoginTitle: {
    id: 'page.welcome.title.login',
    defaultMessage: 'Welcome back',
  },
  pageSignUpSubtitle: {
    id: 'page.welcome.subtitle.signup',
    defaultMessage: 'Join Begintrips to start planning your next adventure',
  },
  pageLoginSubtitle: {
    id: 'page.welcome.subtitle.login',
    defaultMessage: 'Sign in to continue your journey',
  },
  noAccount: {
    id: 'page.welcome.noAccount',
    defaultMessage: "Don't have an account ?",
  },
  signUp: {
    id: 'page.welcome.form.signup.cta',
    defaultMessage: 'Sign up',
  },
  alreadyHaveAccount: {
    id: 'page.welcome.alreadyHaveAccount',
    defaultMessage: 'Already have an account ?',
  },
  signIn: {
    id: 'page.welcome.form.login.cta',
    defaultMessage: 'Sign in',
  },
  welcomeJourneyDetails: {
    id: 'page.welcome.welcomeJourneyDetails',
    defaultMessage: 'Welcome to your new trip',
  },
  welcomeWhyChooseBeginTrips: {
    id: 'page.welcome.welcomeWhyChooseBeginTrips',
    defaultMessage: 'Why choose BeginTrips?',
  },
})

export default function WelcomePage(): ReactNode {
  const [form, setForm] = useState<'login' | 'signup'>('login')
  const { journey } = useOnboardingStore()
  const features = useMainFeatures()
  const router = useRouter()
  const intl = useIntl()

  return (
    <main className="min-h-screen bg-[#113B57]">
      <Head>
        <title>{intl.formatMessage(messages.pageMetaTitle)}</title>
        <meta
          name="title"
          content={intl.formatMessage(messages.pageMetaTitle)}
        />
        <meta
          name="description"
          content={intl.formatMessage(messages.pageMetaDescription)}
        />
        <meta property="og:url" content={`${SITE_URL}/welcome`} />
        <meta
          property="og:title"
          content={intl.formatMessage(messages.pageMetaTitle)}
        />
        <meta
          property="og:description"
          content={intl.formatMessage(messages.pageMetaDescription)}
        />
        <meta
          name="twitter:title"
          content={intl.formatMessage(messages.pageMetaTitle)}
        />
        <meta name="twitter:url" content={`${SITE_URL}/welcome`} />
        <meta
          name="twitter:description"
          content={intl.formatMessage(messages.pageMetaDescription)}
        />
      </Head>
      <div className="absolute left-0 right-0 top-0 mx-auto flex max-w-screen-xl px-6 pt-10 xl:px-8">
        <Logo />
      </div>
      <div className="flex min-h-screen w-full">
        <div className="flex w-full flex-col lg:flex-row">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden flex-[0.8] flex-col items-center justify-center bg-accent/5 px-6 py-32 lg:flex lg:px-16"
          >
            <div className="w-full max-w-lg">
              <h1 className="mb-8 text-2xl font-semibold text-white">
                {journey.destination
                  ? intl.formatMessage(messages.welcomeJourneyDetails)
                  : intl.formatMessage(messages.welcomeWhyChooseBeginTrips)}
              </h1>
              {journey.destination.name ? (
                <div className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-900/5">
                  <div className="space-y-6">
                    <div className="flex items-start gap-3">
                      <GlobeIcon className="mt-1 h-5 w-5 text-accent" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          <FormattedMessage
                            id="welcomeDestination"
                            defaultMessage="Destination"
                          />
                        </p>
                        <p className="mt-1 text-base text-black">
                          {journey.destination.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CalendarIcon className="mt-1 h-5 w-5 text-accent" />
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            <FormattedMessage
                              id="departureDateLabel"
                              defaultMessage="Departure date"
                            />
                          </p>
                          <p className="mt-1 text-base text-black">
                            {formatDate(
                              journey.departureDate,
                              'EEEE, dd MMMM yyyy',
                              true,
                              router.locale
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            <FormattedMessage
                              id="endDate"
                              defaultMessage="Return date"
                            />
                          </p>
                          <p className="mt-1 text-base text-black">
                            {formatDate(
                              journey.returnDate,
                              'EEEE, dd MMMM yyyy',
                              true,
                              router.locale
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="mt-6 text-sm text-gray-500">
                    <FormattedMessage
                      id="welcomeChangeDetailsLater"
                      defaultMessage="You can change these details later in your journey settings."
                    />
                  </p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                      className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5"
                    >
                      <h3 className="text-lg font-semibold text-black">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-gray-800">
                        {feature.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-[1.2] flex-col items-center justify-center bg-[#ffffff] px-6 py-32 lg:px-16"
          >
            <div className="w-full max-w-md">
              <div className="mb-8 text-center">
                <h1 className="text-4xl font-semibold text-black">
                  {form === 'signup'
                    ? intl.formatMessage(messages.pageSignUpTitle)
                    : intl.formatMessage(messages.pageLoginTitle)}
                </h1>
                <p className="mt-3 text-lg text-gray-600">
                  {form === 'signup'
                    ? intl.formatMessage(messages.pageSignUpSubtitle)
                    : intl.formatMessage(messages.pageLoginSubtitle)}
                </p>
              </div>
              <div className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-900/5">
                {form === 'signup' ? <SignUpForm /> : <LogInForm />}
                <div className="mt-4 text-center text-sm text-gray-600">
                  {form === 'login' ? (
                    <>
                      {intl.formatMessage(messages.noAccount)}{' '}
                      <button
                        type="button"
                        className="font-medium text-accent hover:text-accent/80"
                        onClick={() => setForm('signup')}
                      >
                        {intl.formatMessage(messages.signUp)}
                      </button>
                    </>
                  ) : (
                    <>
                      {intl.formatMessage(messages.alreadyHaveAccount)}{' '}
                      <button
                        type="button"
                        className="font-medium text-accent hover:text-accent/80"
                        onClick={() => setForm('login')}
                      >
                        {intl.formatMessage(messages.signIn)}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
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
