import type { SearchBoxSuggestion, SessionToken } from '@mapbox/search-js-core'
import { ChevronRightIcon, PersonIcon } from '@radix-ui/react-icons'
import type { User } from '@supabase/supabase-js'
import { motion, useInView } from 'framer-motion'
import type { GetServerSideProps } from 'next'
import Link from 'next/link'
import router from 'next/router'
import type { ChangeEvent, ReactNode } from 'react'
import { useRef, useState } from 'react'

import { Button } from '@/components/Button/Button'
import { Map } from '@/components/Map/Map'
import { ProductPlan } from '@/components/ProductPlan/ProductPlan'
import { useSearchDestination } from '@/hooks/useSearchDestination'
import { createClient } from '@/libs/supabase/server-props'
import { useOnboardingStore } from '@/stores/onboarding.store'
import { PLANS } from '@/utils/product-plans'

export default function HomePage({ user }: { user: User }): ReactNode {
  const { updateJourney, journey } = useOnboardingStore()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const { searchBoxRef, sessionTokenRef } = useSearchDestination()
  const [isFocused, setIsFocused] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchBoxSuggestion[]>()

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

  const handleSubmit = () => {
    if (!journey.destination) {
      return
    }

    if (user) {
      router.push('/onboarding?step=2')
    } else {
      router.push('/welcome')
    }
  }

  return (
    <main>
      <section className="bg-accent-light bg-opacity-20 pb-4 md:min-h-[calc(100vh-20rem)] md:pb-0">
        <div className="mx-auto flex max-w-screen-xl flex-col justify-start space-y-16 px-10 pt-10">
          <nav className="flex flex-row items-center justify-between px-10 md:space-y-0 xl:px-0">
            <Link href="/" className="text-3xl">
              Planner
              <span className="text-accent">.so</span>
            </Link>
            {user ? (
              <Button
                onClick={() => router.push('/my-journeys')}
                className="hidden lg:flex"
              >
                My journeys
              </Button>
            ) : (
              <Button
                onClick={() => router.push('/welcome')}
                className="hidden lg:flex"
              >
                Login
              </Button>
            )}
            <Button
              onClick={() => router.push('/account')}
              className="flex lg:hidden"
              icon={<PersonIcon />}
            />
          </nav>
          <div className="flex grow flex-col flex-wrap justify-center space-y-4 text-center md:text-left">
            <h1
              ref={ref}
              className="text-4xl font-bold text-black sm:leading-tight md:text-6xl md:leading-[5rem] lg:max-w-[800px]"
            >
              {'Take the Stress Out of Travel Simplify Your Journey'
                .split('')
                .map((letter, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                  >
                    {letter}
                  </motion.span>
                ))}
            </h1>
          </div>
          <div className="relative flex flex-col items-center space-y-10 md:items-start md:space-y-4">
            <div className="flex w-[calc(100%-2rem)] flex-col space-x-0 rounded-2xl bg-white shadow-lg md:w-fit md:flex-row md:space-x-10">
              <div className="flex flex-col py-4">
                <label
                  className="flex-1 px-10 text-sm text-black/80"
                  htmlFor="destination"
                >
                  Destination
                </label>
                <input
                  type="text"
                  id="destination"
                  onBlur={() => {
                    setIsFocused(false)
                  }}
                  onFocus={() => {
                    setIsFocused(true)
                  }}
                  className="py-4 pl-10 outline-none transition-all placeholder:text-black/50 focus:border-neutral-dark focus:outline-none"
                  placeholder="New York"
                  value={journey.destination}
                  onChange={handleSearchDestination}
                />
              </div>
              <div className="flex flex-col py-4">
                <label
                  className="px-10 text-sm text-black/80"
                  htmlFor="departureDate"
                >
                  Departure date
                </label>
                <input
                  placeholder="Departure date"
                  className="w-full flex-1 border-gray-100 bg-transparent py-4 pl-10 outline-none transition-all placeholder:text-black/50 focus:border-neutral-dark focus:outline-none"
                  id="departureDate"
                  defaultValue={journey.departureDate}
                  type="date"
                  min={journey.departureDate}
                  onChange={handleDepartureDateChange}
                />
              </div>
              <div className="flex flex-col py-4">
                <label
                  className="px-10 text-sm text-black/80"
                  htmlFor="returnDate"
                >
                  Return date
                </label>
                <input
                  placeholder="Return date"
                  className="w-full flex-1 border-gray-100 bg-transparent py-4 pl-10 outline-none transition-all placeholder:text-black/50 focus:border-neutral-dark focus:outline-none"
                  id="returnDate"
                  type="date"
                  value={journey.returnDate}
                  min={journey.departureDate}
                  onChange={handleReturnDateChange}
                />
              </div>
              <button
                className="flex items-center justify-center rounded-b-2xl bg-accent px-4 py-4 text-xl text-black/80 transition-colors hover:bg-accent-dark md:rounded-b-none md:rounded-br-2xl md:rounded-tr-2xl"
                onClick={handleSubmit}
              >
                <ChevronRightIcon className="hidden h-6 w-6 text-white md:block" />
                <span className="block text-base md:hidden">
                  Plan my journey
                </span>
              </button>
            </div>
            <motion.ul
              className="absolute left-0 top-[100%] mt-2 max-h-[200px] w-full max-w-xl overflow-y-scroll rounded-md bg-white shadow-md"
              animate={{
                height: suggestions?.length && isFocused ? 'auto' : 0,
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
          </div>
        </div>
        <Map />
      </section>
      <section className="bg-white px-6 pt-20 md:px-0 md:py-20">
        <div className="mx-auto flex max-w-screen-xl flex-col text-black">
          <h2 className="mb-8 text-center text-4xl">
            Your All-Inclusive Journey Starts Here
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:my-10 lg:grid-cols-3">
            <div className="cursor-default rounded-lg p-6 text-center transition-colors hover:border-accent hover:bg-accent-light/10">
              <h2 className="mb-4 text-2xl">Effortless Planning</h2>
              <p className="text-black/70">
                Plan your trip with ease using our intuitive tools, enabling you
                to craft a perfect itinerary in just minutes.
              </p>
            </div>
            <div className="cursor-default rounded-lg p-6 text-center transition-colors hover:border-accent hover:bg-accent-light/10">
              <h2 className="mb-4 text-2xl">Smart Budget Management</h2>
              <p className="text-black/70">
                Keep your expenses under control with our comprehensive budget
                tracking, ensuring every penny is well spent.
              </p>
            </div>
            <div className="cursor-default rounded-lg p-6 text-center transition-colors hover:border-accent hover:bg-accent-light/10">
              <h2 className="mb-4 text-2xl">Expenses overview</h2>
              <p className="text-black/70">
                See your expenses by category and by day, and get a
                comprehensive overview of your budget.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-gray-50 px-6 pt-20 md:px-0 md:py-20" id="pricing">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-4xl text-black">
            Buy as you travel
          </h2>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {Object.entries(PLANS).map(([plan, details]) => (
              <ProductPlan key={plan} {...details} />
            ))}
          </div>
        </div>
      </section>
      <section className="bg-white px-6 pt-20 md:px-0 md:py-20" id="faq">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-8 text-center text-4xl text-black">
            Frequently Asked Questions
          </h2>
          <div className="text-left">
            <h3 className="font-semibold">What is Planner.so?</h3>
            <p className="mb-6 mt-2">
              Planner.so is your ultimate travel companion, designed to simplify
              your travel planning. It offers an intuitive platform where you
              can effortlessly create, organize, and visualize all your trips in
              one convenient place.
            </p>
            <h3 className="font-semibold">
              How does the first free trip work?
            </h3>
            <p className="mb-6 mt-2">
              Your first journey is completely free! Enjoy full access to every
              feature, allowing you to explore the full potential of Planner.so
              at no cost.
            </p>
            <h3 className="font-semibold">
              What payment methods are accepted?
            </h3>
            <p className="mb-6 mt-2">
              We accept all major credit cards, securely processed through
              Stripe to ensure your transactions are safe and hassle-free.
            </p>
            <h3 className="font-semibold">
              Can I modify my itinerary after planning?
            </h3>
            <p className="mt-2">
              Absolutely! You can update and adjust your itinerary anytime using
              our flexible and easy-to-use platform.
            </p>
          </div>
        </div>
      </section>
      <footer className="bg-gray-50 py-12">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <h3 className="font-semibol mb-4 text-lg">About us</h3>
              <p className="text-sm text-gray-600">
                Planner.so is your ultimate travel companion, helping you plan
                and organize your journeys with ease.
              </p>
            </div>
            <div className="hidden">
              <h3 className="font-semibol mb-4 text-lg">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-sm text-gray-600 hover:text-accent"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    className="text-sm text-gray-600 hover:text-accent"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#faq"
                    className="text-sm text-gray-600 hover:text-accent"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibol mb-4 text-lg">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-sm text-gray-600 hover:text-accent"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-sm text-gray-600 hover:text-accent"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8 text-center">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} Planner.so. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}

export const getServerSideProps = (async (context) => {
  const supabase = createClient(context)

  const { data } = await supabase.auth.getUser()

  return {
    props: {
      user: data.user,
    },
  }
}) satisfies GetServerSideProps<{ user: User | null }>
