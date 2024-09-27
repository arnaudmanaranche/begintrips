import Link from 'next/link'
import type { ReactNode } from 'react'

function PrivacyPolicyPage(): ReactNode {
  return (
    <main>
      <section className="bg-white px-6 pt-20 text-lg text-black md:px-0 md:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col justify-center space-y-10">
            <h1 className="text-5xl text-accent">Privacy Policy</h1>
            <p className="text-lg ">
              At Planner.so, we are dedicated to safeguarding your privacy. This
              policy explains the information we collect, how we use it, and
              your rights regarding that information.
            </p>
            <h2 className="text-xl text-accent">Information We Collect</h2>
            <div>
              <p className="text-lg ">We will collect:</p>
              <ul className="list-inside list-disc space-y-2">
                <li>
                  information about your usage of our website and services. This
                  includes details such as your IP address, browser type, device
                  information, and operating system.
                </li>
                <li>
                  information you provide to us when you register on our
                  website.
                </li>
              </ul>
            </div>
            <h2 className="text-xl text-accent">How We Use Your Information</h2>
            <p className="text-lg ">
              Your information is used to deliver and enhance our services,
              personalize your experience, and communicate with you effectively.
            </p>
            <h2 className="text-xl text-accent">Your Rights</h2>
            <p className="text-lg ">You have the right to:</p>
            <ul className="list-inside list-disc space-y-2">
              <li>Request access to the information we hold about you</li>
              <li>Request correction or deletion of your personal data</li>
              <li>Object to the processing of your data</li>
              <li>Restrict how we use your data</li>
              <li>Request a copy of your data in a structured format</li>
            </ul>
            <p className="text-lg ">
              If you have any questions or concerns regarding your privacy,
              please reach out to us at{' '}
              <a href="mailto:hello@enaut.dev">contact@planner.so</a>.
            </p>
            <p className="text-sm">Last edit on September 27, 2024.</p>
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

export default PrivacyPolicyPage
