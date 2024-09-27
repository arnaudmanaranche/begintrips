import type { ProductPlanProps } from '@/types'

export const PLANS: Record<string, ProductPlanProps> = {
  FREE: {
    items: [
      'Unlimited journeys with all features',
      'Full access to every feature',
      'Unlimited AI-generated suggestions',
    ],
    price: 0,
    title: 'Free',
    externalProductId: '',
    mode: 'payment',
    internalProductId: 'ebd93461-f1ff-45ca-8bbe-f476c69c5eb2',
    isDisabled: false,
    isMostPopular: false,
  },
  CASUAL_EXPLORER: {
    items: [
      'Access to all features for up to 5 journeys',
      'Track expenses by category',
      'View activities available on your selected dates',
      'Monitor your budget in real-time',
    ],
    price: 29.99,
    title: 'Casual Explorer',
    externalProductId: 'price_1Pt3FoJSIXQSLNx1CUmYklku',
    mode: 'payment',
    internalProductId: '8827fdcf-0b57-4b5d-b3ea-546ae94073a7',
    isDisabled: false,
    isMostPopular: false,
  },
  GLOBETROTTER: {
    items: [
      'Access to all features for up to 1 journey',
      'Track expenses by category',
      'View activities available on your selected dates',
      'Monitor your budget in real-time',
    ],
    price: 5.5,
    title: 'Globetrotter',
    externalProductId: 'price_1PxsP0QtXBTOxwJvUHRtOaQM',
    mode: 'subscription',
    internalProductId: '5b266ab3-bf87-47df-964c-e9ef465ef87b',
    isDisabled: true,
    isMostPopular: false,
  },
}
