import 'react-day-picker/style.css'

import { track } from '@cronitorio/cronitor-rum'
import type { SearchBoxSuggestion, SessionToken } from '@mapbox/search-js-core'
import {
  CalendarIcon,
  CheckIcon,
  ChevronRightIcon,
  PersonIcon,
} from '@radix-ui/react-icons'
import type { User } from '@supabase/supabase-js'
import clsx from 'clsx'
import * as m from 'motion/react-m'
import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import router from 'next/router'
import type { ChangeEvent, ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { DayPicker } from 'react-day-picker'
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
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [dateRange, setDateRange] = useState({
    startDate: journey.departureDate
      ? new Date(journey.departureDate)
      : new Date(),
    endDate: journey.returnDate ? new Date(journey.returnDate) : new Date(),
  })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

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

  const handleDateRangeChange = ({ from, to }: DateRange) => {
    if (from && dateRange.startDate > from) {
      setDateRange({
        startDate: from,
        endDate: from,
      })

      updateJourney({
        departureDate: from as unknown as string,
        returnDate: from as unknown as string,
      })
    } else {
      setDateRange({
        startDate: from ?? new Date(),
        endDate: to === undefined ? (from as Date) : (to as Date),
      })

      updateJourney({
        departureDate: from as unknown as string,
        returnDate:
          to === undefined
            ? (from as unknown as string)
            : (to as unknown as string),
      })
    }
  }

  async function handleSearchDestination(e: ChangeEvent<HTMLInputElement>) {
    updateJourney({ destination: { id: '', name: e.target.value } })

    if (e.target.value.length >= 2) {
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
    track('homepage_cta')
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
        <meta name="twitter:url" content={siteTitle} />
        <meta name="twitter:title" content={SITE_URL} />
        <meta name="twitter:description" content={siteDescription} />
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
                  <m.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Logo isBlack={false} />
                  </m.div>
                  <div className="hidden items-center space-x-8 lg:flex">
                    <button
                      onClick={() => {
                        track('homepage_features')
                        scrollToSection('features')
                      }}
                      className="text-white hover:text-primary"
                    >
                      <FormattedMessage
                        id="menuFeatures"
                        defaultMessage="Features"
                      />
                    </button>
                    <button
                      onClick={() => {
                        track('homepage_pricing')
                        scrollToSection('pricing')
                      }}
                      className="text-white hover:text-primary"
                    >
                      <FormattedMessage
                        id="menuPricing"
                        defaultMessage="Pricing"
                      />
                    </button>
                    <button
                      onClick={() => {
                        track('homepage_faq')
                        scrollToSection('faq')
                      }}
                      className="text-white hover:text-primary"
                    >
                      <FormattedMessage id="menuFaq" defaultMessage="FAQ" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {user ? (
                    <Button
                      onClick={() => {
                        track('homepage_my_journeys')
                        router.push('/my-journeys')
                      }}
                      className="hidden lg:flex"
                    >
                      <FormattedMessage
                        id="menuMyJourneys"
                        defaultMessage="My journeys"
                      />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        track('homepage_login')
                        router.push('/welcome')
                      }}
                      className="hidden lg:flex"
                    >
                      <FormattedMessage id="menuLogin" defaultMessage="Login" />
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      track('homepage_my_journeys')
                      router.push('/my-journeys')
                    }}
                    className="flex lg:hidden"
                    icon={<PersonIcon />}
                    ariaLabel="My account"
                  />
                </div>
              </nav>
              <div className="flex min-h-[71vh] grow flex-col items-center justify-center text-center md:items-start md:text-left">
                <m.div
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
                      <span className="font-serif">
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
                </m.div>
                <m.div
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
                          value={journey.destination.name}
                          onChange={handleSearchDestination}
                          onFocus={() => {
                            setIsFocused(true)
                            track('homepage_search_destination_focus')
                          }}
                          onBlur={() =>
                            setTimeout(() => setIsFocused(false), 200)
                          }
                          className="w-full rounded-md border border-gray-200 bg-white px-6 py-4 text-lg shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        {suggestions && suggestions.length > 0 && isFocused && (
                          <div className="absolute top-full z-10 mt-2 w-full rounded-md border border-gray-100 bg-white p-2 shadow-lg">
                            {suggestions.map((suggestion) => (
                              <button
                                key={suggestion.mapbox_id}
                                onClick={() => {
                                  updateJourney({
                                    destination: {
                                      id: suggestion.mapbox_id,
                                      name: suggestion.name,
                                    },
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
                            className="flex w-full items-center rounded-md border border-gray-200 bg-white px-6 py-4 text-left text-gray-700 shadow-sm transition-all hover:border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          >
                            <CalendarIcon className="mr-2 h-5 w-5 text-gray-400" />
                            <span>
                              {journey.departureDate && journey.returnDate
                                ? `${new Date(journey.departureDate).toLocaleDateString()} - ${new Date(journey.returnDate).toLocaleDateString() !== undefined ? new Date(journey.returnDate).toLocaleDateString() : new Date(journey.departureDate).toLocaleDateString()}`
                                : 'Select dates'}
                            </span>
                          </button>
                          {showDatePicker ? (
                            <div
                              ref={datePickerRef}
                              className="absolute left-0 top-full z-50 mt-2"
                            >
                              <div className="rounded-lg bg-white p-4 shadow-lg ring-1 ring-black ring-opacity-5">
                                <DayPicker
                                  mode="range"
                                  selected={{
                                    from: dateRange.startDate,
                                    to: dateRange.endDate,
                                  }}
                                  numberOfMonths={isMobile ? 1 : 2}
                                  disabled={{ before: new Date() }}
                                  styles={{
                                    months: {
                                      flexWrap: 'unset',
                                    },
                                  }}
                                  classNames={{
                                    selected: 'text-black',
                                    range_start:
                                      'bg-primary-light border-primary-light text-white',
                                    range_end:
                                      'bg-primary-light border-primary-light text-white',
                                    range_middle: 'bg-slate-100',
                                    today: 'text-black',
                                    chevron: '',
                                  }}
                                  min={1}
                                  required
                                  onSelect={handleDateRangeChange}
                                />
                              </div>
                            </div>
                          ) : null}
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
                </m.div>
              </div>
            </div>
          </div>
        </section>
        <section className="relative bg-white" id="features">
          <div className="mx-auto max-w-screen-xl px-6 md:px-10">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="mb-16 text-center"
            >
              <h2 className="mb-4 text-4xl font-bold md:text-5xl">
                <FormattedMessage
                  id="featuresTitle"
                  defaultMessage="Why choose our travel planner?"
                />
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                <FormattedMessage
                  id="featuresSubtitle"
                  defaultMessage="Here's how our app makes planning your next trips easier and more seamless."
                />
              </p>
              <div className="mt-16 grid gap-8 md:grid-cols-3">
                {mainFeatures.map((feature) => (
                  <div
                    key={feature.title}
                    className="flex flex-col items-center space-y-2 rounded-md bg-gray-50 p-6"
                  >
                    {feature.icon}
                    <h3 className="text-xl font-bold text-gray-800">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </m.div>
          </div>
          <div
            className="mx-auto max-w-screen-xl px-6 md:px-10"
            style={{
              position: 'relative',
              boxSizing: 'content-box',
              maxHeight: '80vh',
              width: '100%',
              aspectRatio: '2.188449848024316',
              padding: '40px 0 40px 0',
            }}
          >
            <iframe
              src="https://app.supademo.com/embed/cm6gseknt193lwabo0sdcpts6?embed_v=2"
              loading="lazy"
              title="Begintrips Demo"
              allow="clipboard-write"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
            />
          </div>
        </section>
        <section className="relative bg-white" id="pricing">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <m.div
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
            </m.div>
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3"
            >
              {Object.values(PLANS).map((plan, index) => (
                <m.div
                  key={plan.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={clsx(
                    'relative rounded-2xl p-8 transition-all',
                    plan.isMostPopular && 'border-2 border-primary shadow-md'
                  )}
                >
                  {plan.isMostPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-sm font-medium text-white">
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
                          currency="EUR"
                          currencyDisplay="narrowSymbol"
                        />
                      </span>
                      {plan.mode === 'payment' && plan.price !== 0 ? (
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
                            defaultMessage="/month"
                          />
                        </span>
                      ) : null}
                    </p>
                    <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                      {plan.items.map((feature) => (
                        <li key={feature} className="flex gap-x-3">
                          <CheckIcon
                            className="h-6 w-5 flex-none text-primary"
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
                      onClick={() => {
                        track('homepage_pricing_cta')
                        router.push('/welcome')
                      }}
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
                </m.div>
              ))}
            </m.div>
          </div>
        </section>
        <section className="relative bg-white" id="faq">
          <div className="mx-auto max-w-screen-xl px-6 md:px-10">
            <m.div
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
            </m.div>
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
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-primary/80 px-6 py-20 text-center text-white md:px-20"
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -left-4 -top-4 h-32 w-32 rotate-45 rounded-xl bg-white" />
              <div className="absolute -bottom-4 -right-4 h-32 w-32 rotate-45 rounded-xl bg-white" />
            </div>
            <div className="relative flex flex-col items-center">
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
                onClick={() => {
                  track('homepage_get_started')
                  router.push('/welcome')
                }}
                className="bg-white text-black"
                variant="ghost"
              >
                <FormattedMessage
                  id="getStartedForFree"
                  defaultMessage="Get Started for Free"
                />
              </Button>
            </div>
          </m.div>
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
