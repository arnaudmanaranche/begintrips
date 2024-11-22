import type { SearchBoxSuggestion, SessionToken } from '@mapbox/search-js-core'
import { ChevronRightIcon, PersonIcon } from '@radix-ui/react-icons'
import type { User } from '@supabase/supabase-js'
import clsx from 'clsx'
import type { Transition, Variants } from 'framer-motion'
import { AnimatePresence, motion } from 'framer-motion'
import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import router from 'next/router'
import type { ChangeEvent, ReactNode } from 'react'
import { Children, useEffect, useRef, useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { Button } from '@/components/Button/Button'
import { Footer } from '@/components/Footer/Footer'
import { Logo } from '@/components/Logo/Logo'
import { Map } from '@/components/Map/Map'
import { ProductPlan } from '@/components/ProductPlan/ProductPlan'
import { useSearchDestination } from '@/hooks/useSearchDestination'
import { createClient } from '@/libs/supabase/server-props'
import { useOnboardingStore } from '@/stores/onboarding.store'
import {
  useFaq,
  useMainFeatures,
  usePopularDestinations,
} from '@/utils/homepage'
import { PLANS } from '@/utils/product-plans'
import { SITE_URL, useSiteDescription, useSiteTitle } from '@/utils/seo'

function Section({
  children,
  backgroundColor,
  title,
}: {
  children: ReactNode
  backgroundColor: string
  title: ReactNode
}) {
  return (
    <section
      className={`bg-${backgroundColor} bg-opacity-30 px-6 py-10 pt-20 md:px-0 md:py-20`}
    >
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-4xl text-black">{title}</h2>
        {children}
      </div>
    </section>
  )
}

interface TextLoopProps {
  children: React.ReactNode[]
  className?: string
  interval?: number
  transition?: Transition
  variants?: Variants
  onIndexChange?: (index: number) => void
}

function TextLoop({
  children,
  className,
  interval = 2,
  transition = { duration: 0.3 },
  variants,
  onIndexChange,
}: TextLoopProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const items = Children.toArray(children)

  useEffect(() => {
    const intervalMs = interval * 1000

    const timer = setInterval(() => {
      setCurrentIndex((current) => {
        const next = (current + 1) % items.length
        onIndexChange?.(next)
        return next
      })
    }, intervalMs)
    return () => clearInterval(timer)
  }, [items.length, interval, onIndexChange])

  const motionVariants: Variants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  }

  return (
    <div className={clsx('relative inline-block whitespace-nowrap', className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={currentIndex}
          initial="initial"
          animate="animate"
          className="font-normal italic text-accent"
          exit="exit"
          transition={transition}
          variants={variants || motionVariants}
        >
          {items[currentIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default function HomePage({ user }: { user: User }): ReactNode {
  const mainFeatures = useMainFeatures()
  const popularDestinations = usePopularDestinations()
  const siteTitle = useSiteTitle()
  const siteDescription = useSiteDescription()
  const faq = useFaq()
  const { updateJourney, journey } = useOnboardingStore()
  const ref = useRef(null)
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
    <>
      <Head>
        <title>{siteTitle}</title>
        <meta name="title" content={siteTitle} />
        <meta name="description" content={siteDescription} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:image" content={`${SITE_URL}/meta-image.png`} />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={siteTitle} />
        <meta property="twitter:title" content={SITE_URL} />
        <meta property="twitter:description" content={siteDescription} />
        <meta property="twitter:image" content={`${SITE_URL}/meta-image.png`} />
      </Head>
      <main>
        <section className="bg-[#FFF5EE] bg-opacity-30 pb-4 md:min-h-[calc(100vh-20rem)] md:pb-0">
          <div className="mx-auto flex max-w-screen-xl flex-col justify-start space-y-16 px-10 pt-10">
            <nav className="flex flex-row items-center justify-between px-10 md:space-y-0 xl:px-0">
              <Logo />
              {user ? (
                <Button
                  onClick={() => router.push('/my-journeys')}
                  className="hidden lg:flex"
                >
                  <FormattedMessage
                    id="menuMyJourneys"
                    defaultMessage="My journeys"
                  />
                </Button>
              ) : (
                <Button
                  onClick={() => router.push('/welcome')}
                  className="hidden lg:flex"
                >
                  <FormattedMessage id="menuLogin" defaultMessage="Login" />
                </Button>
              )}
              <Button
                onClick={() => router.push('/account')}
                className="flex lg:hidden"
                icon={<PersonIcon />}
                ariaLabel="My account"
              />
            </nav>
            <div className="flex grow flex-col flex-wrap justify-center space-y-4 text-center md:text-left">
              <h1
                ref={ref}
                className="text-4xl font-bold text-black sm:leading-tight md:text-7xl md:leading-[5rem] lg:max-w-[850px]"
              >
                <FormattedMessage
                  id="homepageTitle1"
                  defaultMessage="Plan your trips,"
                />
                {` `}
                <TextLoop interval={4}>
                  {[
                    <FormattedMessage
                      id="homepageSubtitle1"
                      key="homepageSubtitle1"
                      defaultMessage="effortlessly"
                    />,
                    <FormattedMessage
                      id="homepageSubtitle2"
                      key="homepageSubtitle2"
                      defaultMessage="stress-free"
                    />,
                    <FormattedMessage
                      id="homepageSubtitle3"
                      key="homepageSubtitle3"
                      defaultMessage="with ease"
                    />,
                  ]}
                </TextLoop>
              </h1>
            </div>
            <div className="relative flex flex-col items-center space-y-10 md:items-start md:space-y-4">
              <div className="flex w-[calc(100%-2rem)] flex-col space-x-0 rounded-2xl bg-white shadow md:w-fit md:flex-row md:space-x-10">
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
                    <FormattedMessage
                      id="departureDateLabel"
                      defaultMessage="Departure date"
                    />
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
                    <FormattedMessage
                      id="returnDateLabel"
                      defaultMessage="Return date"
                    />
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
                  className="flex items-center justify-center rounded-b-2xl bg-accent px-4 py-4 text-xl text-white transition-colors hover:bg-accent-dark md:rounded-b-none md:rounded-br-2xl md:rounded-tr-2xl"
                  onClick={handleSubmit}
                  aria-label="Plan my journey"
                >
                  <ChevronRightIcon className="hidden h-6 w-6 text-white md:block" />
                  <span className="block text-base text-white md:hidden">
                    <FormattedMessage
                      id="planMyJourney"
                      defaultMessage="Plan my journey"
                    />
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
        <Section
          title={
            <FormattedMessage
              id="yourAllInclusiveJourneyStartsHere"
              defaultMessage="Your all-inclusive journey starts here"
            />
          }
          backgroundColor="orange-50"
        >
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {mainFeatures.map((feature) => (
              <div
                key={feature.title}
                className="flex cursor-default flex-col items-center gap-6 rounded-lg p-6 text-center transition-colors hover:border-accent hover:bg-accent-light/10"
              >
                <div className="flex flex-col items-center space-y-2">
                  <feature.image className="h-6 w-6 text-accent" />
                  <h2 className="mb-4 text-2xl">{feature.title}</h2>
                </div>
                <p className="text-black/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </Section>
        <Section
          backgroundColor="white"
          title={
            <FormattedMessage
              defaultMessage="Popular destinations"
              id="components.home.popularDestinations"
            />
          }
        >
          <div className="space-y-10 text-center">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {popularDestinations.map((destination) => (
                <div key={destination.name} className="relative">
                  <Image
                    src={destination.image}
                    alt={`${destination.name} cityscape`}
                    width="300"
                    height="300"
                    className="h-64 w-full rounded-lg object-cover"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-black bg-opacity-30 p-6 text-white">
                    <p className="mb-2 text-2xl font-bold">
                      {destination.name}
                    </p>
                    <p className="mb-4 text-center">
                      {destination.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-lg">
              <FormattedMessage
                id="homepageSubtitle"
                defaultMessage="Create an account and start planning your dream trip now"
              />
            </p>
            <Button onClick={() => router.push('/welcome')}>
              <FormattedMessage
                id="signUpForFree"
                defaultMessage="Sign up for free"
              />
            </Button>
          </div>
        </Section>
        <Section
          backgroundColor="orange-50"
          title={
            <FormattedMessage
              id="payAsYouTravel"
              defaultMessage="Pay as you travel"
            />
          }
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {Object.entries(PLANS).map(([plan, details]) => (
              <ProductPlan key={plan} {...details} />
            ))}
          </div>
        </Section>
        <Section
          backgroundColor="white"
          title={
            <FormattedMessage
              id="frequentlyAskedQuestions"
              defaultMessage="Frequently Asked Questions"
            />
          }
        >
          <div className="text-left">
            {faq.map(({ title, subtitle }) => (
              <div key={title}>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mb-6 mt-2">{subtitle}</p>
              </div>
            ))}
          </div>
        </Section>
        <Footer />
      </main>
    </>
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
