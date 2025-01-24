import Link from 'next/link'
import type { ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

export function Footer(): ReactNode {
  return (
    <footer className="bg-orange-50 bg-opacity-30 py-12">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold">
              <FormattedMessage id="aboutUs" defaultMessage="About us" />
            </h3>
            <p className="text-sm text-gray-600">
              <FormattedMessage
                id="aboutUsSubtitle"
                defaultMessage="Begintrips is your ultimate travel companion, helping you plan and organize your journeys with ease."
              />
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">
              <FormattedMessage id="resources" defaultMessage="Resources" />
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-gray-600 hover:text-primary"
                >
                  <FormattedMessage id="blog" defaultMessage="Blog" />
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="text-sm text-gray-600 hover:text-primary"
                >
                  <FormattedMessage id="faq" defaultMessage="FAQ" />
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">
              <FormattedMessage id="legal" defaultMessage="Legal" />
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm text-gray-600 hover:text-primary"
                >
                  <FormattedMessage
                    id="privacyPolicy"
                    defaultMessage="Privacy Policy"
                  />
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-sm text-gray-600 hover:text-primary"
                >
                  <FormattedMessage
                    id="termsOfService"
                    defaultMessage="Terms of Service"
                  />
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">
              <FormattedMessage id="social" defaultMessage="Social" />
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://www.linkedin.com/company/begintrips/"
                  className="text-sm text-gray-600 hover:text-primary"
                  rel="noreferrer"
                  target="_blank"
                >
                  <FormattedMessage id="linkedin" defaultMessage="LinkedIn" />
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.instagram.com/begintrips_/"
                  className="text-sm text-gray-600 hover:text-primary"
                  rel="noreferrer"
                  target="_blank"
                >
                  <FormattedMessage id="instagram" defaultMessage="Instagram" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center sm:flex-row sm:space-y-0 sm:text-left">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} Begintrips.
              {` `}
              <FormattedMessage
                id="allRightsReserved"
                defaultMessage="All rights reserved."
              />
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
