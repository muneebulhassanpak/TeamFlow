"use client"

import { useTaskRealtime, useTasks, useReorderTasks } from "@/features/tasks/hooks/use-tasks"
import { KanbanBoard } from "@/features/tasks/components/kanban-board"
import { TaskFilters } from "@/features/tasks/components/task-filters"
import { CreateTaskDialog } from "@/features/tasks/components/create-task-dialog"
import { FolderOpen } from "lucide-react"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { useQueryState, parseAsString } from "nuqs"

interface ProjectBoardViewProps {
  projectId: string
  projectName: string
}

export function ProjectBoardView({ projectId, projectName }: ProjectBoardViewProps) {
  useTaskRealtime(projectId)

  const [search] = useQueryState("search", parseAsString.withDefault(""))
  const [priority] = useQueryState("priority", parseAsString.withDefault(""))
  const [assigneeId] = useQueryState("assigneeId", parseAsString.withDefault(""))

  const {
    data: tasks = [],
    isLoading,
    error,
  } = useTasks(projectId, { search, priority, assigneeId })

  const { mutate: reorderTasks } = useReorderTasks(projectId)

  if (error) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderOpen />
          </EmptyMedia>
          <EmptyTitle>Failed to load tasks</EmptyTitle>
          <EmptyDescription>{(error as Error).message}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="flex h-full flex-col gap-6">
      {/* Header Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{projectName}</h1>
          <p className="text-sm text-muted-foreground">Manage tasks for this project</p>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex items-center justify-between">
        <TaskFilters projectId={projectId} />
        <CreateTaskDialog projectId={projectId} />
      </div>

      {/* Board Area */}
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-sm text-muted-foreground animate-pulse">Loading board...</div>
          </div>
        ) : (
          <KanbanBoard 
            projectId={projectId}
            tasks={tasks} 
            onReorder={(tasks) => reorderTasks({ 
              tasks: tasks.map(t => ({ id: t.id, status: t.status, position: t.position })) 
            })} 
          />
        )}
      </div>
    </div>
  )
}
