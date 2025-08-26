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
      campaign_networks: {
        Row: {
          created_at: string
          detection_id: string
          id: string
          network_analysis: Json | null
          related_accounts: string[] | null
        }
        Insert: {
          created_at?: string
          detection_id: string
          id?: string
          network_analysis?: Json | null
          related_accounts?: string[] | null
        }
        Update: {
          created_at?: string
          detection_id?: string
          id?: string
          network_analysis?: Json | null
          related_accounts?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_networks_detection_id_fkey"
            columns: ["detection_id"]
            isOneToOne: false
            referencedRelation: "threat_detections"
            referencedColumns: ["id"]
          },
        ]
      }
      monitoring_sources: {
        Row: {
          api_credentials: Json | null
          created_at: string
          id: string
          is_active: boolean | null
          last_scan_at: string | null
          platform: Database["public"]["Enums"]["platform_type"]
          user_id: string
        }
        Insert: {
          api_credentials?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_scan_at?: string | null
          platform: Database["public"]["Enums"]["platform_type"]
          user_id: string
        }
        Update: {
          api_credentials?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_scan_at?: string | null
          platform?: Database["public"]["Enums"]["platform_type"]
          user_id?: string
        }
        Relationships: []
      }
      threat_detections: {
        Row: {
          confidence_score: number | null
          content_text: string | null
          content_url: string | null
          created_at: string
          evidence_urls: string[] | null
          id: string
          metadata: Json | null
          platform: Database["public"]["Enums"]["platform_type"]
          status: Database["public"]["Enums"]["detection_status"] | null
          threat_type: Database["public"]["Enums"]["threat_type"]
          updated_at: string
          vip_id: string
        }
        Insert: {
          confidence_score?: number | null
          content_text?: string | null
          content_url?: string | null
          created_at?: string
          evidence_urls?: string[] | null
          id?: string
          metadata?: Json | null
          platform: Database["public"]["Enums"]["platform_type"]
          status?: Database["public"]["Enums"]["detection_status"] | null
          threat_type: Database["public"]["Enums"]["threat_type"]
          updated_at?: string
          vip_id: string
        }
        Update: {
          confidence_score?: number | null
          content_text?: string | null
          content_url?: string | null
          created_at?: string
          evidence_urls?: string[] | null
          id?: string
          metadata?: Json | null
          platform?: Database["public"]["Enums"]["platform_type"]
          status?: Database["public"]["Enums"]["detection_status"] | null
          threat_type?: Database["public"]["Enums"]["threat_type"]
          updated_at?: string
          vip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "threat_detections_vip_id_fkey"
            columns: ["vip_id"]
            isOneToOne: false
            referencedRelation: "vips"
            referencedColumns: ["id"]
          },
        ]
      }
      vips: {
        Row: {
          created_at: string
          display_name: string | null
          full_name: string
          id: string
          is_active: boolean | null
          keywords: string[] | null
          profile_image_url: string | null
          social_handles: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          full_name: string
          id?: string
          is_active?: boolean | null
          keywords?: string[] | null
          profile_image_url?: string | null
          social_handles?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          full_name?: string
          id?: string
          is_active?: boolean | null
          keywords?: string[] | null
          profile_image_url?: string | null
          social_handles?: Json | null
          updated_at?: string
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
      detection_status:
        | "active"
        | "resolved"
        | "investigating"
        | "false_positive"
      platform_type:
        | "twitter"
        | "facebook"
        | "instagram"
        | "linkedin"
        | "telegram"
        | "discord"
        | "github"
        | "pastebin"
        | "whatsapp"
        | "tiktok"
      threat_type:
        | "impersonation"
        | "misinformation"
        | "data_leak"
        | "deepfake"
        | "coordinated_campaign"
        | "harassment"
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
      detection_status: [
        "active",
        "resolved",
        "investigating",
        "false_positive",
      ],
      platform_type: [
        "twitter",
        "facebook",
        "instagram",
        "linkedin",
        "telegram",
        "discord",
        "github",
        "pastebin",
        "whatsapp",
        "tiktok",
      ],
      threat_type: [
        "impersonation",
        "misinformation",
        "data_leak",
        "deepfake",
        "coordinated_campaign",
        "harassment",
      ],
    },
  },
} as const
