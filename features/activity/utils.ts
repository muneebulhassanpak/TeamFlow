import { formatDistanceToNow } from 'date-fns'

export function formatActivityAction(action: string, meta: Record<string, unknown> | null): string {
  switch (action) {
    case 'task.created':
      return `created task "${meta?.title ?? 'a task'}"`
    case 'task.updated':
      return `updated task "${meta?.title ?? 'a task'}"`
    case 'task.deleted':
      return `deleted task "${meta?.title ?? 'a task'}"`
    case 'project.created':
      return `created project "${meta?.name ?? 'a project'}"`
    case 'project.updated':
      return `updated project "${meta?.name ?? 'a project'}"`
    case 'project.archived':
      return `archived project "${meta?.name ?? 'a project'}"`
    case 'project.deleted':
      return `deleted project "${meta?.name ?? 'a project'}"`
    case 'member.removed':
      return `removed a member from the workspace`
    default:
      return action
  }
}

export function formatRelativeTime(date: string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}
