"use client"

import { KanbanBoard } from "@/features/tasks/components/kanban-board"
import { TaskFilters } from "@/features/tasks/components/task-filters"
import { TaskDetailsDialog } from "@/features/tasks/components/task-details-dialog"
import { QuickTaskTitleDialog } from "@/features/tasks/components/quick-task-title-dialog"
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
    pendingCreateStatus,
    handleCreateTask,
    handleQuickSubmit,
    handleQuickCancel,
    handleCloseDialog,
  } = useProjectBoardView({ projectId, projectName })

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
      {/* Filters + Action */}
      <div className="flex items-center gap-4">
        <TaskFilters projectId={projectId} />
        <Button className="ml-auto shrink-0" onClick={() => handleCreateTask("todo")}>
          <Plus className="size-4" />
          New Task
        </Button>
      </div>

      {/* Board Area */}
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex h-[calc(100vh-14rem)] w-full gap-4 overflow-hidden pb-4">
            {[1, 2, 3, 4].map((colId) => (
              <div key={colId} className="flex w-72 shrink-0 flex-col">
                <div className="flex items-center gap-2 px-1 py-3">
                  <Skeleton className="h-4 w-20 bg-muted-foreground/20" />
                  <Skeleton className="h-4 w-5 rounded-md bg-muted-foreground/20" />
                </div>
                <div className="flex flex-1 flex-col gap-3 px-1">
                  <Skeleton className="h-24 w-full rounded-xl bg-muted-foreground/10" />
                  <Skeleton className="h-24 w-full rounded-xl bg-muted-foreground/10" />
                  {colId % 2 === 0 && (
                    <Skeleton className="h-24 w-full rounded-xl bg-muted-foreground/10" />
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

      <QuickTaskTitleDialog
        open={!!pendingCreateStatus}
        onSubmit={handleQuickSubmit}
        onCancel={handleQuickCancel}
      />

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
