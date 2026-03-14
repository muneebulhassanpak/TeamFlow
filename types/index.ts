import type { Database } from './database.types'

// ─── Row type aliases ─────────────────────────────────────────────────────────

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Organization = Database['public']['Tables']['organizations']['Row']
export type OrgMember = Database['public']['Tables']['org_members']['Row']
export type Invitation = Database['public']['Tables']['invitations']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
export type ProjectMember = Database['public']['Tables']['project_members']['Row']
export type Task = Database['public']['Tables']['tasks']['Row']
export type ActivityLog = Database['public']['Tables']['activity_logs']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']

// ─── Enum aliases ─────────────────────────────────────────────────────────────

export type TaskStatus = Database['public']['Enums']['task_status']
export type TaskPriority = Database['public']['Enums']['task_priority']
// org_role: 'admin' = org creator (auto-assigned on signup), 'member' = invited user
export type OrgRole = Database['public']['Enums']['org_role']
export type OrgPlan = Database['public']['Enums']['org_plan']

// ─── Enriched types (joins) ───────────────────────────────────────────────────

export type OrgMemberWithProfile = OrgMember & {
  profile: Pick<Profile, 'id' | 'full_name' | 'avatar_url'>
  email: string
}

export type TaskWithAssignee = Task & {
  assignee: Pick<Profile, 'id' | 'full_name' | 'avatar_url'> | null
}

export type ProjectWithStats = Project & {
  member_count: number
  task_counts: { todo: number; in_progress: number; in_review: number; done: number }
}

export type ActivityLogWithActor = ActivityLog & {
  actor: Pick<Profile, 'id' | 'full_name' | 'avatar_url'>
}

// ─── API response wrappers ────────────────────────────────────────────────────

export type ApiResponse<T> =
  | { data: T; error: null }
  | { data: null; error: string }

export type PaginatedResponse<T> = {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// ─── Misc ─────────────────────────────────────────────────────────────────────

export type KanbanColumn = {
  id: TaskStatus
  label: string
  tasks: TaskWithAssignee[]
}

export type SessionUser = {
  id: string
  email: string
}
