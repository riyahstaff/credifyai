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
      credit_report_issues: {
        Row: {
          account_name: string | null
          account_number: string | null
          bureau: string
          created_at: string
          credit_report_id: string
          description: string
          details: Json
          id: string
          severity: string
          status: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_name?: string | null
          account_number?: string | null
          bureau: string
          created_at?: string
          credit_report_id?: string
          description: string
          details: Json
          id?: string
          severity: string
          status?: string
          type: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          account_name?: string | null
          account_number?: string | null
          bureau?: string
          created_at?: string
          credit_report_id?: string
          description?: string
          details?: Json
          id?: string
          severity?: string
          status?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      credit_reports: {
        Row: {
          bureau: string | null
          created_at: string | null
          file_name: string | null
          file_path: string | null
          file_url: string | null
          id: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bureau?: string | null
          created_at?: string | null
          file_name?: string | null
          file_path?: string | null
          file_url?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          bureau?: string | null
          created_at?: string | null
          file_name?: string | null
          file_path?: string | null
          file_url?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      dispute_letters: {
        Row: {
          accountName: string | null
          accountNumber: string | null
          bureau: string
          content: string
          createdAt: string
          errorType: string
          id: string
          letterContent: string
          status: string
          title: string
          updatedAt: string
          userId: string
        }
        Insert: {
          accountName?: string | null
          accountNumber?: string | null
          bureau: string
          content: string
          createdAt?: string
          errorType: string
          id?: string
          letterContent: string
          status?: string
          title: string
          updatedAt?: string
          userId?: string
        }
        Update: {
          accountName?: string | null
          accountNumber?: string | null
          bureau?: string
          content?: string
          createdAt?: string
          errorType?: string
          id?: string
          letterContent?: string
          status?: string
          title?: string
          updatedAt?: string
          userId?: string
        }
        Relationships: []
      }
      dispute_progress: {
        Row: {
          accountName: string
          accountNumber: string
          bureau: string
          date_sent: string
          date_updated: string
          id: string
          letter_id: string
          response_date: string | null
          response_received: boolean
          status: string
          user_id: string
        }
        Insert: {
          accountName: string
          accountNumber: string
          bureau: string
          date_sent?: string
          date_updated?: string
          id?: string
          letter_id?: string
          response_date?: string | null
          response_received?: boolean
          status?: string
          user_id?: string
        }
        Update: {
          accountName?: string
          accountNumber?: string
          bureau?: string
          date_sent?: string
          date_updated?: string
          id?: string
          letter_id?: string
          response_date?: string | null
          response_received?: boolean
          status?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
