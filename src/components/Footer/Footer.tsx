import Link from 'next/link'
import type { ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

export function Footer(): ReactNode {
  return (
    <footer className="bg-white py-12">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="font-semibol mb-4 text-lg">
              <FormattedMessage id="aboutUs" defaultMessage="About us" />
            </h3>
            <p className="text-sm text-gray-600">
              <FormattedMessage
                id="aboutUsSubtitle"
                defaultMessage="Planner.so is your ultimate travel companion, helping you plan and organize your journeys with ease."
              />
            </p>
          </div>

          <div>
            <h3 className="font-semibol mb-4 text-lg">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm text-gray-600 hover:text-accent"
                >
                  <FormattedMessage
                    id="privacyPolicy"
                    defaultMessage="Privacy Policy"
                  />
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-gray-600 hover:text-accent"
                >
                  <FormattedMessage
                    id="termsOfService"
                    defaultMessage="Terms of Service"
                  />
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
  )
}
