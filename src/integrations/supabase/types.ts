export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string
          credits_used: number
          details: string | null
          id: string
          item_name: string
          status: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          credits_used?: number
          details?: string | null
          id?: string
          item_name: string
          status: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          credits_used?: number
          details?: string | null
          id?: string
          item_name?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      analysis_logs: {
        Row: {
          created_at: string
          credits_used: number
          expiration_date: string
          file_name: string
          id: string
          risk_level: Database["public"]["Enums"]["risk_level"] | null
          status: Database["public"]["Enums"]["process_status"]
          suggestions: Json | null
          updated_at: string
          user_id: string
          vulnerabilities: Json | null
        }
        Insert: {
          created_at?: string
          credits_used?: number
          expiration_date: string
          file_name: string
          id?: string
          risk_level?: Database["public"]["Enums"]["risk_level"] | null
          status?: Database["public"]["Enums"]["process_status"]
          suggestions?: Json | null
          updated_at?: string
          user_id: string
          vulnerabilities?: Json | null
        }
        Update: {
          created_at?: string
          credits_used?: number
          expiration_date?: string
          file_name?: string
          id?: string
          risk_level?: Database["public"]["Enums"]["risk_level"] | null
          status?: Database["public"]["Enums"]["process_status"]
          suggestions?: Json | null
          updated_at?: string
          user_id?: string
          vulnerabilities?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "analysis_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      encryption_logs: {
        Row: {
          created_at: string
          credits_used: number
          encrypted_file_url: string | null
          expiration_date: string
          file_name: string
          file_type: string
          id: string
          license_key_id: string | null
          loader_code: string | null
          protection_level: Database["public"]["Enums"]["protection_level"]
          status: Database["public"]["Enums"]["process_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credits_used?: number
          encrypted_file_url?: string | null
          expiration_date: string
          file_name: string
          file_type: string
          id?: string
          license_key_id?: string | null
          loader_code?: string | null
          protection_level: Database["public"]["Enums"]["protection_level"]
          status?: Database["public"]["Enums"]["process_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credits_used?: number
          encrypted_file_url?: string | null
          expiration_date?: string
          file_name?: string
          file_type?: string
          id?: string
          license_key_id?: string | null
          loader_code?: string | null
          protection_level?: Database["public"]["Enums"]["protection_level"]
          status?: Database["public"]["Enums"]["process_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "encryption_logs_license_key_id_fkey"
            columns: ["license_key_id"]
            isOneToOne: false
            referencedRelation: "license_keys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "encryption_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      license_keys: {
        Row: {
          created_at: string
          id: string
          key_name: string
          key_value: string
          scripts_count: number
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          key_name: string
          key_value?: string
          scripts_count?: number
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          key_name?: string
          key_value?: string
          scripts_count?: number
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "license_keys_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age: number
          company_name: string
          created_at: string
          credits: number
          id: string
          name: string
          name_change_used: boolean
          plan: Database["public"]["Enums"]["plan_type"]
          theme_preference: string | null
          updated_at: string
        }
        Insert: {
          age: number
          company_name: string
          created_at?: string
          credits?: number
          id: string
          name: string
          name_change_used?: boolean
          plan?: Database["public"]["Enums"]["plan_type"]
          theme_preference?: string | null
          updated_at?: string
        }
        Update: {
          age?: number
          company_name?: string
          created_at?: string
          credits?: number
          id?: string
          name?: string
          name_change_used?: boolean
          plan?: Database["public"]["Enums"]["plan_type"]
          theme_preference?: string | null
          updated_at?: string
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
      plan_type: "trial" | "basic" | "pro" | "infinite"
      process_status: "pending" | "processing" | "completed" | "failed"
      protection_level: "standard" | "advanced" | "undetectable"
      risk_level: "low" | "medium" | "high"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      plan_type: ["trial", "basic", "pro", "infinite"],
      process_status: ["pending", "processing", "completed", "failed"],
      protection_level: ["standard", "advanced", "undetectable"],
      risk_level: ["low", "medium", "high"],
    },
  },
} as const
