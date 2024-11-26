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
export type Category = Tables<'categories'>
export interface User extends Tables<'users'> {
  email: string
}
export interface UserFavoriteCategories extends Tables<'categories_favorites'> {
  category_id: string
  name: string
  isFavorite: boolean
  emoji: string
}
export interface ExpenseWithCategories extends Expense {
  categories: Category
}

// CREATE
export type AddJourney = TablesInsert<'journeys'>
export type AddDay = TablesInsert<'days'>
export type AddCategory = TablesInsert<'categories'>
export interface AddExpenseWithCategories extends TablesInsert<'expenses'> {
  categories: AddCategory
}

// UPDATE
export interface UpdateExpense extends TablesUpdate<'expenses'> {
  categories: AddCategory
}

// ENUMS
export type ExpenseCategoryEnum = Enums<'expense_category'>
export type PaymentStatusEnum = Enums<'payment_status'>

// App types
export type ExpensesByCategory = Record<string, ExpenseWithCategories[]>
export type ExpensesByDay = Record<DateString, ExpenseWithCategories[]>

export interface JourneyPage {
  budgetSpent: number
  days: Day[]
  expensesByCategory: ExpensesByCategory
  expensesByDay: ExpensesByDay
  journey: Journey
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
