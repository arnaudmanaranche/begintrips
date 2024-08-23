import { useOnboardingStore } from '@/stores/onboarding.store'
import dynamic from 'next/dynamic'

const Geocoder = dynamic(
  () => import('@mapbox/search-js-react').then((mod) => mod.Geocoder),
  {
    ssr: false,
  }
)

const theme = {
  variables: {
    fontFamily: 'Avenir, sans-serif',
    unit: '14px',
    padding: '0.5em',
    borderRadius: '0',
    boxShadow: '0 0 0 1px silver',
    // colorBackground: 'red',
    colorText: 'blue',
  },
}

export function DestinationSearchContainer() {
  const { journey, updateJourney } = useOnboardingStore()
  return (
    <div>
      <Geocoder
        accessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        options={{
          language: 'en',
        }}
        theme={theme}
        onRetrieve={(e) => {
          updateJourney({
            ...journey,
            destination: e.properties.name,
          })
        }}
        value={journey.destination ?? ''}
      />
    </div>
  )
}
