import * as Dialog from '@radix-ui/react-dialog'
import { ChevronRightIcon, Cross2Icon } from '@radix-ui/react-icons'
import { loadStripe } from '@stripe/stripe-js'
import Avatar from 'boring-avatars'
import type { GetServerSideProps } from 'next'
import { Open_Sans, Outfit } from 'next/font/google'
import Head from 'next/head'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'
import { toast } from 'sonner'

import { checkoutSession } from '@/api/calls/stripe'
import { AccountBottomBar } from '@/components/AccountBottomBar/AccountBottomBar'
import { AccountHeader } from '@/components/AccountHeader/AccountHeader'
import { CurrentPlan } from '@/components/CurrentPlan/CurrentPlan'
import { PaymentModalView } from '@/components/modals/Billing/Billing'
import { ChangePasswordModalView } from '@/components/modals/ChangePassword/ChangePassword'
import { NavBar } from '@/components/NavBar/NavBar'
import { createClient } from '@/libs/supabase/client'
import { createClient as createClientServerProps } from '@/libs/supabase/server-props'
import { useOnboardingStore } from '@/stores/onboarding.store'
import type { User } from '@/types'
import { PLANS } from '@/utils/product-plans'
import { SITE_URL } from '@/utils/seo'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

export interface AccountPageProps {
  user: User
}

const messages = defineMessages({
  title: {
    id: 'accountPagetitle',
    defaultMessage: 'Begintrips | Account',
  },
  metaDescription: {
    id: 'accountPageDescription',
    defaultMessage: 'Manage your account',
  },
})

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-outfit',
  display: 'optional',
})

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-open-sans',
  display: 'optional',
})

function FormattedTitle({ modalType }: { modalType: string | null }) {
  switch (modalType) {
    case 'Change password':
      return (
        <FormattedMessage
          id="changeMyPassword"
          defaultMessage="Change my password"
        />
      )
    case 'Payments':
      return <FormattedMessage id="payments" defaultMessage="Payments" />
    default:
      return <FormattedMessage id="account" defaultMessage="Account" />
  }
}

