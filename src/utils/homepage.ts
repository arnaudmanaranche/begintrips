import { CalendarIcon, GlobeIcon, PieChartIcon } from '@radix-ui/react-icons'
import type { IconProps } from '@radix-ui/react-icons/dist/types'
import type { ForwardRefExoticComponent, RefAttributes } from 'react'
import { useIntl } from 'react-intl'

export function usePopularDestinations(): {
  name: string
  description: string
  image: string
}[] {
  const intl = useIntl()
  return [
    {
      name: intl.formatMessage({
        id: 'popularDestinationParisName',
        defaultMessage: 'Paris',
      }),
      description: intl.formatMessage({
        id: 'popularDestinationParisDescription',
        defaultMessage: 'The City of Light',
      }),
      image: '/paris.avif',
    },
    {
      name: intl.formatMessage({
        id: 'popularDestinationLondonName',
        defaultMessage: 'London',
      }),
      description: intl.formatMessage({
        id: 'popularDestinationLondonDescription',
        defaultMessage: 'Where History Meets Modernity',
      }),
      image: '/london.avif',
    },
    {
      name: intl.formatMessage({
        id: 'popularDestinationNewYorkName',
        defaultMessage: 'New York',
      }),
      description: intl.formatMessage({
        id: 'popularDestinationNewYorkDescription',
        defaultMessage: 'The City That Never Sleeps',
      }),
      image: '/new-york.avif',
    },
  ]
}

export function useMainFeatures(): {
  title: string
  description: string
  image: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>
}[] {
  const intl = useIntl()

  return [
    {
      title: intl.formatMessage({
        id: 'mainFeatureJourneyTitle',
        defaultMessage: 'Your Journey, Perfectly Planned',
      }),
      description: intl.formatMessage({
        id: 'mainFeatureJourneyDescription',
        defaultMessage:
          'Start your adventure by creating a personalized journey, tailored to your destination, dates, and budget.',
      }),
      image: GlobeIcon,
    },
    {
      title: intl.formatMessage({
        id: 'mainFeaturePlanningTitle',
        defaultMessage: 'Seamless Daily Planning',
      }),
      description: intl.formatMessage({
        id: 'mainFeaturePlanningDescription',
        defaultMessage:
          'Effortlessly add and manage your daily events and expenses, categorized for clear organization and tracking.',
      }),
      image: CalendarIcon,
    },
    {
      title: intl.formatMessage({
        id: 'mainFeatureExpensesTitle',
        defaultMessage: 'Real-Time Expense Tracking',
      }),
      description: intl.formatMessage({
        id: 'mainFeatureExpensesDescription',
        defaultMessage:
          'Stay on top of your budget with a clear overview of your expenses, broken down by day and category for easy management.',
      }),
      image: PieChartIcon,
    },
  ]
}

export function useFaq(): {
  title: string
  subtitle: string
}[] {
  const intl = useIntl()

  return [
    {
      title: intl.formatMessage({
        id: 'faq1Title',
        defaultMessage: 'What is Planner.so ?',
      }),
      subtitle: intl.formatMessage({
        id: 'faq1Subtitle',
        defaultMessage:
          'Planner.so is your ultimate travel companion, designed to simplify your travel planning. It offers an intuitive platform where you can effortlessly create, organize, and visualize all your trips in one convenient place.',
      }),
    },
    {
      title: intl.formatMessage({
        id: 'faq2Title',
        defaultMessage: 'How does the first free trip work?',
      }),
      subtitle: intl.formatMessage({
        id: 'faq2Subtitle',
        defaultMessage:
          'Your first journey is completely free! Enjoy full access to every feature, allowing you to explore the full potential of Planner.so at no cost.',
      }),
    },
    {
      title: intl.formatMessage({
        id: 'faq3Title',
        defaultMessage: 'What payment methods are accepted?',
      }),
      subtitle: intl.formatMessage({
        id: 'faq3Subtitle',
        defaultMessage:
          'We accept all major credit cards, securely processed through Stripe to ensure your transactions are safe and hassle-free.',
      }),
    },
    {
      title: intl.formatMessage({
        id: 'faq4Title',
        defaultMessage: 'Can I modify my itinerary after planning?',
      }),
      subtitle: intl.formatMessage({
        id: 'faq4Subtitle',
        defaultMessage:
          'Absolutely! You can update and adjust your itinerary anytime using our flexible and easy-to-use platform.',
      }),
    },
  ]
}
