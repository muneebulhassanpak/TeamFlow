"use client"

import * as React from "react"
import { format } from "date-fns"
import { toast } from "sonner"
import { TaskRow, useUpdateTask } from "../hooks/use-tasks"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  CalendarIcon,
  Clock,
  Flag,
  CheckCircle2,
  User,
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
import { useProjectMembers } from "@/features/projects/hooks/use-projects"
import { DatePicker } from "@/components/shared/date-picker"

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
  const { isExpanded, setIsExpanded, initials, handleDelete } =
    useTaskDetailsDialog({ task, onOpenChange })

  const update = useUpdateTask(task?.project_id ?? "")
  const { data: members } = useProjectMembers(task?.project_id ?? "")

  // ── Inline edit state ──────────────────────────────────────────────────────
  const [editingTitle, setEditingTitle] = React.useState(false)
  const [titleValue, setTitleValue] = React.useState(task?.title ?? "")

  const [editingDesc, setEditingDesc] = React.useState(false)
  const [descValue, setDescValue] = React.useState(task?.description ?? "")

  // Sync local state when task changes from outside (optimistic or refetch)
  React.useEffect(() => {
    if (!editingTitle) setTitleValue(task?.title ?? "")
  }, [task?.title, editingTitle])

  React.useEffect(() => {
    if (!editingDesc) setDescValue(task?.description ?? "")
  }, [task?.description, editingDesc])

  // ── Save helpers ───────────────────────────────────────────────────────────
  function saveTitle() {
    const trimmed = titleValue.trim()
    if (!trimmed) {
      setTitleValue(task!.title)
      setEditingTitle(false)
      return
    }
    if (trimmed === task!.title) {
      setEditingTitle(false)
      return
    }
    update.mutate(
      { taskId: task!.id, title: trimmed },
      {
        onSuccess: () => setEditingTitle(false),
        onError: (err) => {
          toast.error(err.message || "Failed to update title")
          setTitleValue(task!.title)
          setEditingTitle(false)
        },
      }
    )
  }

  function cancelTitle() {
    setTitleValue(task!.title)
    setEditingTitle(false)
  }

  function saveDesc() {
    const trimmed = descValue.trim()
    const current = task!.description ?? ""
    if (trimmed === current) {
      setEditingDesc(false)
      return
    }
    update.mutate(
      { taskId: task!.id, description: trimmed || null },
      {
        onSuccess: () => setEditingDesc(false),
        onError: (err) => {
          toast.error(err.message || "Failed to update description")
          setDescValue(current)
          setEditingDesc(false)
        },
      }
    )
  }

  function cancelDesc() {
    setDescValue(task!.description ?? "")
    setEditingDesc(false)
  }

  function updateField(patch: Parameters<typeof update.mutate>[0]) {
    update.mutate(patch, {
      onError: (err) => toast.error(err.message || "Failed to update task"),
    })
  }

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
                  disabled={update.isPending}
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
              <div className="flex flex-col overflow-hidden rounded-lg border text-sm">
                <div className="flex flex-col sm:flex-row">
                  {/* Status */}
                  <div className="flex items-center gap-3 border-b px-3 py-2">
                    <div className="flex w-24 shrink-0 items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="size-3.5 shrink-0" />
                      <span>Status</span>
                    </div>
                    <Select
                      value={task.status}
                      onValueChange={(v) =>
                        updateField({
                          taskId: task.id,
                          status: v as TaskRow["status"],
                        })
                      }
                    >
                      <SelectTrigger className="h-auto border-none bg-transparent p-0 text-sm shadow-none focus:ring-0 [&>svg]:ml-1 [&>svg]:opacity-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="in_review">In Review</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Priority */}
                  <div className="flex items-center gap-3 border-b px-3 py-2">
                    <div className="flex w-24 shrink-0 items-center gap-2 text-xs text-muted-foreground">
                      <Flag className="size-3.5 shrink-0" />
                      <span>Priority</span>
                    </div>
                    <Select
                      value={task.priority}
                      onValueChange={(v) =>
                        updateField({
                          taskId: task.id,
                          priority: v as TaskRow["priority"],
                        })
                      }
                    >
                      <SelectTrigger className="h-auto border-none bg-transparent p-0 shadow-none focus:ring-0 [&>svg]:ml-1 [&>svg]:opacity-40">
                        <Badge
                          variant="outline"
                          className={cn(
                            "pointer-events-none font-normal",
                            priorityConfig[task.priority].color
                          )}
                        >
                          {priorityConfig[task.priority].label}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row">
                  {/* Due Date */}
                  <div className="flex items-center gap-3 border-b px-3 py-2">
                    <div className="flex w-24 shrink-0 items-center gap-2 text-xs text-muted-foreground">
                      <CalendarIcon className="size-3.5 shrink-0" />
                      <span>Due date</span>
                    </div>
                    <DatePicker
                      value={
                        task.due_date ? new Date(task.due_date) : undefined
                      }
                      onChange={(d) =>
                        updateField({
                          taskId: task.id,
                          due_date: d ? d.toISOString().split("T")[0] : null,
                        })
                      }
                      placeholder="No due date"
                      className="h-auto border-none bg-transparent px-0 text-sm font-normal shadow-none hover:bg-transparent [&>svg]:hidden"
                    />
                  </div>

                  {/* Assignee */}
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="flex w-24 shrink-0 items-center gap-2 text-xs text-muted-foreground">
                      <User className="size-3.5 shrink-0" />
                      <span>Assignee</span>
                    </div>
                    <Select
                      value={task.assignee_id ?? "unassigned"}
                      onValueChange={(v) =>
                        updateField({
                          taskId: task.id,
                          assignee_id: v === "unassigned" ? null : v,
                        })
                      }
                    >
                      <SelectTrigger className="h-auto border-none bg-transparent p-0 shadow-none focus:ring-0 [&>svg]:ml-1 [&>svg]:opacity-40">
                        {task.assignee ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-5 w-5 border">
                              <AvatarImage
                                src={task.assignee.avatar_url ?? ""}
                              />
                              <AvatarFallback className="bg-primary/10 text-[9px] text-primary">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <span>{task.assignee.full_name || "Unknown"}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">
                            Unassigned
                          </span>
                        )}
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
                </div>
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
                  disabled={update.isPending}
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
