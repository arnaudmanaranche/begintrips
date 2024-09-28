import type {
  Enums,
  Tables,
  TablesInsert,
  TablesUpdate,
} from '@/libs/supabase/database.types'

export type DateString = `${number}-${number}-${number}` // Example for YYYY-MM-DD format

// READ
export type Journey = Tables<'journeys'>
export type Day = Tables<'days'>
export type Expense = Tables<'expenses'>
export type Payments = Tables<'payments'>
export interface User extends Tables<'users'> {
  email: string
}

// CREATE
export type AddExpense = TablesInsert<'expenses'>
export type AddJourney = TablesInsert<'journeys'>
export type AddDay = TablesInsert<'days'>

// UPDATE
export type UpdateExpense = TablesUpdate<'expenses'>

// ENUMS
export type ExpenseCategoryEnum = Enums<'expense_category'>
export type PaymentStatusEnum = Enums<'payment_status'>

// App types
export type ExpensesByCategory = Record<ExpenseCategoryEnum, Expense[]>
export type ExpensesByDay = Record<DateString, Expense[]>

export interface JourneyPage {
  budgetSpent: number
  days: Day[]
  expensesByCategory: ExpensesByCategory
  expensesByDay: ExpensesByDay
  journey: Journey
}

export enum ProductPlanTitleEnum {
  FREE = 'FREE',
  CASUAL_EXPLORER = 'CASUAL_EXPLORER',
  GLOBETROTTER = 'GLOBETROTTER',
}

export interface ProductPlanProps {
  externalProductId: string
  internalProductId: string
  isDisabled: boolean
  isMostPopular: boolean
  items: string[]
  mode: 'subscription' | 'payment' | ''
  price: number
  title: string
}
