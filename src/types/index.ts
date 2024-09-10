import type { Database } from '@/libs/supabase/database.types'

export type DateString = `${number}-${number}-${number}` // Example for YYYY-MM-DD format

// Database types
export type Journey = Database['public']['Tables']['journeys']['Row']
export type Day = Database['public']['Tables']['days']['Row']
export type Expense = Database['public']['Tables']['expenses']['Row']
export type AddExpense = Database['public']['Tables']['expenses']['Insert']
export type UpdateExpense = Database['public']['Tables']['expenses']['Update']
export type ExpenseCategoryEnum =
  Database['public']['Enums']['expense_category']
export type AddJourney = Database['public']['Tables']['journeys']['Insert']
export type AddDay = Database['public']['Tables']['days']['Insert']

// App types
export type ExpensesByCategory = Record<ExpenseCategoryEnum, Expense[]>
export type ExpensesByDay = Record<DateString, Expense[]>

export type JourneyPage = {
  budgetSpent: number
  days: Day[]
  expensesByCategory: ExpensesByCategory
  expensesByDay: ExpensesByDay
  journey: Journey
}
