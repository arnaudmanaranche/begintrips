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
    id: 'termsOfServicePage.title',
    defaultMessage: 'Planner.so | Terms of service',
  },
  metaDescription: {
    id: 'termsOfServicePage.subtitle',
    defaultMessage:
      'Read our Terms of Service to understand the rules, guidelines, and conditions for using Planner.so',
  },
})

function TermsOfServicePage(): ReactNode {
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
        <meta property="og:url" content={`${SITE_URL}/terms-of-service`} />
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
        <meta property="twitter:url" content={`${SITE_URL}/terms-of-service`} />
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
                id="termsOfServicePage.title"
                defaultMessage="Terms of service"
              />
            </h1>
            <p className="text-lg">
              <FormattedMessage
                id="termsOfServicePage.subtitle"
                defaultMessage="By using our service, you agree to these Terms of Service ('Terms'). Please read them carefully."
              />
            </p>
            <ul className="space-y-6">
              <li>
                <h2 className="scroll-m-20 text-lg font-semibold tracking-tight">
                  <FormattedMessage
                    id="termsOfServicePage.section1.title"
                    defaultMessage="1. Introduction"
                  />
                </h2>
                <p className="mt-2 max-w-prose">
                  <FormattedMessage
                    id="termsOfServicePage.section1.description"
                    defaultMessage="By using Planner.so you confirm your acceptance of, and agree to be bound by, these terms and conditions."
                  />
                </p>
              </li>
              <li>
                <h2 className="scroll-m-20 text-lg font-semibold tracking-tight">
                  <FormattedMessage
                    id="termsOfServicePage.section2.title"
                    defaultMessage="2. Agreement to Terms and Conditions"
                  />
                </h2>
                <p className="mt-2 max-w-prose">
                  <FormattedMessage
                    id="termsOfServicePage.section2.description"
                    defaultMessage="This Agreement takes effect on the date on which you first use the Planner.so application."
                  />
                </p>
              </li>
              <li>
                <h2 className="scroll-m-20 text-lg font-semibold tracking-tight">
                  <FormattedMessage
                    id="termsOfServicePage.section3.title"
                    defaultMessage="3. Services"
                  />
                </h2>
                <p className="mt-2 max-w-prose">
                  <FormattedMessage
                    id="termsOfServicePage.section3.description"
                    defaultMessage="We provide a platform for tracking startup launches, as well as a list of resources such starutps can be launched on. Users can: a) Purchase a copy of our directories list without creating an account b) Purchase full access to the list, which includes updates and the ability to track submission processes."
                  />
                </p>
              </li>
              <li>
                <h2 className="scroll-m-20 text-lg font-semibold tracking-tight">
                  <FormattedMessage
                    id="termsOfServicePage.section4.title"
                    defaultMessage="4. Refunds"
                  />
                </h2>
                <p className="mt-2 max-w-prose">
                  <FormattedMessage
                    id="termsOfServicePage.section4.description"
                    defaultMessage="Due to the nature of digital products, the Planner.so cannot be refunded or exchanged once access is granted."
                  />
                </p>
              </li>
              <li>
                <h2 className="scroll-m-20 text-lg font-semibold tracking-tight">
                  <FormattedMessage
                    id="termsOfServicePage.section5.title"
                    defaultMessage="5. Fair Use Policy"
                  />
                </h2>
                <p className="mt-2 max-w-prose">
                  <FormattedMessage
                    id="termsOfServicePage.section5.description"
                    defaultMessage="Our services are subject to fair use. We reserve the right to limit or terminate access for users who abuse our services or use them in a way that negatively impacts other users."
                  />
                </p>
              </li>
              <li>
                <h2 className="scroll-m-20 text-lg font-semibold tracking-tight">
                  <FormattedMessage
                    id="termsOfServicePage.section6.title"
                    defaultMessage="6. Disclaimer"
                  />
                </h2>
                <p className="mt-2 max-w-prose">
                  <FormattedMessage
                    id="termsOfServicePage.section6.description"
                    defaultMessage="It is not warranted that Planner.so will meet your requirements or that its operation will be uninterrupted or error free. All express and implied warranties or conditions not stated in this Agreement (including without limitation, loss of profits, loss or corruption of data, business interruption or loss of contracts), so far as such exclusion or disclaimer is permitted under the applicable law are excluded and expressly disclaimed. This Agreement does not affect your statutory rights."
                  />
                </p>
              </li>
              <li>
                <h2 className="scroll-m-20 text-lg font-semibold tracking-tight">
                  <FormattedMessage
                    id="termsOfServicePage.section7.title"
                    defaultMessage="7. Warranties and Limitation of Liability"
                  />
                </h2>
                <p className="mt-2 max-w-prose">
                  <FormattedMessage
                    id="termsOfServicePage.section7.description"
                    defaultMessage="Planner.so does not give any warranty, guarantee or other term as to the quality, fitness for purpose or otherwise of the software. Planner.so shall not be liable to you by reason of any representation (unless fraudulent), or any implied warranty, condition or other term, or any duty at common law, for any loss of profit or any indirect, special or consequential loss, damage, costs, expenses or other claims (whether caused by Planner.so's negligence or the negligence of its servants or agents or otherwise) which arise out of or in connection with the provision of any goods or services by Planner.so. Planner.so shall not be liable or deemed to be in breach of contract by reason of any delay in performing, or failure to perform, any of its obligations if the delay or failure was due to any cause beyond its reasonable control. Notwithstanding contrary clauses in this Agreement, in the event that Planner.so are deemed liable to you for breach of this Agreement, you agree that Planner.so's liability is limited to the amount actually paid by you for your services or software, which amount calculated in reliance upon this clause. You hereby release Planner.so from any and all obligations, liabilities and claims in excess of this limitation."
                  />
                </p>
              </li>
              <li>
                <h2 className="scroll-m-20 text-lg font-semibold tracking-tight">
                  <FormattedMessage
                    id="termsOfServicePage.section8.title"
                    defaultMessage="8. Responsibilities"
                  />
                </h2>
                <p className="mt-2 max-w-prose">
                  <FormattedMessage
                    id="termsOfServicePage.section8.description"
                    defaultMessage="Planner.so is not responsible for what the user does with the user-generated content."
                  />
                </p>
              </li>
              <li>
                <h2 className="scroll-m-20 text-lg font-semibold tracking-tight">
                  <FormattedMessage
                    id="termsOfServicePage.section9.title"
                    defaultMessage="9. Price Adjustments"
                  />
                </h2>
                <p className="mt-2 max-w-prose">
                  <FormattedMessage
                    id="termsOfServicePage.section9.description"
                    defaultMessage="As we continue to improve Planner.so and expand our offerings, the price may increase. The discount is provided to help customers secure the current price without being surprised by future increases."
                  />
                </p>
              </li>
              <li>
                <h2 className="scroll-m-20 text-lg font-semibold tracking-tight">
                  <FormattedMessage
                    id="termsOfServicePage.section10.title"
                    defaultMessage="10. Intellectual Property"
                  />
                </h2>
                <p className="mt-2 max-w-prose">
                  <FormattedMessage
                    id="termsOfServicePage.section10.description"
                    defaultMessage="The content, organization, graphics, design, and other matters related to Planner.so are protected under applicable copyrights and other proprietary laws. Copying, redistribution, use or publication of any such matters or any part of Planner.so is prohibited."
                  />
                </p>
              </li>
              <li>
                <h2 className="scroll-m-20 text-lg font-semibold tracking-tight">
                  <FormattedMessage
                    id="termsOfServicePage.section11.title"
                    defaultMessage="11. Changes to Terms"
                  />
                </h2>
                <p className="mt-2 max-w-prose">
                  <FormattedMessage
                    id="termsOfServicePage.section11.description"
                    defaultMessage="We reserve the right to modify these Terms at any time. We will notify users of any significant changes."
                  />
                </p>
              </li>
              <li>
                <h2 className="scroll-m-20 text-lg font-semibold tracking-tight">
                  <FormattedMessage
                    id="termsOfServicePage.section12.title"
                    defaultMessage="12. General Terms and Law"
                  />
                </h2>
                <p className="mt-2 max-w-prose">
                  <FormattedMessage
                    id="termsOfServicePage.section12.description"
                    defaultMessage="This Agreement is governed by the laws of the United Kingdom of Great Britain and Northern Ireland. You acknowledge that no joint venture, partnership, employment, or agency relationship exists between you and Planner.so as a result of your use of these services. You agree not to hold yourself out as a representative, agent or employee of Planner.so. You agree that Planner.so will not be liable by reason of any representation, act or omission to act by you."
                  />
                </p>
              </li>
            </ul>
            <p className="text-sm">Last edit on September 27, 2024.</p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}

export default TermsOfServicePage
