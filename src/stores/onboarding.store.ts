import type { AddJourney } from '@/types'
import { addDays, format } from 'date-fns'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface OnboardingStore {
  journey: AddJourney
  updateJourney: (data: Partial<AddJourney>) => void
  resetJourney: () => void
}

const initialJourney: AddJourney = {
  departureDate: format(new Date(), 'yyyy-MM-dd'),
  returnDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
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
