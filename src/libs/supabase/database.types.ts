export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
            foreignKeyName: "days_journeyId_fkey"
            columns: ["journeyId"]
            isOneToOne: false
            referencedRelation: "journeys"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          category: Database["public"]["Enums"]["expense_category"]
          created_at: string
          dayId: string
          id: string
          journeyId: string
          name: string
          startDate: string
        }
        Insert: {
          amount: number
          category: Database["public"]["Enums"]["expense_category"]
          created_at?: string
          dayId: string
          id?: string
          journeyId: string
          name: string
          startDate: string
        }
        Update: {
          amount?: number
          category?: Database["public"]["Enums"]["expense_category"]
          created_at?: string
          dayId?: string
          id?: string
          journeyId?: string
          name?: string
          startDate?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_dayId_fkey"
            columns: ["dayId"]
            isOneToOne: false
            referencedRelation: "days"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_journeyId_fkey"
            columns: ["journeyId"]
            isOneToOne: false
            referencedRelation: "journeys"
            referencedColumns: ["id"]
          },
        ]
      }
      journeys: {
        Row: {
          budget: number | null
          created_at: string
          departureDate: string
          destination: string
          id: string
          image_cover: string | null
          returnDate: string
          userId: string
        }
        Insert: {
          budget?: number | null
          created_at?: string
          departureDate: string
          destination: string
          id?: string
          image_cover?: string | null
          returnDate: string
          userId?: string
        }
        Update: {
          budget?: number | null
          created_at?: string
          departureDate?: string
          destination?: string
          id?: string
          image_cover?: string | null
          returnDate?: string
          userId?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
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
    }
    Enums: {
      expense_category:
        | "transport"
        | "hotel"
        | "concert"
        | "restaurant"
        | "sport"
        | "event"
        | "other"
        | "museum"
        | "monument"
        | "culture"
        | "bike"
        | "bus"
        | "car"
        | "taxi"
        | "metro"
        | "train"
        | "shopping"
        | "attraction"
        | "bar"
        | "coffee"
        | "food"
        | "gas"
        | "grocery"
        | "movie"
        | "parking"
        | "ferry"
        | "flight"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
