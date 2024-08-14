import { Expense, Journey } from "@/types/expense";
import { addDays, differenceInDays } from "date-fns";
import { create } from "zustand";

interface OnboardingStore {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  destination: string;
  setDestination: (destination: string) => void;
  setFrom: (from: string) => void;
  setTo: (to: string) => void;
  budget: number;
  setBudget: (budget: number) => void;
  journey: Journey;
  updateJourney: (expense: Expense) => void;
  removeExpense: (expense: Expense) => void;
  updateDays: () => void;
}

export const useOnboardingStore = create<OnboardingStore>()((set) => ({
  currentStep: 0,
  setCurrentStep: (step: number) => set({ currentStep: step }),
  destination: "",
  setDestination: (destination) => {
    set((state) => {
      return {
        ...state,
        journey: {
          ...state.journey,
          location: destination,
        },
      };
    });
  },
  setFrom: (from) => {
    set((state) => {
      return {
        ...state,
        journey: {
          ...state.journey,
          startDate: new Date(from),
        },
      };
    });
  },
  setTo: (from) => {
    set((state) => {
      return {
        ...state,
        journey: {
          ...state.journey,
          endDate: new Date(from),
        },
      };
    });
  },
  budget: 0,
  setBudget: (budget: number) => set({ budget: budget }),
  journey: {
    id: "1",
    name: "",
    startDate: new Date(),
    endDate: new Date(),
    location: "",
    expenses: [],
    days: [],
  },
  updateDays: () => {
    set((state) => {
      const diff = differenceInDays(
        state.journey.endDate,
        state.journey.startDate
      );

      console.log(diff);

      const days = Array.from({ length: diff }, (_, index) => {
        const date = addDays(state.journey.startDate, index);
        return {
          date,
          expenses: [],
        };
      });

      return {
        ...state,
        journey: { ...state.journey, days },
      };
    });
  },
  updateJourney: (expense) => {
    set((state) => {
      const day = new Date(expense.startDate);

      const days = state.journey.days.find(
        (d) => d.date.getDate() === day.getDate()
      );

      if (!days) {
        console.log("no day");

        return state;
      }

      days.expenses.push(expense);

      return {
        ...state,
        journey: { ...state.journey },
      };
    });
  },
  removeExpense: (expense) => {
    set((state) => {
      const days = state.journey.days.map((day) => {
        return {
          ...day,
          expenses: day.expenses.filter((e) => e.name !== expense.name),
        };
      });

      return {
        ...state,
        journey: { ...state.journey, days },
      };
    });
  },
}));
