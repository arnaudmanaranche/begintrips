import { LogInForm } from '@/components/LogInForm/LogInForm'
import { SignUpForm } from '@/components/SignUpForm/SignInForm'
import { createClient } from '@/libs/supabase/server-props'
import clsx from 'clsx'
import type { GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { Alata } from 'next/font/google'

const alata = Alata({ weight: '400', subsets: ['latin'] })

export default function WelcomePage() {
  const [form, setForm] = useState<'login' | 'signup'>('login')

  return (
    <main className="flex h-screen">
      <Head>
        <title>Planner.so | Welcome</title>
      </Head>
      <div className="flex-1 bg-white">
        <div className="relative mx-auto flex h-full flex-col items-center justify-center space-y-10">
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
          <h2 className="flex gap-2 text-4xl">
            {form === 'signup' ? 'Plan your next trip' : 'Welcome back'}
          </h2>
          {form === 'signup' ? <SignUpForm /> : <LogInForm />}
          <span className="flex gap-1 text-sm">
            {form === 'login' ? "Don't have an account ?" : 'Already member ?'}
            <button
              className="hover:underline"
              onClick={() => setForm(form === 'login' ? 'signup' : 'login')}
            >
              {form === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </span>
        </div>
      </div>
      <div className="hidden flex-1 bg-accent-light/20 lg:flex"></div>
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