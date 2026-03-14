/**
 * Centralized TanStack Query key factory.
 * All hooks reference these keys — never hard-code query keys inline.
 */

export const orgKeys = {
  all: ['organizations'] as const,
  bySlug: (slug: string) => ['organizations', slug] as const,
  members: (orgId: string, params?: Record<string, unknown>) =>
    params !== undefined
      ? (['organizations', orgId, 'members', params] as const)
      : (['organizations', orgId, 'members'] as const),
  roles: (orgId: string) => ['organizations', orgId, 'roles'] as const,
  invitations: (orgId: string) => ['organizations', orgId, 'invitations'] as const,
}

export const projectKeys = {
  all: (orgId: string, params?: Record<string, unknown>) =>
    params !== undefined
      ? (["projects", orgId, params] as const)
      : (["projects", orgId] as const),
  byId: (projectId: string) => ['projects', 'detail', projectId] as const,
  members: (projectId: string) => ['projects', projectId, 'members'] as const,
}

export const taskKeys = {
  all: (projectId: string) => ['tasks', projectId] as const,
  byId: (taskId: string) => ['tasks', 'detail', taskId] as const,
  myTasks: (userId: string) => ['tasks', 'my', userId] as const,
  activity: (taskId: string) => ['tasks', taskId, 'activity'] as const,
}

export const activityKeys = {
  org: (orgId: string) => ['activity', 'org', orgId] as const,
  project: (projectId: string) => ['activity', 'project', projectId] as const,
}

export const notificationKeys = {
  all: (userId: string) => ['notifications', userId] as const,
  unreadCount: (userId: string) => ['notifications', userId, 'unread-count'] as const,
}

export const dashboardKeys = {
  stats: (orgId: string) => ['dashboard', 'stats', orgId] as const,
}
