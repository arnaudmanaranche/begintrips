import { CalloutInfo } from '@/components/Callout/Callout.Info'
import { LogInForm } from '@/components/LogInForm/LogInForm'
import { SignUpForm } from '@/components/SignUpForm/SignInForm'
import { createClient } from '@/libs/supabase/server-props'
import { useOnboardingStore } from '@/stores/onboarding.store'
import clsx from 'clsx'
import type { GetServerSidePropsContext } from 'next'
import { Alata } from 'next/font/google'
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

const alata = Alata({ weight: '400', subsets: ['latin'] })

export default function WelcomePage() {
  const [form, setForm] = useState<'login' | 'signup'>('signup')
  const { journey } = useOnboardingStore()

  return (
    <main className="relative flex h-screen">
      <Head>
        <title>Planner.so | Welcome</title>
      </Head>
      <Link
        href="/"
        className={clsx(
          alata.className,
          'absolute left-10 top-8 text-3xl font-bold'
        )}
      >
        Planner
        <span className="text-accent">.so</span>
      </Link>
      <div className="mx-auto flex max-w-4xl flex-grow px-10 md:px-0">
        <div className="flex-1 bg-white">
          <div className="relative mt-40 flex h-full w-full flex-col justify-center space-y-10 md:pt-0">
            <h2 className="flex text-4xl">
              {form === 'signup' ? 'Create your account' : 'Welcome back'}
            </h2>
            {journey.destination ? (
              <CalloutInfo>
                You can change your journey details later in your account.
              </CalloutInfo>
            ) : null}

            <div className="flex flex-col justify-between space-y-10 md:flex-row md:space-y-0">
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
                          {journey.departureDate}
                        </span>
                      </li>
                      <li className="flex flex-col space-y-1 text-base font-medium">
                        <span>Return date</span>
                        <span className="font-light">{journey.returnDate}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : null}
              <div className="flex flex-1 flex-col items-center justify-center space-y-4 pb-10 md:space-y-10 md:pb-0">
                {form === 'signup' ? <SignUpForm /> : <LogInForm />}
                <span className="flex gap-1 text-sm">
                  {form === 'login'
                    ? "Don't have an account ?"
                    : 'Already member ?'}
                  <button
                    className="hover:underline"
                    onClick={() =>
                      setForm(form === 'login' ? 'signup' : 'login')
                    }
                  >
                    {form === 'login' ? 'Sign up' : 'Log in'}
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
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
}
