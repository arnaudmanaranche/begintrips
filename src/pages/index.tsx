import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

import type { SearchBoxSuggestion, SessionToken } from '@mapbox/search-js-core'
import {
  CalendarIcon,
  CheckIcon,
  ChevronRightIcon,
  PersonIcon,
} from '@radix-ui/react-icons'
import type { User } from '@supabase/supabase-js'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import router from 'next/router'
import type { ChangeEvent, ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { DateRange } from 'react-date-range'
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl'

import { Button } from '@/components/Button/Button'
import { Footer } from '@/components/Footer/Footer'
import { Logo } from '@/components/Logo/Logo'
import { useSearchDestination } from '@/hooks/useSearchDestination'
import { createClient } from '@/libs/supabase/server-props'
import { useOnboardingStore } from '@/stores/onboarding.store'
import { useFaq, useMainFeatures } from '@/utils/homepage'
import { PLANS } from '@/utils/product-plans'
import { useFaqSchema } from '@/utils/schemas/faq.schema'
import { SITE_URL, useSiteDescription, useSiteTitle } from '@/utils/seo'

export default function HomePage({ user }: { user: User }): ReactNode {
  const siteTitle = useSiteTitle()
  const siteDescription = useSiteDescription()
  const faq = useFaq()
  const intl = useIntl()
  const faqSchema = useFaqSchema()
  const mainFeatures = useMainFeatures()
  const { updateJourney, journey } = useOnboardingStore()
  const { searchBoxRef, sessionTokenRef } = useSearchDestination()
  const [isFocused, setIsFocused] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchBoxSuggestion[]>()
  const [currentFeature, setCurrentFeature] = useState(0)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [dateRange, setDateRange] = useState({
    startDate: journey.departureDate
      ? new Date(journey.departureDate)
      : new Date(),
    endDate: journey.returnDate ? new Date(journey.returnDate) : new Date(),
    key: 'selection',
  })

  const datePickerRef = useRef<HTMLDivElement>(null)

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setShowDatePicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDateRangeChange = (ranges: any) => {
    setDateRange(ranges.selection)
    updateJourney({
      departureDate: ranges.selection.startDate,
      returnDate: ranges.selection.endDate,
    })
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
        {/* Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </Head>
      <main className="space-y-24">
        <section className="relative" id="hero">
          <div className="absolute inset-0">
            <Image
              src="/home-background.jpeg"
              alt="Calm mountain lake with reflection"
              fill
              className="object-cover brightness-[0.65]"
              priority
            />
          </div>
          <div className="relative">
            <div className="mx-auto flex max-w-screen-xl flex-col justify-start space-y-10 px-6 pt-10 md:px-10">
              <nav className="flex flex-row items-center justify-between md:px-10 xl:px-0">
                <div className="flex items-center space-x-12">
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Logo isBlack={false} />
                  </motion.div>
                  <div className="hidden items-center space-x-8 lg:flex">
                    <button
                      onClick={() => scrollToSection('features')}
                      className="text-white hover:text-accent"
                    >
                      <FormattedMessage
                        id="menuFeatures"
                        defaultMessage="Features"
                      />
                    </button>
                    <button
                      onClick={() => scrollToSection('pricing')}
                      className="text-white hover:text-accent"
                    >
                      <FormattedMessage
                        id="menuPricing"
                        defaultMessage="Pricing"
                      />
                    </button>
                    <button
                      onClick={() => scrollToSection('faq')}
                      className="text-white hover:text-accent"
                    >
                      <FormattedMessage id="menuFaq" defaultMessage="FAQ" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
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
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <Button onClick={() => router.push('/welcome')}>
                        <FormattedMessage
                          id="menuLogin"
                          defaultMessage="Login"
                        />
                      </Button>
                    </motion.div>
                  )}
                  <Button
                    onClick={() => router.push('/account')}
                    className="flex lg:hidden"
                    icon={<PersonIcon />}
                    ariaLabel="My account"
                  />
                </div>
              </nav>
              <div className="flex min-h-[71vh] grow flex-col items-center justify-center text-center md:items-start md:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="space-y-6"
                >
                  <div className="space-y-4 rounded-2xl py-8">
                    <h1 className="text-4xl font-bold text-white sm:leading-tight md:text-7xl md:leading-[5rem] lg:max-w-[850px]">
                      <FormattedMessage
                        id="homepageHeadline1"
                        defaultMessage="Plan in minutes."
                      />
                      <br />
                      <span className="bg-gradient-to-r from-accent to-accent/80 bg-clip-text font-serif">
                        <FormattedMessage
                          id="homepageHeadline2"
                          defaultMessage="Travel stress-free"
                        />
                      </span>
                    </h1>
                    <h2 className="text-lg text-white md:text-2xl lg:max-w-[800px]">
                      <FormattedMessage
                        id="homepageSubtitle"
                        defaultMessage="Plan your journey day by day, track your expenses by category, and keep all your travel details organized in one place."
                      />
                    </h2>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="w-full max-w-lg"
                >
                  <div className="rounded-2xl py-8">
                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder={intl.formatMessage({
                            id: 'onboardingStep1Title',
                            defaultMessage: 'Where do you want to go ?',
                          })}
                          value={journey.destination}
                          onChange={handleSearchDestination}
                          onFocus={() => setIsFocused(true)}
                          onBlur={() =>
                            setTimeout(() => setIsFocused(false), 200)
                          }
                          className="w-full rounded-md border border-gray-200 bg-white px-6 py-4 text-lg shadow-sm transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                        />
                        {suggestions && suggestions.length > 0 && isFocused && (
                          <div className="absolute top-full z-10 mt-2 w-full rounded-md border border-gray-100 bg-white p-2 shadow-lg">
                            {suggestions.map((suggestion) => (
                              <button
                                key={suggestion.mapbox_id}
                                onClick={() => {
                                  updateJourney({
                                    destination: suggestion.name,
                                  })
                                  setSuggestions([])
                                }}
                                className="flex w-full items-center space-x-2 rounded-lg px-4 py-3 text-left hover:bg-gray-50"
                              >
                                <span className="flex-1">
                                  {suggestion.name}
                                </span>
                                <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                        <div className="relative flex-1">
                          <button
                            onClick={() => setShowDatePicker(!showDatePicker)}
                            className="flex w-full items-center rounded-md border border-gray-200 bg-white px-6 py-4 text-left text-gray-700 shadow-sm transition-all hover:border-accent focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                          >
                            <CalendarIcon className="mr-2 h-5 w-5 text-gray-400" />
                            <span>
                              {journey.departureDate && journey.returnDate
                                ? `${new Date(journey.departureDate).toLocaleDateString()} - ${new Date(
                                    journey.returnDate
                                  ).toLocaleDateString()}`
                                : 'Select dates'}
                            </span>
                          </button>
                          {showDatePicker && (
                            <div
                              ref={datePickerRef}
                              className="absolute left-0 top-full z-50 mt-2"
                            >
                              <div className="rounded-lg bg-white p-4 shadow-lg ring-1 ring-black ring-opacity-5">
                                <DateRange
                                  ranges={[dateRange]}
                                  onChange={handleDateRangeChange}
                                  minDate={new Date()}
                                  rangeColors={['#E3461E']}
                                  showMonthAndYearPickers={false}
                                  direction="horizontal"
                                  months={2}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={handleSubmit}
                        className="w-full py-4 text-lg font-medium"
                      >
                        <FormattedMessage
                          id="homepageStartPlanning"
                          defaultMessage="Start Planning"
                        />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
        <section className="relative bg-white" id="features">
          <div className="mx-auto max-w-screen-xl px-6 md:px-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="mb-16 text-center"
            >
              <h2 className="mb-4 text-4xl font-bold md:text-5xl">
                <FormattedMessage
                  id="featuresTitle"
                  defaultMessage="Everything you need to plan your perfect trip"
                />
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                <FormattedMessage
                  id="featuresSubtitle"
                  defaultMessage="From itinerary planning to expense tracking, we've got you covered with powerful features designed to make your travel planning seamless."
                />
              </p>
            </motion.div>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="relative space-y-4">
                {mainFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                      opacity: index === currentFeature ? 1 : 0.5,
                      x: 0,
                      scale: index === currentFeature ? 1 : 0.98,
                    }}
                    transition={{ duration: 0.5 }}
                    className={clsx(
                      'relative overflow-hidden rounded-xl p-6 transition-all',
                      index === currentFeature ? 'ring-1 ring-accent' : ''
                    )}
                  >
                    <h3 className="mb-3 text-xl font-semibold">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                    {index === currentFeature && (
                      <div className="absolute bottom-0 left-0 right-0">
                        <div className="h-1 w-full overflow-hidden rounded-xl bg-red-200">
                          <motion.div
                            className="h-full rounded-xl bg-accent"
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{
                              duration: 5,
                              ease: 'linear',
                              repeat: 0,
                            }}
                            onAnimationComplete={() => {
                              setCurrentFeature(
                                (prev) => (prev + 1) % mainFeatures.length
                              )
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
              <div className="relative h-full max-h-[500px] items-center justify-center overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  key={currentFeature}
                  className="overflow-hidden"
                >
                  <Image
                    src={mainFeatures[currentFeature].imageUrl}
                    alt={mainFeatures[currentFeature].title}
                    height="100"
                    width="800"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </section>
        <section className="relative bg-white" id="pricing">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-4xl text-center"
            >
              <h2 className="mb-6 text-4xl font-bold md:text-5xl">
                <FormattedMessage
                  id="pricing.title"
                  defaultMessage="Simple pricing for everyone"
                />
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                <FormattedMessage
                  id="pricing.subtitle"
                  defaultMessage="Choose the plan that best suits your travel style"
                />
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3"
            >
              {Object.values(PLANS).map((plan, index) => (
                <motion.div
                  key={plan.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={clsx(
                    'relative rounded-2xl p-8 transition-all',
                    plan.isMostPopular && 'border-2 border-accent shadow-md'
                  )}
                >
                  {plan.isMostPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-sm font-medium text-white">
                      <FormattedMessage
                        id="pricing.mostPopular"
                        defaultMessage="Most popular"
                      />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <h3 className="text-xl font-semibold leading-8 text-gray-900">
                      <FormattedMessage
                        id={plan.title}
                        defaultMessage={plan.title}
                      />
                    </h3>
                    <p className="mt-6 flex items-baseline gap-x-1">
                      <span className="text-4xl font-bold tracking-tight text-gray-900">
                        <FormattedNumber
                          value={plan.price}
                          style="currency"
                          currency="USD"
                          currencyDisplay="narrowSymbol"
                        />
                      </span>
                      {plan.mode === 'payment' ? (
                        <span className="text-sm font-semibold leading-6 text-gray-600">
                          <FormattedMessage
                            id="pricing.oneTimePayment"
                            defaultMessage="one time payment"
                          />
                        </span>
                      ) : null}
                      {plan.mode === 'subscription' ? (
                        <span className="text-sm font-semibold leading-6 text-gray-600">
                          <FormattedMessage
                            id="pricing.perMonth"
                            defaultMessage="per month"
                          />
                        </span>
                      ) : null}
                    </p>
                    <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                      {plan.items.map((feature) => (
                        <li key={feature} className="flex gap-x-3">
                          <CheckIcon
                            className="h-6 w-5 flex-none text-accent"
                            aria-hidden="true"
                          />
                          <FormattedMessage
                            id={feature}
                            defaultMessage={feature}
                          />
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => router.push('/welcome')}
                      isDisabled={plan.isDisabled}
                      className="mt-8"
                      stretch
                    >
                      {plan.isDisabled ? (
                        <FormattedMessage
                          id="pricing.comingSoon"
                          defaultMessage="Coming soon"
                        />
                      ) : (
                        <FormattedMessage
                          id="pricing.getStarted"
                          defaultMessage="Get started"
                        />
                      )}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        <section className="relative bg-white" id="faq">
          <div className="mx-auto max-w-screen-xl px-6 md:px-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="mb-16 text-center"
            >
              <h2 className="mb-4 text-4xl font-bold md:text-5xl">
                <FormattedMessage
                  id="frequentlyAskedQuestions"
                  defaultMessage="Frequently Asked Questions"
                />
              </h2>
            </motion.div>
            <div className="space-y-8">
              {faq.map((item, index) => (
                <div key={index} className="border-b pb-4">
                  <h3 className="text-2xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-lg text-gray-600">{item.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-screen-xl px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-accent to-accent/80 px-6 py-20 text-center text-white md:px-20"
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -left-4 -top-4 h-32 w-32 rotate-45 rounded-xl bg-white" />
              <div className="absolute -bottom-4 -right-4 h-32 w-32 rotate-45 rounded-xl bg-white" />
            </div>

            <div className="relative">
              <h2 className="mb-6 text-4xl font-bold md:text-5xl">
                <FormattedMessage
                  id="readyToStart"
                  defaultMessage="Ready to start your journey?"
                />
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">
                <FormattedMessage
                  id="readyToStartSubtitle"
                  defaultMessage="Join thousands of travelers who trust BeginTrips to create their perfect journey. Start planning your next adventure today!"
                />
              </p>
              <Button
                onClick={() => router.push('/welcome')}
                className="bg-white text-black"
                variant="ghost"
              >
                <FormattedMessage
                  id="getStartedForFree"
                  defaultMessage="Get Started for Free"
                />
              </Button>
            </div>
          </motion.div>
        </section>
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
