import { ArrowRightIcon } from '@radix-ui/react-icons'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import { useMainFeatures } from '@/utils/homepage'

import { Button } from '../Button/Button'

export const PromotionSection = (): ReactNode => {
  const router = useRouter()
  const features = useMainFeatures()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative my-20 overflow-hidden rounded-2xl bg-gradient-to-br from-accent-light/40 to-accent/10 px-6 py-16 sm:px-12 lg:px-16"
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -left-4 -top-4 h-64 w-64 rounded-full bg-accent" />
        <div className="absolute -bottom-10 -right-10 h-96 w-96 rounded-full bg-accent-light" />
      </div>
      <div className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            <FormattedMessage
              id="mainFeatureJourneyTitle2"
              defaultMessage="Create your custom journey"
            />
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-4 text-lg leading-8 text-gray-600"
          >
            <FormattedMessage
              id="mainFeatureJourneyDescription2"
              defaultMessage="Start your adventure by creating a personalized trip, tailored to your destination, dates, and budget."
            />
          </motion.p>
        </div>
        <div className="mx-auto mt-12 max-w-4xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className="relative rounded-xl bg-white/60 p-6 shadow-sm ring-1 ring-accent/5 backdrop-blur-sm"
              >
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-12 text-center"
        >
          <Button
            onClick={() => router.push('/welcome')}
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-lg"
          >
            <FormattedMessage
              id="signUpForFree"
              defaultMessage="Sign up for free"
            />
            <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
          <p className="mt-4 text-sm text-gray-600">
            <FormattedMessage
              id="promotionSection.noCard"
              defaultMessage="No credit card required"
            />
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
