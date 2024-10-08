import { PersonIcon } from '@radix-ui/react-icons'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'

import { Button } from '@/components/Button/Button'
import { Footer } from '@/components/Footer/Footer'
import { SITE_URL } from '@/utils/seo'

const messages = defineMessages({
  title: {
    id: 'privacyPolicyPage.title',
    defaultMessage: 'Planner.so | Privacy Policy',
  },
  metaDescription: {
    id: 'privacyPolicy.subtitle',
    defaultMessage:
      'Learn how Planner.so collects, uses, and protects your personal information in our Privacy Policy',
  },
})

function PrivacyPolicyPage(): ReactNode {
  const router = useRouter()
  const intl = useIntl()

  return (
    <main>
      <Head>
        <title>{intl.formatMessage(messages.title)}</title>
        <meta name="title" content={intl.formatMessage(messages.title)} />
        <meta
          name="description"
          content={intl.formatMessage(messages.metaDescription)}
        />
        <meta property="og:url" content={`${SITE_URL}/privacy-policy`} />
        <meta
          property="og:title"
          content={intl.formatMessage(messages.title)}
        />
        <meta
          property="og:description"
          content={intl.formatMessage(messages.metaDescription)}
        />
        <meta
          property="twitter:title"
          content={intl.formatMessage(messages.title)}
        />
        <meta property="twitter:url" content={`${SITE_URL}/privacy-policy`} />
        <meta
          property="twitter:description"
          content={intl.formatMessage(messages.metaDescription)}
        />
      </Head>
      <section className="pb-4">
        <div className="mx-auto flex max-w-screen-xl flex-col justify-start space-y-16 px-10 pt-10">
          <nav className="flex flex-row items-center justify-between px-10 md:space-y-0 xl:px-0">
            <Link href="/" className="text-3xl">
              Planner
              <span className="text-accent-dark">.so</span>
            </Link>
            <Button
              onClick={() => router.push('/welcome')}
              className="hidden lg:flex"
            >
              <FormattedMessage id="menuLogin" defaultMessage="Login" />
            </Button>
            <Button
              onClick={() => router.push('/account')}
              className="flex lg:hidden"
              icon={<PersonIcon />}
              ariaLabel="My account"
            />
          </nav>
        </div>
      </section>
      <section className="bg-white px-6 pt-20 text-lg text-black md:px-0 md:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col justify-center space-y-10">
            <h1 className="text-5xl text-accent-dark">
              <FormattedMessage
                id="privacyPolicy.title"
                defaultMessage="Privacy Policy"
              />
            </h1>
            <p className="text-lg">
              <FormattedMessage
                id="privacyPolicy.subtitle"
                defaultMessage="At Planner.so, we are dedicated to safeguarding your privacy. This
              policy explains the information we collect, how we use it, and
              your rights regarding that information."
              />
            </p>
            <h2 className="text-xl text-black">
              <FormattedMessage
                id="privacyPolicySection2.title"
                defaultMessage="Information We Collect"
              />
            </h2>
            <div>
              <p className="text-lg ">
                <FormattedMessage
                  id="privacyPolicySection2.description"
                  defaultMessage="We will collect:"
                />
              </p>
              <ul className="list-inside list-disc space-y-2">
                <li>
                  <FormattedMessage
                    id="privacyPolicySection2.description.item1"
                    defaultMessage="information about your usage of our website and services. This
                    includes details such as your IP address, browser type, device
                    information, and operating system."
                  />
                </li>
                <li>
                  <FormattedMessage
                    id="privacyPolicySection2.description.item2"
                    defaultMessage="information you provide to us when you register on our
                    website."
                  />
                </li>
              </ul>
            </div>
            <h2 className="text-xl text-black">
              <FormattedMessage
                id="privacyPolicySection3.title"
                defaultMessage="How We Use Your Information"
              />
            </h2>
            <p className="text-lg">
              <FormattedMessage
                id="privacyPolicySection3.description"
                defaultMessage="Your information is used to deliver and enhance our services,
                personalize your experience, and communicate with you effectively."
              />
            </p>
            <h2 className="text-xl text-black">
              <FormattedMessage
                id="privacyPolicySection4.title"
                defaultMessage="Your Rights"
              />
            </h2>
            <p className="text-lg">
              <FormattedMessage
                id="privacyPolicySection4.description"
                defaultMessage="You have the right to:"
              />
            </p>
            <ul className="list-inside list-disc space-y-2">
              <li>
                <FormattedMessage
                  id="privacyPolicySection4.description.item1"
                  defaultMessage="Request access to the information we hold about you"
                />
              </li>
              <li>
                <FormattedMessage
                  id="privacyPolicySection4.description.item2"
                  defaultMessage="Request correction or deletion of your personal data"
                />
              </li>
              <li>
                <FormattedMessage
                  id="privacyPolicySection4.description.item3"
                  defaultMessage="Object to the processing of your data"
                />
              </li>
              <li>
                <FormattedMessage
                  id="privacyPolicySection4.description.item4"
                  defaultMessage="Restrict how we use your data"
                />
              </li>
              <li>
                <FormattedMessage
                  id="privacyPolicySection4.description.item5"
                  defaultMessage="Request a copy of your data in a structured format"
                />
              </li>
            </ul>
            <p className="text-lg">
              <FormattedMessage
                id="privacyPolicySection4.description.last"
                defaultMessage="If you have any questions or concerns regarding your privacy, please reach out to us at {email}."
                values={{
                  email: (
                    <a href="mailto:hello@enaut.dev">contact@planner.so</a>
                  ),
                }}
              />
            </p>
            <p className="text-sm">Last edit on September 27, 2024.</p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}

export default PrivacyPolicyPage
