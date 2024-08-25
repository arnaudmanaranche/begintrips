import { createJourney } from '@/api/calls/journeys'
import { Button } from '@/components/Button/Button'
import { Callout } from '@/components/Callout/Callout'
import { createClient as createServerClient } from '@/libs/supabase/server-props'
import { useOnboardingStore } from '@/stores/onboarding.store'
import { stripTime } from '@/utils/date'
import { useMutation } from '@tanstack/react-query'
import clsx from 'clsx'
import { formatISO, isPast, isToday } from 'date-fns'
import { motion } from 'framer-motion'
import type { GetServerSidePropsContext } from 'next'
import { Alata } from 'next/font/google'
import Head from 'next/head'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'
import { useState } from 'react'

const alata = Alata({ weight: '400', subsets: ['latin'] })
const ONBOARDING_STEPS = [1, 2, 3]

export default function Onboarding() {
  const searchParams = useSearchParams()
  const step = searchParams.get('step')

  const [currentStep, setCurrentStep] = useState(step ? parseInt(step) : 0)
  const router = useRouter()
  const [error, setError] = useState('')
  const { journey, resetJourney } = useOnboardingStore()
  const { mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: () => createJourney(journey),
  })

  const handleSubmit = async () => {
    try {
      const data = await mutateAsync()
      resetJourney()
      router.push(`/journey/${data.journeyId}`)
    } catch (error) {
      setError(
        'An error occurred while creating your journey. Please try again later.'
      )
    }
  }

  const handleNextStep = () => {
    const isInvalidDate = (date: Date) =>
      isPast(stripTime(date)) && !isToday(stripTime(date))

    if (currentStep === 0) {
      if (!journey.destination) {
        setError('You need to set a destination')
        return
      }
    } else if (currentStep === 1) {
      const departureDate = new Date(journey.departureDate)
      const returnDate = new Date(journey.returnDate)

      if (isToday(stripTime(departureDate))) {
        setError('')
        setCurrentStep((prev) => prev + 1)
        return
      }

      if (isInvalidDate(departureDate) || isInvalidDate(returnDate)) {
        setError('You need to set a valid start and end date')
        return
      }
    }

    // If no errors, clear the error and move to the next step
    setError('')
    setCurrentStep((prev) => prev + 1)
  }

  const progressWidth = `${((currentStep + 1) / ONBOARDING_STEPS.length) * 100}%`

  return (
    <div>
      <Head>
        <title>Planner.so | Onboarding</title>
      </Head>
      <div className="absolute left-0 top-0 h-2 w-full transition-all duration-500">
        <div
          className="absolute left-0 top-0 z-10 h-2 bg-accent-light transition-all duration-500"
          style={{ width: progressWidth }}
        />
      </div>
      <div className="mt-20 flex flex-col">
        <div className="flex justify-center">
          <Link href="/account">
            <span className={clsx(alata.className, 'text-6xl')}>
              Planner
              <span className="text-accent">.so</span>
            </span>
          </Link>
        </div>
        <div className="mx-auto flex flex-col">
          <div className="flex px-10 py-6 lg:px-0">
            <Steps step={currentStep} error={error} />
          </div>
          <div className="flex justify-end border-t border-gray-200 py-6">
            <div className="flex w-full flex-col space-y-4 px-6 md:flex-row md:justify-end md:space-x-4 md:space-y-0 md:px-0 md:pr-6">
              {currentStep > 0 && (
                <Button
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  variant="ghost"
                >
                  {currentStep === 1 ? 'Change destination' : 'Change dates'}
                </Button>
              )}
              <Button
                className={clsx(
                  (isPending || isSuccess) && 'cursor-not-allowed bg-black/30'
                )}
                onClick={
                  currentStep === ONBOARDING_STEPS.length - 1
                    ? handleSubmit
                    : handleNextStep
                }
                isDisabled={isPending || isSuccess}
              >
                {isPending || isSuccess
                  ? 'Creating your journey...'
                  : currentStep === ONBOARDING_STEPS.length - 1
                    ? "Let's go!"
                    : 'Next'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Steps({ step, error }: { step: number; error: string }) {
  const stepComponents = [
    <Step1 key="step1" error={error} />,
    <Step2 key="step2" error={error} />,
    <Step3 key="step3" error={error} />,
  ]
  return stepComponents[step] || <p>Oops...</p>
}

interface StepProps {
  children: ReactNode
  title: ReactNode
  subtitle: ReactNode
}

function Step({ children, title, subtitle }: StepProps) {
  return (
    <motion.div
      className="flex flex-col space-y-4 transition-opacity"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-2">
        <p className="text-base text-gray-500">{subtitle}</p>
        <h2 className="text-4xl font-bold">{title}</h2>
      </div>
      <div className="pb-2 pt-4">{children}</div>
    </motion.div>
  )
}

function Step1({ error }: { error: string }) {
  const { journey, updateJourney } = useOnboardingStore()

  return (
    <Step title="Let's plan your next trip" subtitle="1. Destination">
      <div className="space-y-4">
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Callout>{error}</Callout>
          </motion.div>
        )}
        <div className="flex flex-col justify-start space-y-2">
          <label htmlFor="destination">Destination</label>
          <input
            id="destination"
            onChange={(e) => updateJourney({ destination: e.target.value })}
            defaultValue={journey.destination}
            type="text"
            placeholder="e.g New York"
            className="rounded-md border-2 border-gray-100 bg-slate-50 px-10 py-4 outline-none transition-all placeholder:text-black/50 focus:border-neutral-dark"
          />
        </div>
      </div>
    </Step>
  )
}

