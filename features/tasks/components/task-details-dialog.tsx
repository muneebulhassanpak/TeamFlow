"use client"

import * as React from "react"
import { format } from "date-fns"
import { TaskRow } from "../hooks/use-tasks"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Clock,
  LayoutList,
  Maximize,
  Minimize,
  Trash2,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { priorityConfig } from "../utils"
import { useTaskDetailsDialog } from "../hooks/use-task-details-dialog"
import { SubtaskList } from "./subtask-list"
import { CommentList } from "./comment-list"
import { CommentInput } from "./comment-input"
import { DatePicker } from "@/components/shared/date-picker"
import { useTaskDetailsContent } from "../hooks/use-task-details-content"

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
  const { isExpanded, setIsExpanded, handleDelete } =
    useTaskDetailsDialog({ task, onOpenChange })

  const {
    members,
    isUpdating,
    editingTitle,
    setEditingTitle,
    titleValue,
    setTitleValue,
    saveTitle,
    cancelTitle,
    editingDesc,
    setEditingDesc,
    descValue,
    setDescValue,
    saveDesc,
    cancelDesc,
    updateField,
  } = useTaskDetailsContent(task)

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
        <div className="flex shrink-0 items-center justify-between border-b px-3 py-2">
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

        {/* Two-column layout */}
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* ── Left panel ── */}
          <div className="flex min-w-0 flex-col border-r" style={{ flex: "2" }}>
            <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-6">
              {/* Title */}
              {editingTitle ? (
                <Input
                  autoFocus
                  value={titleValue}
                  onChange={(e) => setTitleValue(e.target.value)}
                  onBlur={saveTitle}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      saveTitle()
                    }
                    if (e.key === "Escape") {
                      e.preventDefault()
                      cancelTitle()
                    }
                  }}
                  className="h-auto border-none px-0 text-2xl leading-snug font-semibold tracking-tight shadow-none focus-visible:ring-0"
                  disabled={isUpdating}
                />
              ) : (
                <DialogTitle
                  onClick={() => setEditingTitle(true)}
                  className="-mx-1 cursor-text rounded px-1 text-2xl leading-snug font-semibold tracking-tight text-foreground transition-colors hover:bg-muted/40"
                >
                  {task.title}
                </DialogTitle>
              )}

              {/* Properties */}
              <div className="flex items-center gap-2 text-sm">
                {/* Status */}
                <Select
                  value={task.status}
                  onValueChange={(v) => updateField({ taskId: task.id, status: v as TaskRow["status"] })}
                >
                  <SelectTrigger className="h-7 gap-1 rounded-md border bg-transparent px-2 text-xs shadow-none focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="in_review">In Review</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>

                {/* Priority */}
                <Select
                  value={task.priority}
                  onValueChange={(v) => updateField({ taskId: task.id, priority: v as TaskRow["priority"] })}
                >
                  <SelectTrigger className={cn("h-7 gap-1 rounded-md border px-2 text-xs shadow-none focus:ring-0", priorityConfig[task.priority].color)}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>

                {/* Due Date */}
                <DatePicker
                  value={task.due_date ? new Date(task.due_date) : undefined}
                  onChange={(d) => updateField({ taskId: task.id, due_date: d ? d.toISOString().split("T")[0] : null })}
                  placeholder="No due date"
                  className="h-7 w-auto rounded-md border px-2 text-xs font-normal shadow-none hover:bg-transparent"
                />

                {/* Assignee */}
                <Select
                  value={task.assignee_id ?? "unassigned"}
                  onValueChange={(v) => updateField({ taskId: task.id, assignee_id: v === "unassigned" ? null : v })}
                >
                  <SelectTrigger className="h-7 gap-1 rounded-md border bg-transparent px-2 text-xs shadow-none focus:ring-0">
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {members?.map((m) => (
                      <SelectItem key={m.user_id} value={m.user_id}>
                        {m.full_name || m.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              {editingDesc ? (
                <Textarea
                  autoFocus
                  value={descValue}
                  onChange={(e) => setDescValue(e.target.value)}
                  onBlur={saveDesc}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      e.preventDefault()
                      cancelDesc()
                    }
                  }}
                  placeholder="Add a description…"
                  className="min-h-20 resize-none border-none px-0 text-sm shadow-none focus-visible:ring-0"
                  disabled={isUpdating}
                />
              ) : (
                <div
                  onClick={() => setEditingDesc(true)}
                  className="-mx-1 cursor-text rounded px-1 py-1 transition-colors hover:bg-muted/40"
                >
                  {task.description ? (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/80">
                      {task.description}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Add a description…
                    </p>
                  )}
                </div>
              )}

              {/* Subtasks */}
              <SubtaskList taskId={task.id} />
            </div>
          </div>

          {/* ── Right panel — Comments ── */}
          <div className="flex min-w-0 flex-col" style={{ flex: "1" }}>
            <div className="shrink-0 border-b px-4 py-3">
              <p className="text-sm font-medium">Comments</p>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <CommentList
                taskId={task.id}
                currentUserId={currentUserId}
                currentUserRole={currentUserRole}
              />
            </div>
            <div className="shrink-0 border-t px-4 py-3">
              <CommentInput taskId={task.id} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
