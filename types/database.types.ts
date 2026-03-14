// This file mirrors the live Supabase schema.
// DO NOT EDIT MANUALLY — regenerate with:
// npx supabase gen types typescript --project-id hxcecduayyacnkfzwatt > types/database.types.ts

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
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          onboarding_completed: boolean
          default_org_slug: string | null
          is_platform_owner: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          onboarding_completed?: boolean
          default_org_slug?: string | null
          is_platform_owner?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          onboarding_completed?: boolean
          default_org_slug?: string | null
          is_platform_owner?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          logo_url: string | null
          plan: 'free' | 'pro' | 'team'
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          logo_url?: string | null
          plan?: 'free' | 'pro' | 'team'
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          logo_url?: string | null
          plan?: 'free' | 'pro' | 'team'
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      org_members: {
        Row: {
          id: string
          org_id: string
          user_id: string
          role: 'admin' | 'member'
          joined_at: string
        }
        Insert: {
          id?: string
          org_id: string
          user_id: string
          role?: 'admin' | 'member'
          joined_at?: string
        }
        Update: {
          id?: string
          org_id?: string
          user_id?: string
          role?: 'admin' | 'member'
          joined_at?: string
        }
      }
      invitations: {
        Row: {
          id: string
          org_id: string
          email: string
          role: 'admin' | 'member'
          token: string
          invited_by: string
          expires_at: string
          accepted_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          org_id: string
          email: string
          role?: 'admin' | 'member'
          token?: string
          invited_by: string
          expires_at?: string
          accepted_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          org_id?: string
          email?: string
          role?: 'admin' | 'member'
          token?: string
          invited_by?: string
          expires_at?: string
          accepted_at?: string | null
          created_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          org_id: string
          name: string
          description: string | null
          color: string
          archived: boolean
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          org_id: string
          name: string
          description?: string | null
          color?: string
          archived?: boolean
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          org_id?: string
          name?: string
          description?: string | null
          color?: string
          archived?: boolean
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      project_members: {
        Row: {
          id: string
          project_id: string
          user_id: string
          is_manager: boolean
          added_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          is_manager?: boolean
          added_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          is_manager?: boolean
          added_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          project_id: string
          org_id: string
          title: string
          description: string | null
          status: 'todo' | 'in_progress' | 'in_review' | 'done'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          assignee_id: string | null
          due_date: string | null
          position: number
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          org_id: string
          title: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'in_review' | 'done'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          assignee_id?: string | null
          due_date?: string | null
          position?: number
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          org_id?: string
          title?: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'in_review' | 'done'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          assignee_id?: string | null
          due_date?: string | null
          position?: number
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      activity_logs: {
        Row: {
          id: string
          org_id: string
          project_id: string | null
          task_id: string | null
          actor_id: string
          action: string
          entity_type: string
          entity_id: string
          meta: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          org_id: string
          project_id?: string | null
          task_id?: string | null
          actor_id: string
          action: string
          entity_type: string
          entity_id: string
          meta?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          org_id?: string
          project_id?: string | null
          task_id?: string | null
          actor_id?: string
          action?: string
          entity_type?: string
          entity_id?: string
          meta?: Json | null
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          org_id: string
          type: string
          title: string
          body: string | null
          link: string | null
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          org_id: string
          type: string
          title: string
          body?: string | null
          link?: string | null
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          org_id?: string
          type?: string
          title?: string
          body?: string | null
          link?: string | null
          read?: boolean
          created_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      task_status: 'todo' | 'in_progress' | 'in_review' | 'done'
      task_priority: 'low' | 'medium' | 'high' | 'urgent'
      org_role: 'admin' | 'member'
      org_plan: 'free' | 'pro' | 'team'
    }
  }
}
