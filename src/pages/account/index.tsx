import * as Dialog from '@radix-ui/react-dialog'
import {
  ChevronRightIcon,
  Cross2Icon,
  GearIcon,
  PaperPlaneIcon,
} from '@radix-ui/react-icons'
import { loadStripe } from '@stripe/stripe-js'
import Avatar from 'boring-avatars'
import type { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { checkoutSession } from '@/api/calls/stripe'
import { CurrentPlan } from '@/components/CurrentPlan/CurrentPlan'
import { PaymentModalView } from '@/components/modals/Billing/Billing'
import { ChangePasswordModalView } from '@/components/modals/ChangePassword/ChangePassword'
import { NavBar } from '@/components/NavBar/NavBar'
import { createClient } from '@/libs/supabase/client'
import { createClient as createClientServerProps } from '@/libs/supabase/server-props'
import { useOnboardingStore } from '@/stores/onboarding.store'
import type { User } from '@/types'
import { PLANS } from '@/utils/product-plans'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

export interface AccountPageProps {
  user: User
}

export default function AccountPage({ user }: AccountPageProps): ReactNode {
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const { resetJourney } = useOnboardingStore()
  const [open, setOpen] = useState(false)
  const [modalType, setModalType] = useState<
    'Change password' | 'Payments' | null
  >(null)

  useEffect(() => {
    const search = searchParams.get('payment_status')

    if (search === 'declined') {
      toast.error('Your payment was declined')
    } else if (search === 'succeeded') {
      toast.success('Payment successful. New credits added!')
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
        externalProductId: PLANS['CASUAL_EXPLORER'].externalProductId,
        mode: PLANS['CASUAL_EXPLORER'].mode,
        internalProductId: PLANS['CASUAL_EXPLORER'].internalProductId,
        email: user.email,
      })

      await stripe.redirectToCheckout({
        sessionId: session.id,
      })
    } catch {
      toast.error('An error occurred while creating the checkout session')
      return
    } finally {
      setIsLoading(false)
    }
  }

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
      <div className="relative min-h-screen flex-1 bg-[#faf9f8] pt-10 lg:pt-0">
        <NavBar />
        <div className="mx-auto flex max-w-screen-sm flex-1 flex-col justify-center gap-10 px-10 lg:px-0">
          <div className="flex flex-col items-center space-y-2">
            <Avatar
              name={user.email}
              size={70}
              colors={['#fb6900', '#E57C59', '#9d6969', '#59c2c4', '#304141']}
            />

            <span className="text-black">{user.email}</span>
          </div>
          <div className="space-y-4">
            <p className="font-medium text-black">Account Details</p>
            <CurrentPlan
              credits={user.credits}
              isLoading={isLoading}
              onCheckout={handleOnCheckout}
            />
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/30 data-[state=open]:animate-overlayShow" />
              <Dialog.Content
                className="fixed left-[50%] top-[50%] max-h-[90vh] min-h-[500px] w-[90vw] max-w-[650px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow"
                aria-describedby={undefined}
              >
                <div className="mb-5 flex justify-between">
                  <Dialog.Title asChild>
                    <h3 className="font-serif text-xl">{modalType}</h3>
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
                <span className="text-black">Change my password</span>
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
                  <span>Payments</span>
                </span>
                <ChevronRightIcon className="h-5 w-5 text-black/50" />
              </div>
            </Dialog.Trigger>
          </div>
          <div className="flex justify-end">
            <span
              className="cursor-pointer text-accent-dark"
              onClick={handleLogout}
            >
              Logout
            </span>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-white lg:hidden">
          <ul className="flex h-16  items-center justify-around ring-1 ring-slate-200">
            <li className="flex items-center">
              <Link href="/my-journeys" className="flex flex-col items-center">
                <PaperPlaneIcon className="h-6 w-6 text-black" />
                <span>My journeys</span>
              </Link>
            </li>
            <li className="flex items-center">
              <Link
                href="/account"
                className="flex flex-col items-center text-accent"
              >
                <GearIcon className="h-6 w-6" />
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </div>
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
