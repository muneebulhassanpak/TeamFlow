import type { TaskWithProject } from './hooks/use-dashboard'

export interface TaskGroup {
  projectId: string
  projectName: string
  projectColor: string
  tasks: TaskWithProject[]
}

export function groupTasksByProject(tasks: TaskWithProject[]): TaskGroup[] {
  const map = new Map<string, TaskGroup>()

  for (const task of tasks) {
    const projectId = task.project_id
    const existing = map.get(projectId)
    if (existing) {
      existing.tasks.push(task)
    } else {
      map.set(projectId, {
        projectId,
        projectName: task.project?.name ?? 'Unknown Project',
        projectColor: task.project?.color ?? '#6366f1',
        tasks: [task],
      })
    }
  }

  return Array.from(map.values())
}

export const PRIORITY_COLORS: Record<string, string> = {
  urgent: 'text-red-500',
  high: 'text-orange-500',
  medium: 'text-yellow-500',
  low: 'text-blue-400',
}

export const STATUS_LABELS: Record<string, string> = {
  todo: 'Todo',
  in_progress: 'In Progress',
  in_review: 'In Review',
  done: 'Done',
}
