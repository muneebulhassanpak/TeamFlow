"use client"

import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { KanbanCard } from "./kanban-card"
import { TaskRow } from "../hooks/use-tasks"
import { useKanbanColumn } from "../hooks/use-kanban-column"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Plus } from "lucide-react"
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
    <div className="flex h-[calc(100vh-14rem)] flex-1 shrink-0 flex-col rounded-xl border bg-muted/40 pb-2">
      <div className="flex items-center justify-between p-4">
        <h3 className="font-semibold">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="flex size-5 items-center justify-center rounded-full bg-muted-foreground/20 text-xs font-medium text-foreground">
            {tasks.length}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full text-muted-foreground hover:bg-muted-foreground/20"
            onClick={() => onCreateTask?.(id)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div
          ref={setNodeRef}
          className={`flex min-h-37.5 flex-col gap-3 pb-4 transition-colors ${
            isOver ? "-m-2 mb-2 rounded-lg bg-accent/50 p-2" : ""
          }`}
        >
          <SortableContext
            items={taskIds}
            strategy={verticalListSortingStrategy}
          >
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