export default function AccountPage({ user }: AccountPageProps): ReactNode {
  const intl = useIntl()
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const { resetJourney } = useOnboardingStore()
  const [open, setOpen] = useState(false)
  const [currency, setCurrency] = useState<string | null>(null)
  const [modalType, setModalType] = useState<
    'Change password' | 'Payments' | null
  >(null)

  useEffect(() => {
    const search = searchParams.get('payment_status')

    if (search === 'declined') {
      toast.error(
        <FormattedMessage
          id="paymentDeclined"
          defaultMessage="Your payment has been declined"
        />
      )
    } else if (search === 'succeeded') {
      toast.success(
        <FormattedMessage
          id="paymentSuccessful"
          defaultMessage="Payment successful. New credits added!"
        />
      )
    }
  }, [searchParams])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    resetJourney()
    router.push('/')
  }

  const handleOnCheckout = async () => {
    setIsLoading(true)
    const stripe = await stripePromise

    if (!stripe) return

    try {
      const session = await checkoutSession({
        externalProductId: PLANS['PLANS.PLAN2.TITLE'].externalProductId,
        mode: PLANS['PLANS.PLAN2.TITLE'].mode,
        internalProductId: PLANS['PLANS.PLAN2.TITLE'].internalProductId,
        email: user.email,
      })

      await stripe.redirectToCheckout({
        sessionId: session.id,
      })
    } catch {
      toast.error(
        <FormattedMessage
          id="paymentError"
          defaultMessage="An error occurred while creating the checkout session"
        />
      )
      return
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setCurrency(localStorage.getItem('currency'))
  }, [])

  return (
    <Dialog.Root
      open={open}
      onOpenChange={() => {
        if (!open) {
          setOpen(true)
        } else {
          setModalType(null)
          setOpen(false)
        }
      }}
    >
      <Head>
        <title>{intl.formatMessage(messages.title)}</title>
        <meta name="title" content={intl.formatMessage(messages.title)} />
        <meta
          name="description"
          content={intl.formatMessage(messages.metaDescription)}
        />
        <meta property="og:url" content={`${SITE_URL}/account`} />
        <meta
          property="og:title"
          content={intl.formatMessage(messages.title)}
        />
        <meta
          property="og:description"
          content={intl.formatMessage(messages.metaDescription)}
        />
        <meta
          name="twitter:title"
          content={intl.formatMessage(messages.title)}
        />
        <meta name="twitter:url" content={`${SITE_URL}/account`} />
        <meta
          name="twitter:description"
          content={intl.formatMessage(messages.metaDescription)}
        />
      </Head>
      <div className="relative min-h-screen flex-1 bg-[#faf9f8]">
        <NavBar />
        <AccountHeader />
        <div className="mx-auto flex max-w-screen-sm flex-1 flex-col justify-center gap-10 px-10 pt-10 lg:px-0 lg:pt-0">
          <div className="flex flex-col items-center space-y-2">
            <Avatar
              name={user.email}
              size={70}
              colors={['#fb6900', '#E57C59', '#9d6969', '#59c2c4', '#304141']}
            />
            <span className="text-black">{user.email}</span>
          </div>
          <div className="space-y-4">
            <p className="font-medium text-black">
              <FormattedMessage
                id="accountDetails"
                defaultMessage="Account details"
              />
            </p>
            <CurrentPlan
              credits={user.credits}
              isLoading={isLoading}
              onCheckout={handleOnCheckout}
            />
            <div className="flex cursor-pointer items-center justify-between rounded-md bg-white p-4 ring-1 ring-slate-200">
              <label className="text-black" htmlFor="currency">
                <FormattedMessage
                  id="baseCurrency"
                  defaultMessage="Base currency"
                />
              </label>
              <div className="grid">
                <select
                  className="col-start-1 row-start-1 w-14 appearance-none bg-transparent text-black"
                  name="currency"
                  id="currency"
                  defaultValue={currency ?? 'EUR'}
                  onChange={(e) => {
                    localStorage.setItem('currency', e.target.value)
                  }}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
                <svg
                  className="pointer-events-none relative right-1 col-start-1 row-start-1 h-4 w-4 self-center justify-self-end text-black forced-colors:hidden"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
            </div>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/30 data-[state=open]:animate-overlayShow" />
              <Dialog.Content
                className={`fixed left-[50%] top-[50%] max-h-[90vh] min-h-[500px] w-[90vw] max-w-[650px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow ${outfit.variable} ${openSans.variable}`}
                aria-describedby={undefined}
              >
                <div className="mb-5 flex justify-between">
                  <Dialog.Title asChild>
                    <h3 className="font-serif text-xl">
                      <FormattedTitle modalType={modalType} />
                    </h3>
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button
                      className="h-[25px] w-[25px] appearance-none items-center justify-center rounded-full outline-none"
                      aria-label="Close"
                    >
                      <Cross2Icon />
                    </button>
                  </Dialog.Close>
                </div>
                {modalType === 'Change password' ? (
                  <ChangePasswordModalView
                    onPasswordChangedCallback={() => {
                      setOpen(false)
                    }}
                  />
                ) : (
                  <PaymentModalView userId={user.id} />
                )}
              </Dialog.Content>
            </Dialog.Portal>
            <Dialog.Trigger
              asChild
              onClick={() => {
                setModalType('Change password')
              }}
            >
              <div className="flex cursor-pointer items-center justify-between rounded-md bg-white p-4 ring-1 ring-slate-200">
                <span className="text-black">
                  <FormattedMessage
                    id="changeMyPassword"
                    defaultMessage="Change my password"
                  />
                </span>
                <ChevronRightIcon className="h-5 w-5 text-black/50" />
              </div>
            </Dialog.Trigger>
            <Dialog.Trigger
              asChild
              onClick={() => {
                setModalType('Payments')
              }}
            >
              <div className="flex cursor-pointer items-center justify-between rounded-md bg-white p-4 ring-1 ring-slate-200">
                <span className="flex items-center space-x-2 text-black">
                  <span>
                    <FormattedMessage id="payments" defaultMessage="Payments" />
                  </span>
                </span>
                <ChevronRightIcon className="h-5 w-5 text-black/50" />
              </div>
            </Dialog.Trigger>
          </div>
          <div className="flex justify-end">
            <span
              className="cursor-pointer text-primary-dark"
              onClick={handleLogout}
            >
              <FormattedMessage id="logout" defaultMessage="Logout" />
            </span>
          </div>
        </div>
        <AccountBottomBar />
      </div>
    </Dialog.Root>
  )
}

export const getServerSideProps = (async (context) => {
  const supabase = createClientServerProps(context)

  const { data: auth, error: authError } = await supabase.auth.getUser()

  if (authError || !auth) {
    return {
      redirect: {
        destination: '/welcome',
        permanent: false,
      },
    }
  }

  const { data: userEntity } = await supabase
    .from('users')
    .select('*')
    .eq('id', auth.user.id)
    .single()

  return {
    props: {
      user: {
        ...userEntity,
        email: auth.user.email,
      },
    },
  }
}) satisfies GetServerSideProps
