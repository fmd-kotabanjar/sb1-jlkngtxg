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
      profiles: {
        Row: {
          id: string
          username: string | null
          credit_balance: number
          subscription_tier: string
        }
        Insert: {
          id: string
          username?: string | null
          credit_balance?: number
          subscription_tier?: string
        }
        Update: {
          id?: string
          username?: string | null
          credit_balance?: number
          subscription_tier?: string
        }
      }
      prompts: {
        Row: {
          id: string
          title: string
          prompt_text: string
          platform: string
          category: string
          example_image_url: string | null
          usage_tips: string | null
          credit_cost: number
          is_premium: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          prompt_text: string
          platform: string
          category: string
          example_image_url?: string | null
          usage_tips?: string | null
          credit_cost?: number
          is_premium?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          prompt_text?: string
          platform?: string
          category?: string
          example_image_url?: string | null
          usage_tips?: string | null
          credit_cost?: number
          is_premium?: boolean
          created_at?: string
        }
      }
      user_claimed_prompts: {
        Row: {
          id: string
          user_id: string
          prompt_id: string
          claimed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          prompt_id: string
          claimed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          prompt_id?: string
          claimed_at?: string
        }
      }
      redeem_codes: {
        Row: {
          id: string
          code: string
          type: string
          target_id: string | null
          target_role: string | null
          is_used: boolean
          used_by: string | null
          used_at: string | null
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          type: string
          target_id?: string | null
          target_role?: string | null
          is_used?: boolean
          used_by?: string | null
          used_at?: string | null
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          type?: string
          target_id?: string | null
          target_role?: string | null
          is_used?: boolean
          used_by?: string | null
          used_at?: string | null
          expires_at?: string | null
          created_at?: string
        }
      }
      prompt_requests: {
        Row: {
          id: string
          user_id: string
          request_details: string
          status: string
          created_at: string
          completed_prompt_id: string | null
        }
        Insert: {
          id?: string
          user_id: string
          request_details: string
          status?: string
          created_at?: string
          completed_prompt_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          request_details?: string
          status?: string
          created_at?: string
          completed_prompt_id?: string | null
        }
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: string
          created_at?: string
        }
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
  }
}