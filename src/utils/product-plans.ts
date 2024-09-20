import type { ProductPlanProps } from '@/types'

export const PLANS: Record<string, ProductPlanProps> = {
  FREE: {
    items: ['1 journey', 'All features included', '5 AI suggestions'],
    price: 0,
    title: 'Free',
    externalProductId: '',
    mode: 'payment',
    internalProductId: 'ebd93461-f1ff-45ca-8bbe-f476c69c5eb2',
    isDisabled: false,
    isMostPopular: false,
  },
  JOURNEY_PACK: {
    items: ['5 journeys', 'All features included', '50 AI suggestions'],
    price: 29.99,
    title: 'Journey Pack',
    externalProductId: 'price_1PuJB0QtXBTOxwJvNGoKTC6T',
    mode: 'payment',
    internalProductId: '8827fdcf-0b57-4b5d-b3ea-546ae94073a7',
    isDisabled: false,
    isMostPopular: false,
  },
  MONTHLY: {
    items: [
      'Unlimited journeys',
      'All features included',
      'Unlimited AI suggestions',
    ],
    price: 5.5,
    title: 'Monthly',
    externalProductId: 'price_1PxsP0QtXBTOxwJvUHRtOaQM',
    mode: 'subscription',
    internalProductId: '5b266ab3-bf87-47df-964c-e9ef465ef87b',
    isDisabled: true,
    isMostPopular: false,
  },
}
