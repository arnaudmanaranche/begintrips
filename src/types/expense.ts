export type ExpenseCategoryEnum =
  | "transport"
  | "hotel"
  | "events"
  | "musuem"
  | "concert"
  | "restaurant"
  | "sport";

export interface Expense {
  name: string;
  category: ExpenseCategoryEnum;
  startDate?: Date;
  endDate?: Date;
  location?: string;
  amount: number | string;
}

export interface Journey {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  location: string;
  days: JourneyDay[];
}

export interface JourneyDay {
  date: Date;
  expenses: Expense[];
}
