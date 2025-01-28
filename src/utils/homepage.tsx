import { useIntl } from 'react-intl'

export function useMainFeatures(): {
  title: string
  description: string
  icon: JSX.Element
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
          'With a list of predefined categories, you can easily assign expenses to the right category and keep track of your spending.',
      }),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        >
          <path d="M11 13H7" />
          <path d="M19 9h-4" />
          <path d="M3 3v16a2 2 0 0 0 2 2h16" />
          <rect x="15" y="5" width="4" height="12" rx="1" />
          <rect x="7" y="8" width="4" height="9" rx="1" />
        </svg>
      ),
    },
    {
      title: intl.formatMessage({
        id: 'mainFeaturePlanningTitle',
        defaultMessage: 'Seamless Daily Planning',
      }),
      description: intl.formatMessage({
        id: 'mainFeaturePlanningDescription',
        defaultMessage:
          'With our calendar view, you can easily plan your daily activities and keep track of your itinerary.',
      }),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        >
          <path d="M8 2v4" />
          <path d="M16 2v4" />
          <rect width="18" height="18" x="3" y="4" rx="2" />
          <path d="M3 10h18" />
        </svg>
      ),
    },
    {
      title: intl.formatMessage({
        id: 'mainFeatureExpensesTitle',
        defaultMessage: 'Budget Tracking',
      }),
      description: intl.formatMessage({
        id: 'mainFeatureExpensesDescription',
        defaultMessage:
          'Stay on top of your budget with a clear overview of your expenses, broken down by day and category for easy management.',
      }),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        >
          <line x1="12" x2="12" y1="2" y2="22" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
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
