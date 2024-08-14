import type { AddJourney, Journey } from '@/types'
import { format } from 'date-fns'
import { create } from 'zustand'

export interface OnboardingStore {
  journey: Journey
  updateJourney: (data: Partial<AddJourney>) => void
  error: string
  setError: (error: string) => void
}

export const useOnboardingStore = create<OnboardingStore>()((set) => ({
  journey: {
    departureDate: format(new Date(), 'yyyy-MM-dd'),
    returnDate: format(new Date(), 'yyyy-MM-dd'),
    destination: '',
    budget: 0,
    image_cover: '',
    id: '',
    created_at: '',
    userId: '',
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
  error: '',
  setError: (error) => set({ error: error }),
}))
