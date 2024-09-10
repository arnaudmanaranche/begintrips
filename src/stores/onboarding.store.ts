import { addDays } from 'date-fns'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { AddJourney } from '@/types'
import { formatDate } from '@/utils/date'

export interface OnboardingStore {
  journey: AddJourney
  updateJourney: (data: Partial<AddJourney>) => void
  resetJourney: () => void
}

const initialJourney: AddJourney = {
  departureDate: formatDate(new Date(), 'yyyy-MM-dd'),
  returnDate: formatDate(addDays(new Date(), 1), 'yyyy-MM-dd'),
  destination: '',
  budget: 0,
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
