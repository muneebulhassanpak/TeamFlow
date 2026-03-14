import type { SupabaseClient } from "@supabase/supabase-js"
import type { QueryData } from "@supabase/supabase-js"
import type { Database } from "@/types/database.types"

// ─── Query shape functions ────────────────────────────────────────────────────
// Never called at runtime. Used only so TypeScript can infer the exact return
// types of joined Supabase queries via QueryData<ReturnType<...>>.
//
// Note: `email` is intentionally absent from all profiles selects.
// It is stored in auth.users, not in the profiles table.
// Email is merged in at the page/route-handler level via auth.admin.listUsers.

function _buildProjectWithMembersQuery(db: SupabaseClient<Database>) {
  return db
    .from("projects")
    .select(
      "id, name, description, color, org_id, archived, created_at, updated_at, project_members ( user_id, is_manager, profiles ( id, full_name, avatar_url ) )"
    )
    .eq("id", "")
    .single()
}

function _buildOrgMembersQuery(db: SupabaseClient<Database>) {
  return db
    .from("org_members")
    .select("user_id, role, profiles ( id, full_name, avatar_url )")
    .eq("org_id", "")
}

function _buildProjectMembersQuery(db: SupabaseClient<Database>) {
  return db
    .from("project_members")
    .select("id, user_id, is_manager, added_at, profiles ( id, full_name, avatar_url )")
    .eq("project_id", "")
}

// ─── Inferred types ───────────────────────────────────────────────────────────

export type ProjectWithMembers = QueryData<
  ReturnType<typeof _buildProjectWithMembersQuery>
>

export type OrgMemberRow = QueryData<
  ReturnType<typeof _buildOrgMembersQuery>
>[number]

export type ProjectMemberRow = QueryData<
  ReturnType<typeof _buildProjectMembersQuery>
>[number]

// ─── Narrowed types for components ───────────────────────────────────────────
// Profiles are guaranteed non-null (filtered at the page level).
// Email is merged in from auth.users (also at the page level).

export type ProjectSettingsMember =
  ProjectWithMembers["project_members"][number] & {
    profiles: NonNullable<
      ProjectWithMembers["project_members"][number]["profiles"]
    >
    email: string
  }

export type OrgSettingsMember = OrgMemberRow & {
  profiles: NonNullable<OrgMemberRow["profiles"]>
  email: string
}

// ─── Type guard ───────────────────────────────────────────────────────────────

export function hasProfile<T extends { profiles: unknown }>(
  m: T
): m is T & { profiles: NonNullable<T["profiles"]> } {
  return m.profiles !== null
}
