import { createJourney } from '@/api/calls/journeys'
import { Button } from '@/components/Button/Button'
import { Callout } from '@/components/Callout/Callout'
import { Input } from '@/components/Input/Input'
import { useSearchDestination } from '@/hooks/useSearchDestination'
import { createClient as createServerClient } from '@/libs/supabase/server-props'
import { useOnboardingStore } from '@/stores/onboarding.store'
import { isInvalidDate, stripTime } from '@/utils/date'
import type { SearchBoxSuggestion, SessionToken } from '@mapbox/search-js-core'
import { useMutation } from '@tanstack/react-query'
import clsx from 'clsx'
import { isToday } from 'date-fns'
import { motion } from 'framer-motion'
import type { GetServerSidePropsContext } from 'next'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import type { ChangeEvent, ReactNode } from 'react'
import { useState } from 'react'

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
    <div className="text-black">
      <div className="absolute left-0 top-0 h-2 w-full transition-all duration-500">
        <div
          className="absolute left-0 top-0 z-10 h-2 bg-accent transition-all duration-500"
          style={{ width: progressWidth }}
        />
      </div>
      <div className="mt-20 flex flex-col">
        <div className="flex justify-center">
          <Link href="/account">
            <span className="text-6xl">
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
}

function Step({ children, title }: StepProps) {
  return (
    <motion.div
      className="flex flex-col space-y-6 transition-opacity"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-2">
        <h2 className="text-4xl font-bold">{title}</h2>
      </div>
      <div className="pb-2 pt-4">{children}</div>
    </motion.div>
  )
}

function Step1({ error }: { error: string }) {
  const { journey, updateJourney } = useOnboardingStore()
  const { searchBoxRef, sessionTokenRef } = useSearchDestination()
  const [suggestions, setSuggestions] = useState<SearchBoxSuggestion[]>()

  async function handleSearchDestination(e: ChangeEvent<HTMLInputElement>) {
    updateJourney({ destination: e.target.value })

    if (e.target.value.length >= 3) {
      const response = await searchBoxRef.current?.suggest(e.target.value, {
        sessionToken: sessionTokenRef.current as SessionToken,
      })

      if (response?.suggestions) {
        setSuggestions(response.suggestions)
      }
    } else {
      setSuggestions([])
    }
  }

  return (
    <Step title="Let's plan your next journey">
      <div className="relative space-y-4">
        <Input
          label="Destination"
          id="destination"
          value={journey.destination}
          onChange={handleSearchDestination}
        />
        <motion.ul
          className="absolute left-0 top-[100%] mt-2 max-h-[200px] w-full max-w-xl overflow-y-scroll rounded-md bg-white shadow-md"
          animate={{
            height: suggestions?.length ? 'auto' : 0,
          }}
        >
          {suggestions?.length
            ? suggestions.map((suggestion) => {
                return (
                  <li
                    key={suggestion.mapbox_id}
                    className="flex cursor-pointer flex-col px-4 py-2 text-start hover:bg-slate-100"
                    tabIndex={-1}
                    onClick={() => {
                      updateJourney({
                        destination: suggestion.name,
                      })
                      setSuggestions([])
                    }}
                  >
                    <p className="text-black">{suggestion.name}</p>
                    <span className="text-sm text-black/70">
                      {suggestion.place_formatted}
                    </span>
                  </li>
                )
              })
            : null}
        </motion.ul>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Callout.Danger>{error}</Callout.Danger>
          </motion.div>
        )}
      </div>
    </Step>
  )
}

function Step2({ error }: { error: string }) {
  const { journey, updateJourney } = useOnboardingStore()

  const handleDepartureDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedDepartureDate = e.target.value
    updateJourney({ departureDate: selectedDepartureDate })

    if (journey.returnDate < selectedDepartureDate) {
      updateJourney({ returnDate: selectedDepartureDate })
    }
  }

  const handleReturnDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateJourney({ returnDate: e.target.value })
  }

  return (
    <Step title={`When do you plan to go to ${journey.destination}?`}>
      <div className="space-y-4">
        {error && (
          <motion.div
            className="transition-opacity"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Callout.Danger>{error}</Callout.Danger>
          </motion.div>
        )}
        <div className="flex flex-col justify-around space-x-0 md:flex-row md:space-x-4">
          <Input
            value={
              journey.departureDate || new Date().toISOString().split('T')[0]
            }
            id="departureDate"
            label="Departure date"
            type="date"
            min={journey.departureDate}
            onChange={handleDepartureDateChange}
          />
          <Input
            value={journey.returnDate || new Date().toISOString().split('T')[0]}
            id="departureDate"
            label="Departure date"
            type="date"
            min={journey.departureDate}
            onChange={handleReturnDateChange}
          />
        </div>
      </div>
    </Step>
  )
}

function Step3({ error }: { error: string }) {
  const { journey, updateJourney } = useOnboardingStore()

  return (
    <Step title="How much do you plan to spend on your next journey?">
      <div className="space-y-4">
        {error ? (
          <motion.div
            className="transition-opacity"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Callout.Danger>{error}</Callout.Danger>
          </motion.div>
        ) : null}
        <Input
          id="budget"
          label="Budget"
          value={journey.budget ?? ''}
          placeholder="e.g 3600$"
          onChange={(e) => updateJourney({ budget: parseInt(e.target.value) })}
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
