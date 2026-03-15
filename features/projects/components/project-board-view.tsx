"use client"

import { KanbanBoard } from "@/features/tasks/components/kanban-board"
import { TaskFilters } from "@/features/tasks/components/task-filters"
import { TaskDetailsDialog } from "@/features/tasks/components/task-details-dialog"
import { Button } from "@/components/ui/button"
import { Plus, FolderOpen } from "lucide-react"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { useProjectBoardView } from "../hooks/use-project-board-view"
import { TaskRow } from "@/features/tasks/hooks/use-tasks"

interface ProjectBoardViewProps {
  projectId: string
  projectName: string
  currentUserId: string
  currentUserRole: string
}

export function ProjectBoardView({ projectId, projectName, currentUserId, currentUserRole }: ProjectBoardViewProps) {
  const {
    tasks,
    isLoading,
    error,
    reorderTasks,
    freshSelectedTask,
    setSelectedTask,
    isNewTask,
    handleCreateTask,
    handleCloseDialog,
  } = useProjectBoardView({ projectId })

  if (error) {
    return (
      <Empty className="border rounded-xl">
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
        <Button onClick={() => handleCreateTask("todo")}>
          <Plus className="size-4" />
          New Task
        </Button>
      </div>

      {/* Board Area */}
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex h-[calc(100vh-14rem)] w-full gap-4 overflow-hidden pb-4">
            {[1, 2, 3, 4].map((colId) => (
              <div
                key={colId}
                className="flex h-full min-w-70 flex-1 shrink-0 flex-col rounded-xl border bg-muted/40 pb-2"
              >
                <div className="flex items-center justify-between p-4">
                  <Skeleton className="h-6 w-28 bg-muted-foreground/20" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-6 rounded-full bg-muted-foreground/20" />
                    <Skeleton className="h-6 w-6 rounded-full bg-muted-foreground/20" />
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-3 px-4">
                  <Skeleton className="h-30 w-full rounded-lg bg-muted-foreground/10" />
                  <Skeleton className="h-30 w-full rounded-lg bg-muted-foreground/10" />
                  {colId % 2 === 0 && (
                    <Skeleton className="h-30 w-full rounded-lg bg-muted-foreground/10" />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <KanbanBoard
            projectId={projectId}
            tasks={tasks}
            onReorder={(reorderableTasks) =>
              reorderTasks({
                tasks: reorderableTasks.map((t) => ({ id: t.id, status: t.status, position: t.position })),
              })
            }
            onTaskClick={(task: TaskRow) => setSelectedTask(task)}
            onCreateTask={handleCreateTask}
            currentUserId={currentUserId}
            currentUserRole={currentUserRole}
          />
        )}
      </div>

      <TaskDetailsDialog
        key={freshSelectedTask?.id}
        task={freshSelectedTask}
        open={!!freshSelectedTask}
        onOpenChange={(open) => !open && handleCloseDialog()}
        autoFocusTitle={isNewTask}
        currentUserId={currentUserId}
        currentUserRole={currentUserRole}
      />
    </div>
  )
}
