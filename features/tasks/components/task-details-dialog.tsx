"use client"

import { format } from "date-fns"
import { TaskRow } from "../hooks/use-tasks"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  CalendarIcon,
  Clock,
  Flag,
  CheckCircle2,
  User,
  LayoutList,
  Maximize,
  Minimize,
  Edit2,
  Trash2,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { priorityConfig, statusLabels } from "../utils"
import { useTaskDetailsDialog } from "../hooks/use-task-details-dialog"
import { EditTaskDialog } from "./edit-task-dialog"
import { SubtaskList } from "./subtask-list"
import { CommentList } from "./comment-list"
import { CommentInput } from "./comment-input"

interface TaskDetailsDialogProps {
  task: TaskRow | null
  open: boolean
  onOpenChange: (open: boolean) => void
  currentUserId: string
  currentUserRole: string
}

export function TaskDetailsDialog({
  task,
  open,
  onOpenChange,
  currentUserId,
  currentUserRole,
}: TaskDetailsDialogProps) {
  const {
    isExpanded,
    setIsExpanded,
    isEditDialogOpen,
    setIsEditDialogOpen,
    initials,
    handleDelete,
  } = useTaskDetailsDialog({ task, onOpenChange })

  if (!task) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "flex h-[85vh] flex-col gap-0 overflow-hidden border-muted p-0 transition-all duration-300 [&>button:last-child]:hidden",
          isExpanded ? "sm:max-w-275" : "sm:max-w-225"
        )}
      >
        <div className="sr-only">
          <DialogDescription>Task details for {task.title}</DialogDescription>
        </div>

        {/* Shared top bar */}
        <div className="flex shrink-0 items-center justify-between gap-1 border-b px-3 py-2">
          {/* Meta: type + date */}
          <div className="flex items-center gap-2 px-1.5 text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5 tracking-wider uppercase">
              <LayoutList className="h-3.5 w-3.5" /> Task
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              Created {format(new Date(task.created_at), "MMM d, yyyy")}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground"
              onClick={() => setIsEditDialogOpen(true)}
              title="Edit Task"
            >
              <Edit2 className="size-3.5" />
              <span className="sr-only">Edit Task</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              onClick={handleDelete}
              title="Delete Task"
            >
              <Trash2 className="size-3.5" />
              <span className="sr-only">Delete Task</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground"
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? (
                <Minimize className="size-3.5" />
              ) : (
                <Maximize className="size-3.5" />
              )}
              <span className="sr-only">
                {isExpanded ? "Collapse" : "Expand"}
              </span>
            </Button>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-7 text-muted-foreground"
              >
                <X className="size-3.5" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogClose>
          </div>
        </div>

        {/* Two-column layout — takes remaining height */}
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* ── Left panel (2/3) ── */}
          <div className="flex min-w-0 flex-col border-r" style={{ flex: "2" }}>
            {/* Scrollable content */}
            <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-8">
              {/* Title */}
              <DialogTitle className="text-2xl leading-snug font-semibold tracking-tight text-foreground">
                {task.title}
              </DialogTitle>

              {/* Description */}
              <div>
                {task.description ? (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/80">
                    {task.description}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No description provided.
                  </p>
                )}
              </div>

              {/* Subtasks */}
              <SubtaskList taskId={task.id} />
            </div>

            {/* Properties footer */}
            <div className="flex shrink-0 flex-wrap items-center gap-6 border-t bg-muted/30 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {statusLabels[task.status]}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Flag className="h-4 w-4 text-muted-foreground" />
                <Badge
                  variant="outline"
                  className={`font-normal ${priorityConfig[task.priority].color}`}
                >
                  {priorityConfig[task.priority].label}
                </Badge>
              </div>
              <div className="flex items-center gap-2.5">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {task.due_date ? (
                    format(new Date(task.due_date), "MMM d, yyyy")
                  ) : (
                    <span className="font-normal text-muted-foreground">
                      No due date
                    </span>
                  )}
                </span>
              </div>
              <div className="ml-auto flex items-center gap-2.5">
                <User className="h-4 w-4 text-muted-foreground" />
                {task.assignee ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5 border">
                      <AvatarImage src={task.assignee.avatar_url ?? ""} />
                      <AvatarFallback className="bg-primary/10 text-[9px] text-primary">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">
                      {task.assignee.full_name || "Unknown"}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Unassigned
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ── Right panel (1/3) — Comments ── */}
          <div className="flex min-w-0 flex-col" style={{ flex: "1" }}>
            {/* Panel header */}
            <div className="shrink-0 border-b px-4 py-3">
              <p className="text-sm font-medium">Comments</p>
            </div>

            {/* Scrollable comment list */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <CommentList
                taskId={task.id}
                currentUserId={currentUserId}
                currentUserRole={currentUserRole}
              />
            </div>

            {/* Pinned comment input */}
            <div className="shrink-0 border-t px-4 py-3">
              <CommentInput taskId={task.id} />
            </div>
          </div>
        </div>
      </DialogContent>

      <EditTaskDialog
        task={task}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </Dialog>
  )
}
