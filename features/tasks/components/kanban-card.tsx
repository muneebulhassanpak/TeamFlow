"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { TaskRow } from "../hooks/use-tasks"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarIcon, GripVertical } from "lucide-react"

interface KanbanCardProps {
  task: TaskRow
  onClick?: () => void
}

const priorityColors = {
  low: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  urgent: "border-red-500 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
}

export function KanbanCard({ task, onClick }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-28 w-full rounded-md border-2 border-primary border-dashed bg-primary/5 opacity-50"
      />
    )
  }

  const initials = task.assignee?.full_name
    ? task.assignee.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : task.assignee?.email.charAt(0).toUpperCase() ?? "?"

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      className={`group relative flex flex-col gap-3 rounded-md border bg-card p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
        isDragging ? "opacity-30" : "opacity-100"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <Badge variant="secondary" className={`font-normal ${priorityColors[task.priority]}`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </Badge>
        
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab opacity-0 group-hover:opacity-100 transition-opacity active:cursor-grabbing p-1 -mr-2 -mt-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded"
        >
          <GripVertical className="size-4" />
        </div>
      </div>

      <p className="text-sm font-medium line-clamp-2 leading-snug">{task.title}</p>

      <div className="mt-auto flex items-center justify-between pt-1">
        <div className="flex items-center text-xs text-muted-foreground">
          {task.due_date && (
            <>
              <CalendarIcon className="mr-1.5 size-3.5" />
              <span>
                {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(task.due_date))}
              </span>
            </>
          )}
        </div>
        
        {task.assignee && (
          <Avatar className="size-6 border">
            <AvatarImage src={task.assignee.avatar_url ?? ""} />
            <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  )
}
