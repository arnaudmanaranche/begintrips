import { ChevronRightIcon } from '@radix-ui/react-icons'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { type ReactNode, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'

import { useOnboardingStore } from '@/stores/onboarding.store'
import type { ProductPlanProps } from '@/types'

import { Button } from '../Button/Button'

function Cta({ title, isDisabled }: { title: string; isDisabled: boolean }) {
  const router = useRouter()
  const { resetJourney } = useOnboardingStore()

  const wording = useMemo(() => {
    switch (title) {
      case 'Free':
        return <FormattedMessage id="getStarted" defaultMessage="Get started" />
      case 'Casual Explorer':
        return <FormattedMessage id="casualExplorer" defaultMessage="Buy now" />
      case 'Globetrotter':
        return <FormattedMessage id="globetrotter" defaultMessage="Subscribe" />
    }
  }, [title])

  return (
    <Button
      onClick={() => {
        resetJourney()
        router.push('/welcome')
      }}
      stretch
      isDisabled={isDisabled}
    >
      {wording}
    </Button>
  )
}

export function ProductPlan({
  isMostPopular,
  items,
  price,
  title,
  isDisabled,
}: ProductPlanProps): ReactNode {
  return (
    <div
      className={clsx(
        'flex flex-col rounded-lg border p-6',
        (isMostPopular || isDisabled) && 'relative',
        isDisabled ? 'border-gray-400/30' : 'border-accent'
      )}
    >
      {isMostPopular ? (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-sm font-semibold text-white">
          Most Popular
        </div>
      ) : null}
      {isDisabled ? (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-sm font-semibold text-black">
          Coming soon
        </div>
      ) : null}
      <h3 className="mb-4 text-2xl">{title}</h3>
      <p className="mb-4 text-4xl font-bold">
        {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(price)}
      </p>
      <ul className="mb-6 flex-grow space-y-2">
        {items.map((item) => (
          <li className="flex items-center" key={item}>
            <ChevronRightIcon className="mr-2 h-5 w-5 text-accent" />
            {item}
          </li>
        ))}
      </ul>
      <Cta title={title} isDisabled={isDisabled} />
    </div>
  )
}
