import { CalendarIcon, GlobeIcon, PieChartIcon } from '@radix-ui/react-icons'

export const popularDestinations = [
  {
    name: 'Paris',
    description: 'The City of Light',
    image: '/paris.avif',
  },
  {
    name: 'London',
    description: 'Where History Meets Modernity',
    image: '/london.avif',
  },
  {
    name: 'New York',
    description: 'The City That Never Sleeps',
    image: '/new-york.avif',
  },
]

export const mainFeatures = [
  {
    title: 'Your Journey, Perfectly Planned',
    description:
      'Start your adventure by creating a personalized journey, tailored to your destination, dates, and budget.',
    image: GlobeIcon,
  },
  {
    title: 'Seamless Daily Planning',
    description:
      'Effortlessly add and manage your daily events and expenses,categorized for clear organization and tracking.',
    image: CalendarIcon,
  },
  {
    title: 'Real-Time Expense Tracking',
    description:
      'Stay on top of your budget with a clear overview of your expenses, broken down by day and category for easy management.',
    image: PieChartIcon,
  },
]
