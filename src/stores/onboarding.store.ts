import { addDays } from 'date-fns'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { formatDate } from '@/utils/date'

export interface AddJourneyOnboarding {
  departureDate: string
  destination: {
    id: string
    name: string
  }
  returnDate: string
  budget: number
}

interface OnboardingStore {
  journey: AddJourneyOnboarding
  updateJourney: (data: Partial<AddJourneyOnboarding>) => void
  resetJourney: () => void
}

const initialJourney: AddJourneyOnboarding = {
  departureDate: formatDate(new Date(), 'yyyy-MM-dd'),
  returnDate: formatDate(addDays(new Date(), 1), 'yyyy-MM-dd'),
  budget: 0,
  destination: {
    id: '',
    name: '',
  },
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      journey: initialJourney,
      updateJourney: (data) => {
        set((state) => {
          return {
            ...state,
            journey: {
              ...state.journey,
              ...data,
            },
          }
        })
      },
      resetJourney: () => {
        set({ journey: initialJourney })
      },
    }),
    {
      name: 'onboarding',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
