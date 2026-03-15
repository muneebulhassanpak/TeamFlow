"use client"

import { KanbanColumn } from "./kanban-column"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core"
import { KanbanCard } from "./kanban-card"
import { TaskRow } from "../hooks/use-tasks"
import { useKanbanBoard } from "../hooks/use-kanban-board"

type ColumnType = "todo" | "in_progress" | "in_review" | "done"

const COLUMNS: { id: ColumnType; title: string }[] = [
  { id: "todo", title: "To Do" },
  { id: "in_progress", title: "In Progress" },
  { id: "in_review", title: "In Review" },
  { id: "done", title: "Done" },
]

interface KanbanBoardProps {
  projectId: string
  tasks: TaskRow[]
  onReorder: (tasks: TaskRow[]) => void
  onTaskClick: (task: TaskRow) => void
  onCreateTask: (status: TaskRow["status"]) => void
  currentUserId: string
  currentUserRole: string
}

export function KanbanBoard({
  projectId,
  tasks: initialTasks,
  onReorder,
  onTaskClick,
  onCreateTask,
}: KanbanBoardProps) {
  const {
    tasks,
    activeTask,
    sensors,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useKanbanBoard({ tasks: initialTasks, onReorder })

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full w-full gap-8 overflow-x-auto pb-4">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            projectId={projectId}
            id={col.id}
            title={col.title}
            tasks={tasks.filter((t) => t.status === col.id)}
            onTaskClick={onTaskClick}
            onCreateTask={onCreateTask}
          />
        ))}
      </div>

      <DragOverlay
        dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({
            styles: { active: { opacity: "0.4" } },
          }),
        }}
      >
        {activeTask ? <KanbanCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
