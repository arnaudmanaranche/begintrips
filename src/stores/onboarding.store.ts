import type { AddJourney } from '@/types'
import { format } from 'date-fns'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface OnboardingStore {
  journey: AddJourney
  updateJourney: (data: Partial<AddJourney>) => void
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      journey: {
        departureDate: format(new Date(), 'yyyy-MM-dd'),
        returnDate: format(new Date(), 'yyyy-MM-dd'),
        destination: '',
        budget: 0,
      },
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
    }),
    {
      name: 'onboarding',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
