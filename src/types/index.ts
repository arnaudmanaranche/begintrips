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

// CREATE
export type AddExpense = TablesInsert<'expenses'>
export type AddJourney = TablesInsert<'journeys'>
export type AddDay = TablesInsert<'days'>

// UPDATE
export type UpdateExpense = TablesUpdate<'expenses'>

// ENUMS
export type ExpenseCategoryEnum = Enums<'expense_category'>

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
