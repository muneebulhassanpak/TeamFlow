"use client"

import { TaskRow } from "../hooks/use-tasks"
import { useKanbanCard } from "../hooks/use-kanban-card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  CalendarIcon,
  GripVertical,
  CheckSquare,
  MessageSquare,
} from "lucide-react"
import { priorityConfig } from "../utils"

interface KanbanCardProps {
  task: TaskRow
  onClick?: () => void
}

export function KanbanCard({ task, onClick }: KanbanCardProps) {
  const { setNodeRef, style, isDragging, attributes, listeners, initials } =
    useKanbanCard(task)

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-28 w-full rounded-md border-2 border-dashed border-primary bg-primary/5 opacity-50"
      />
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      className="group relative flex cursor-pointer flex-col gap-3 rounded-md border bg-card p-3 opacity-100 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="line-clamp-2 flex-1 text-sm leading-snug font-medium">
          {task.title}
        </p>

        <div className="mt-0.5 flex shrink-0 items-start gap-1">
          <Badge
            variant="secondary"
            className={`h-4 px-1.5 py-0 text-[10px] font-normal ${priorityConfig[task.priority].color}`}
          >
            {priorityConfig[task.priority].label}
          </Badge>
          <div
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            className="-mr-2 shrink-0 cursor-grab rounded p-0.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-accent hover:text-accent-foreground active:cursor-grabbing"
          >
            <GripVertical className="size-4" />
          </div>
        </div>
      </div>

      <div className="mt-auto flex items-end justify-between pt-2">
        <div className="flex min-h-6 items-center gap-2.5 text-xs text-muted-foreground">
          {task.due_date && (
            <span className="flex items-center gap-1">
              <CalendarIcon className="size-3.5" />
              {new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
              }).format(new Date(task.due_date))}
            </span>
          )}
          {task.subtask_count > 0 && (
            <span className="flex items-center gap-1">
              <CheckSquare className="size-3.5" />
              {task.completed_subtask_count}/{task.subtask_count}
            </span>
          )}
          {task.comment_count > 0 && (
            <span className="flex items-center gap-1">
              <MessageSquare className="size-3.5" />
              {task.comment_count}
            </span>
          )}
        </div>

        <div className="ml-auto flex items-center">
          {task.assignee ? (
            <Avatar className="size-6 border">
              <AvatarImage src={task.assignee.avatar_url ?? ""} />
              <AvatarFallback className="bg-primary/10 text-[10px] text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="flex size-6 items-center justify-center rounded-full border border-dashed bg-muted/50">
              <span className="text-[10px] text-muted-foreground">?</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
