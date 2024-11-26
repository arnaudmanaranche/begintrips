import type { ProductPlanProps } from '@/types'

export const PLANS: Record<string, ProductPlanProps> = {
  'PLANS.PLAN1.TITLE': {
    items: [
      'plans.plan1.items.1',
      'plans.plan1.items.2',
      'plans.plan1.items.3',
      'plans.plan1.items.4',
    ],
    price: 0,
    title: 'plans.plan1.title',
    externalProductId: '',
    mode: 'payment',
    internalProductId: 'ebd93461-f1ff-45ca-8bbe-f476c69c5eb2',
    isDisabled: false,
    isMostPopular: false,
  },
  'PLANS.PLAN2.TITLE': {
    items: [
      'plans.plan2.items.1',
      'plans.plan2.items.2',
      'plans.plan2.items.3',
      'plans.plan2.items.4',
    ],
    price: 29.99,
    title: 'plans.plan2.title',
    externalProductId: 'price_1Pt3FoJSIXQSLNx1CUmYklku',
    mode: 'payment',
    internalProductId: '8827fdcf-0b57-4b5d-b3ea-546ae94073a7',
    isDisabled: false,
    isMostPopular: true,
  },
  'PLANS.PLAN3.TITLE': {
    items: [
      'plans.plan3.items.1',
      'plans.plan3.items.2',
      'plans.plan3.items.3',
    ],
    price: 5.5,
    title: 'plans.plan3.title',
    externalProductId: 'price_1PxsP0QtXBTOxwJvUHRtOaQM',
    mode: 'subscription',
    internalProductId: '5b266ab3-bf87-47df-964c-e9ef465ef87b',
    isDisabled: true,
    isMostPopular: false,
  },
}
