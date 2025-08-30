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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      brands: {
        Row: {
          brand_name: string
          contact_person: string
          created_at: string
          email: string
          expected_budget: number | null
          id: string
          industry: Database["public"]["Enums"]["industry_type"]
          phone: string
          short_description: string | null
          updated_at: string
        }
        Insert: {
          brand_name: string
          contact_person: string
          created_at?: string
          email: string
          expected_budget?: number | null
          id?: string
          industry: Database["public"]["Enums"]["industry_type"]
          phone: string
          short_description?: string | null
          updated_at?: string
        }
        Update: {
          brand_name?: string
          contact_person?: string
          created_at?: string
          email?: string
          expected_budget?: number | null
          id?: string
          industry?: Database["public"]["Enums"]["industry_type"]
          phone?: string
          short_description?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      kocs: {
        Row: {
          audience_analysis_images: string[] | null
          channel_id: string
          channel_link: string
          collaboration_description: string | null
          created_at: string
          email: string
          expected_cast: number | null
          follower_count: number
          full_name: string
          gmv_30_days: number | null
          gmv_images: string[] | null
          id: string
          industries: Database["public"]["Enums"]["industry_type"][]
          job_completion_days: number | null
          phone: string
          sales_method: Database["public"]["Enums"]["sales_method"]
          shipping_address: string
          short_description: string | null
          team_size: number | null
          updated_at: string
        }
        Insert: {
          audience_analysis_images?: string[] | null
          channel_id: string
          channel_link: string
          collaboration_description?: string | null
          created_at?: string
          email: string
          expected_cast?: number | null
          follower_count: number
          full_name: string
          gmv_30_days?: number | null
          gmv_images?: string[] | null
          id?: string
          industries: Database["public"]["Enums"]["industry_type"][]
          job_completion_days?: number | null
          phone: string
          sales_method: Database["public"]["Enums"]["sales_method"]
          shipping_address: string
          short_description?: string | null
          team_size?: number | null
          updated_at?: string
        }
        Update: {
          audience_analysis_images?: string[] | null
          channel_id?: string
          channel_link?: string
          collaboration_description?: string | null
          created_at?: string
          email?: string
          expected_cast?: number | null
          follower_count?: number
          full_name?: string
          gmv_30_days?: number | null
          gmv_images?: string[] | null
          id?: string
          industries?: Database["public"]["Enums"]["industry_type"][]
          job_completion_days?: number | null
          phone?: string
          sales_method?: Database["public"]["Enums"]["sales_method"]
          shipping_address?: string
          short_description?: string | null
          team_size?: number | null
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
      industry_type:
        | "Thời trang"
        | "Làm đẹp"
        | "Điện tử"
        | "Gia dụng"
        | "Thực phẩm"
        | "Du lịch"
        | "Giáo dục"
        | "Sức khỏe"
        | "Thể thao"
        | "Mẹ và bé"
        | "Nội thất"
        | "Phụ kiện"
        | "Giải trí"
        | "Khác"
      sales_method: "Video" | "Livestream" | "Cả hai"
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
      industry_type: [
        "Thời trang",
        "Làm đẹp",
        "Điện tử",
        "Gia dụng",
        "Thực phẩm",
        "Du lịch",
        "Giáo dục",
        "Sức khỏe",
        "Thể thao",
        "Mẹ và bé",
        "Nội thất",
        "Phụ kiện",
        "Giải trí",
        "Khác",
      ],
      sales_method: ["Video", "Livestream", "Cả hai"],
    },
  },
} as const
