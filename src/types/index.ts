import type { Database } from '@/libs/supabase/database.types'

export type Journey = Database['public']['Tables']['journeys']['Row']
export type Day = Database['public']['Tables']['days']['Row']
export type Expense = Database['public']['Tables']['expenses']['Row']
export type AddExpense = Database['public']['Tables']['expenses']['Insert']
export type ExpenseCategoryEnum =
  Database['public']['Enums']['expense_category']
export type AddJourney = Database['public']['Tables']['journeys']['Insert']
export type AddDay = Database['public']['Tables']['days']['Insert']
