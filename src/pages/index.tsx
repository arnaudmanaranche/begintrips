import { Button } from '@/components/Button/Button'
import Head from 'next/head'
import Link from 'next/link'
import router from 'next/router'
import { Alata } from 'next/font/google'
import clsx from 'clsx'

const alata = Alata({ weight: '400', subsets: ['latin'] })

export default function HomePage() {
  return (
    <main className="px-6 pt-10">
      <Head>
        <title>Planner.so | Plan your next trip</title>
      </Head>
      <nav className="mx-auto flex max-w-screen-xl items-center justify-between">
        <Link href="/" className={clsx(alata.className, 'text-3xl')}>
          Planner
          <span className="text-accent">.so</span>
        </Link>
        <Button onClick={() => router.push('/account')}>Login</Button>
      </nav>
      <div className="h-screen">
        <div className="mx-auto my-20 flex max-w-screen-xl flex-col">
          <div className="flex flex-col justify-center space-y-4 text-center md:text-left">
            <h1 className={clsx(alata.className, 'text-6xl')}>
              Plan your next trip
            </h1>
            <span className="max-w-xl text-2xl font-light leading-tight">
              Your Ultimate Travel Companion
            </span>
          </div>
          <div className="mt-20">
            <h2 className={clsx(alata.className, 'mb-8 text-center text-4xl')}>
              Why Choose Planner.so?
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border p-6 shadow-sm transition-colors hover:border-accent hover:bg-accent-light/20">
              <h2 className={clsx(alata.className, 'mb-4 text-2xl')}>
                Easy Planning
              </h2>
              <p>
                Streamline your trip planning process with our intuitive tools
                and interfaces.
              </p>
            </div>
            <div className="rounded-lg border p-6 shadow-sm transition-colors hover:border-accent hover:bg-accent-light/20">
              <h2 className={clsx(alata.className, 'mb-4 text-2xl')}>
                Budget Tracking
              </h2>
              <p>
                Keep your expenses in check with our comprehensive budget
                management features.
              </p>
            </div>
            <div className="rounded-lg border p-6 shadow-sm transition-colors hover:border-accent hover:bg-accent-light/20">
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
        <section className="mx-auto my-20 max-w-screen-xl rounded-lg bg-accent-light/10 p-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-6 md:mb-0 md:w-1/2">
              <h2 className={clsx(alata.className, 'mb-4 text-4xl')}>
                Start Planning Your Dream Trip Today
              </h2>
              <p className="mb-6 text-lg">
                Join our growing community of travelers who are simplifying
                their journey with Planner.so
              </p>
              <Button
                onClick={() => router.push('/onboarding')}
                className="px-8 py-3 text-lg"
              >
                Get Started for Free
              </Button>
            </div>
          </div>
        </section>
        <footer className="mt-auto py-6 text-center text-sm text-gray-600">
          <p>&copy; 2024 Planner.so. All rights reserved.</p>
        </footer>
      </div>
    </main>
  )
}
