import { useIntl } from 'react-intl'

export function useMainFeatures(): {
  title: string
  description: string
  imageUrl: string
}[] {
  const intl = useIntl()

  return [
    {
      title: intl.formatMessage({
        id: 'mainFeatureJourneyTitle',
        defaultMessage: 'Expense categorisation',
      }),
      description: intl.formatMessage({
        id: 'mainFeatureJourneyDescription',
        defaultMessage:
          'Categorise your expenses to make your trip more organised.',
      }),
      imageUrl: '/categories.png',
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
      imageUrl: '/seamless-daily-planning.png',
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
      imageUrl: '/expense-tracking.png',
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
        defaultMessage: 'What is Begintrips ?',
      }),
      subtitle: intl.formatMessage({
        id: 'faq1Subtitle',
        defaultMessage:
          'Begintrips is your ultimate travel companion, designed to simplify your travel planning. It offers an intuitive platform where you can effortlessly create, organize, and visualize all your trips in one convenient place.',
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
          'Your first journey is completely free! Enjoy full access to every feature, allowing you to explore the full potential of Begintrips at no cost.',
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
