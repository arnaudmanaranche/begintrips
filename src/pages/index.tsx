import { Button } from '@/components/Button/Button'
import { Callout } from '@/components/Callout/Callout'
import { Map } from '@/components/Map/Map'
import { createClient } from '@/libs/supabase/server-props'
import { useOnboardingStore } from '@/stores/onboarding.store'
import { ChevronRightIcon } from '@radix-ui/react-icons'
import type { User } from '@supabase/supabase-js'
import clsx from 'clsx'
import type { GetServerSidePropsContext } from 'next'
import { Alata } from 'next/font/google'
import Head from 'next/head'
import Link from 'next/link'
import router from 'next/router'
import { useState } from 'react'

const alata = Alata({ weight: '400', subsets: ['latin'] })

export default function HomePage({ user }: { user: User }) {
  const { updateJourney, journey } = useOnboardingStore()
  const [error, setError] = useState<string | null>(null)

  const handleDepartureDateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedDepartureDate = e.target.value
    updateJourney({ departureDate: selectedDepartureDate })

    if (journey.returnDate < selectedDepartureDate) {
      updateJourney({ returnDate: selectedDepartureDate })
    }
  }

  const handleReturnDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateJourney({ returnDate: e.target.value })
  }

  const handleSubmit = () => {
    if (!journey.destination) {
      setError('Please enter a destination.')
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
      <Head>
        <title>Planner.so | Plan your next trip</title>
      </Head>
      <section className="relative z-10 h-[calc(100vh-10rem)] bg-accent-light/20 md:h-[calc(100vh-20rem)] md:overflow-hidden">
        <div className="mx-auto flex max-w-screen-xl flex-col justify-start space-y-16 pt-10">
          <nav className="flex flex-col items-center justify-between space-y-4 px-10 sm:flex-row md:space-y-0 xl:px-0">
            <Link href="/" className={clsx(alata.className, 'text-3xl')}>
              Planner
              <span className="text-accent">.so</span>
            </Link>
            {user ? (
              <Button onClick={() => router.push('/account')}>
                My dashboard
              </Button>
            ) : (
              <Button onClick={() => router.push('/welcome')}>Login</Button>
            )}
          </nav>
          <div className="flex grow flex-col justify-center space-y-4 px-10 text-center md:text-left xl:px-0">
            <h1
              className={clsx(
                alata.className,
                'text-5xl sm:text-6xl sm:leading-tight'
              )}
            >
              Your Ultimate <br /> Travel Companion
            </h1>
          </div>
          <div>
            <div className="space-y-0 md:space-y-4">
              {error ? (
                <div className="w-full px-6 md:bottom-0 md:ml-10 md:mr-0 md:w-fit md:flex-row md:space-x-10 md:px-0 xl:ml-0">
                  <Callout>{error}</Callout>
                </div>
              ) : null}
              <div className="absolute bottom-[calc(100vh-63rem)] left-0 right-0 ml-auto mr-auto flex w-[calc(100%-2rem)] flex-col space-x-0 rounded-2xl bg-white shadow-lg md:relative md:bottom-0 md:ml-10 md:mr-0 md:w-fit md:flex-row md:space-x-10 xl:ml-0">
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
                    className="py-4 pl-10 outline-none transition-all placeholder:text-black/50 focus:border-neutral-dark focus:outline-none"
                    placeholder="New York"
                    defaultValue={journey.destination}
                    onChange={(e) =>
                      updateJourney({ destination: e.target.value })
                    }
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
                    className="border-gray-100 py-4 pl-10 outline-none transition-all placeholder:text-black/50 focus:border-neutral-dark focus:outline-none"
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
                    className="border-gray-100 py-4 pl-10 outline-none transition-all placeholder:text-black/50 focus:border-neutral-dark focus:outline-none"
                    id="returnDate"
                    type="date"
                    value={journey.returnDate}
                    min={journey.departureDate}
                    onChange={handleReturnDateChange}
                  />
                </div>
                <button
                  className="flex items-center justify-center rounded-b-2xl bg-accent-light px-4 py-4 text-xl text-black/80 transition-colors hover:bg-accent md:rounded-b-none md:rounded-br-2xl md:rounded-tr-2xl"
                  onClick={handleSubmit}
                >
                  <ChevronRightIcon className="hidden h-6 w-6 text-black/50 md:block" />
                  <span className="block md:hidden">Plan my trip</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <Map />
      </section>
      <section className="bg-white pt-[calc(100vh-55rem)] md:py-20">
        <div className="mx-auto flex max-w-screen-xl flex-col">
          <h2 className={clsx(alata.className, 'mb-8 text-center text-4xl')}>
            Why Choose Planner.so?
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:my-10 lg:grid-cols-3">
            <div className="cursor-default rounded-lg p-6 text-center transition-colors hover:border-accent hover:bg-accent-light/10">
              <h2 className={clsx(alata.className, 'mb-4 text-2xl')}>
                Easy Planning
              </h2>
              <p className="text-black/70">
                Streamline your trip planning process with our intuitive tools
                and interfaces.
              </p>
            </div>
            <div className="cursor-default rounded-lg p-6 text-center transition-colors hover:border-accent hover:bg-accent-light/10">
              <h2 className={clsx(alata.className, 'mb-4 text-2xl')}>
                Budget Tracking
              </h2>
              <p>
                Keep your expenses in check with our comprehensive budget
                management features.
              </p>
            </div>
            <div className="cursor-default rounded-lg p-6 text-center transition-colors hover:border-accent hover:bg-accent-light/10">
              <h2 className={clsx(alata.className, 'mb-4 text-2xl')}>
                Itinerary Builder
              </h2>
              <p>
                Create detailed day-by-day itineraries to make the most of your
                travel time.
              </p>
            </div>
          </div>
        </div>
      </section>
      <footer className="mt-auto py-10 text-center text-sm">
        <p>&copy; 2024 Planner.so. All rights reserved.</p>
      </footer>
    </main>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const supabase = createClient(context)

  const { data } = await supabase.auth.getUser()

  return {
    props: {
      user: data.user,
    },
  }
}
