export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      days: {
        Row: {
          created_at: string
          id: string
          journeyId: string
          startDate: string
        }
        Insert: {
          created_at?: string
          id?: string
          journeyId: string
          startDate: string
        }
        Update: {
          created_at?: string
          id?: string
          journeyId?: string
          startDate?: string
        }
        Relationships: [
          {
            foreignKeyName: 'days_journeyId_fkey'
            columns: ['journeyId']
            isOneToOne: false
            referencedRelation: 'journeys'
            referencedColumns: ['id']
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          category: Database['public']['Enums']['expense_category']
          created_at: string
          dayId: string
          id: string
          journeyId: string
          name: string
          startDate: string
        }
        Insert: {
          amount: number
          category: Database['public']['Enums']['expense_category']
          created_at?: string
          dayId: string
          id?: string
          journeyId: string
          name: string
          startDate: string
        }
        Update: {
          amount?: number
          category?: Database['public']['Enums']['expense_category']
          created_at?: string
          dayId?: string
          id?: string
          journeyId?: string
          name?: string
          startDate?: string
        }
        Relationships: [
          {
            foreignKeyName: 'expenses_dayId_fkey'
            columns: ['dayId']
            isOneToOne: false
            referencedRelation: 'days'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'expenses_journeyId_fkey'
            columns: ['journeyId']
            isOneToOne: false
            referencedRelation: 'journeys'
            referencedColumns: ['id']
          },
        ]
      }
      journeys: {
        Row: {
          budget: number | null
          country: string
          created_at: string
          departureDate: string
          destination: string
          id: string
          returnDate: string
          status: boolean
          userId: string
        }
        Insert: {
          budget?: number | null
          country?: string
          created_at?: string
          departureDate: string
          destination: string
          id?: string
          returnDate: string
          status?: boolean
          userId?: string
        }
        Update: {
          budget?: number | null
          country?: string
          created_at?: string
          departureDate?: string
          destination?: string
          id?: string
          returnDate?: string
          status?: boolean
          userId?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          created_at: string | null
          external_payment_id: string | null
          id: string
          internal_product_id: string | null
          status: Database['public']['Enums']['payment_status'] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          external_payment_id?: string | null
          id?: string
          internal_product_id?: string | null
          status?: Database['public']['Enums']['payment_status'] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          external_payment_id?: string | null
          id?: string
          internal_product_id?: string | null
          status?: Database['public']['Enums']['payment_status'] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'one_time_payments_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'payments_internal_product_id_fkey'
            columns: ['internal_product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
        ]
      }
      products: {
        Row: {
          created_at: string
          external_product_id: string | null
          id: string
          is_disabled: boolean | null
          is_most_popular: boolean | null
          items: string | null
          price: number | null
          title: string | null
          type: string | null
        }
        Insert: {
          created_at?: string
          external_product_id?: string | null
          id?: string
          is_disabled?: boolean | null
          is_most_popular?: boolean | null
          items?: string | null
          price?: number | null
          title?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string
          external_product_id?: string | null
          id?: string
          is_disabled?: boolean | null
          is_most_popular?: boolean | null
          items?: string | null
          price?: number | null
          title?: string | null
          type?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          external_subscription_id: string | null
          id: string
          internal_product_id: string
          status: Database['public']['Enums']['subscription_status'] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          external_subscription_id?: string | null
          id?: string
          internal_product_id: string
          status?: Database['public']['Enums']['subscription_status'] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          external_subscription_id?: string | null
          id?: string
          internal_product_id?: string
          status?: Database['public']['Enums']['subscription_status'] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'fk_user'
            columns: ['user_id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'subscriptions_internal_product_id_fkey'
            columns: ['internal_product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'subscriptions_user_id_fkey'
            columns: ['user_id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          credits: number
          id: string
          username: string
        }
        Insert: {
          created_at?: string
          credits?: number
          id?: string
          username?: string
        }
        Update: {
          created_at?: string
          credits?: number
          id?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      fetch_users_with_subscriptions: {
        Args: {
          input_user_id: string
        }
        Returns: {
          user_id: string
          username: string
          credits: number
          subscription_id: number
          stripe_subscription_id: string
          subscription_status: string
          product_stripe_product_id: string
          product_type: string
          product_price: number
        }[]
      }
      process_days: {
        Args: {
          start_date: string
          end_date: string
          journey_id: string
        }
        Returns: undefined
      }
      update_journey_dates: {
        Args: {
          start_date: string
          end_date: string
          journey_id: string
        }
        Returns: undefined
      }
      update_user_credits: {
        Args: {
          user_id: string
          change_direction: number
          amount: number
        }
        Returns: undefined
      }
    }
    Enums: {
      expense_category:
        | 'transport'
        | 'hotel'
        | 'concert'
        | 'restaurant'
        | 'sport'
        | 'event'
        | 'other'
        | 'museum'
        | 'monument'
        | 'culture'
        | 'bike'
        | 'bus'
        | 'car'
        | 'taxi'
        | 'metro'
        | 'train'
        | 'shopping'
        | 'attraction'
        | 'bar'
        | 'coffee'
        | 'food'
        | 'gas'
        | 'grocery'
        | 'movie'
        | 'parking'
        | 'ferry'
        | 'flight'
      payment_status: 'succeeded' | 'failed' | 'refunded'
      subscription_status: 'active' | 'canceled'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never