function Step2({ error }: { error: string }) {
  const { journey, updateJourney } = useOnboardingStore()

  return (
    <Step
      title={`When do you plan to go to ${journey.destination}?`}
      subtitle="2. Dates"
    >
      <div className="space-y-4">
        {error && (
          <motion.div
            className="transition-opacity"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Callout>{error}</Callout>
          </motion.div>
        )}
        <div className="flex flex-col space-x-0 md:flex-row md:space-x-4">
          <div className="flex flex-col justify-start space-y-2">
            <label htmlFor="start">Departure date</label>
            <input
              id="start"
              onChange={(e) => updateJourney({ departureDate: e.target.value })}
              type="date"
              className="rounded-md border-2 border-gray-100 bg-slate-50 px-10 py-4 outline-none transition-all placeholder:text-black/50 focus:border-neutral-dark"
              defaultValue={formatISO(new Date(journey.departureDate), {
                representation: 'date',
              })}
              min={formatISO(new Date(), { representation: 'date' })}
            />
          </div>
          <div className="flex flex-col justify-start space-y-2">
            <label htmlFor="back">Return date</label>
            <input
              id="back"
              className="rounded-md border-2 border-gray-100 bg-slate-50 px-10 py-4 outline-none transition-all placeholder:text-black/50 focus:border-neutral-dark"
              onChange={(e) => updateJourney({ returnDate: e.target.value })}
              defaultValue={formatISO(new Date(journey.returnDate), {
                representation: 'date',
              })}
              min={formatISO(new Date(journey.departureDate), {
                representation: 'date',
              })}
              type="date"
            />
          </div>
        </div>
      </div>
    </Step>
  )
}

function Step3({ error }: { error: string }) {
  const { journey, updateJourney } = useOnboardingStore()

  return (
    <Step
      title="How much money do you plan to spend on your next trip?"
      subtitle="3. Budget"
    >
      <div className="space-y-4">
        {error ? (
          <motion.div
            className="transition-opacity"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Callout>{error}</Callout>
          </motion.div>
        ) : null}
        <input
          defaultValue={journey.budget ?? ''}
          placeholder="e.g 3600$"
          onChange={(e) => updateJourney({ budget: parseInt(e.target.value) })}
          className="rounded-md border-2 border-gray-100 bg-slate-50 px-10 py-4 outline-none transition-all placeholder:text-black/50 focus:border-neutral-dark"
        />
      </div>
    </Step>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const supabase = createServerClient(context)
  const { data, error } = await supabase.auth.getUser()

  if (error || !data) {
    return {
      redirect: {
        destination: '/welcome',
        permanent: false,
      },
    }
  }

  return {
    props: {
      user: data.user,
    },
  }
}
