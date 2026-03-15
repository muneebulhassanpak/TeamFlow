"use client"

import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { KanbanCard } from "./kanban-card"
import { TaskRow } from "../hooks/use-tasks"
import { useKanbanColumn } from "../hooks/use-kanban-column"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

interface KanbanColumnProps {
  projectId: string
  id: "todo" | "in_progress" | "in_review" | "done"
  title: string
  tasks: TaskRow[]
  onTaskClick?: (task: TaskRow) => void
  onCreateTask?: (status: TaskRow["status"]) => void
}

export function KanbanColumn({
  id,
  title,
  tasks,
  onTaskClick,
  onCreateTask,
}: KanbanColumnProps) {
  const { taskIds, setNodeRef, isOver } = useKanbanColumn(id, tasks)

  return (
    <div className="flex h-[calc(100vh-14rem)] min-w-56 flex-1 flex-col">
      {/* Column header */}
      <div className="flex items-center justify-between px-1 py-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">{title}</h3>
          <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
            {tasks.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 text-muted-foreground"
          onClick={() => onCreateTask?.(id)}
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </div>

      {/* Cards */}
      <ScrollArea className="flex-1">
        <div
          ref={setNodeRef}
          className={`flex min-h-37.5 flex-col gap-3 pb-4 transition-colors ${
            isOver ? "rounded-xl bg-muted/50 p-2" : "px-1"
          }`}
        >
          <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <KanbanCard
                key={task.id}
                task={task}
                onClick={() => onTaskClick?.(task)}
              />
            ))}
          </SortableContext>
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  )
}
