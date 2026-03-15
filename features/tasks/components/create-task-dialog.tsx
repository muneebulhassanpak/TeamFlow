"use client"

import { Plus, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePicker } from "@/components/shared/date-picker"
import { cn } from "@/lib/utils"
import { priorityConfig } from "../utils"
import { useCreateTaskDialog } from "../hooks/use-create-task-dialog"

interface CreateTaskDialogProps {
  projectId: string
  children?: React.ReactNode
  defaultStatus?: "todo" | "in_progress" | "in_review" | "done"
}

export function CreateTaskDialog({ projectId, children, defaultStatus }: CreateTaskDialogProps) {
  const {
    open,
    setOpen,
    form,
    members,
    isLoadingMembers,
    isSubmitting,
    priority,
    onSubmit,
  } = useCreateTaskDialog({ projectId, defaultStatus })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ?? (
          <Button>
            <Plus className="size-4" />
            New Task
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="flex flex-col gap-0 overflow-hidden p-0 sm:max-w-150 [&>button:last-child]:hidden">
        <DialogTitle className="sr-only">Create Task</DialogTitle>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 px-6 py-5">

            {/* Title */}
            <FormField
              control={form.control as any} // eslint-disable-line @typescript-eslint/no-explicit-any
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      autoFocus
                      placeholder="Task title…"
                      {...field}
                      className="h-auto rounded-md border-none bg-muted/50 px-2 py-1 text-2xl font-bold leading-snug tracking-tight shadow-none focus-visible:ring-0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Properties grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Status</span>
                <Select
                  value={form.watch("status") ?? "todo"}
                  onValueChange={(v) => form.setValue("status", v as "todo" | "in_progress" | "in_review" | "done")}
                >
                  <SelectTrigger className="w-full">
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

              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Priority</span>
                <Select
                  value={priority}
                  onValueChange={(v) => form.setValue("priority", v as "low" | "medium" | "high" | "urgent")}
                >
                  <SelectTrigger className={cn("w-full", priorityConfig[priority].color)}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Due Date</span>
                <DatePicker
                  value={form.watch("due_date") ? new Date(form.watch("due_date")!) : undefined}
                  onChange={(d) => form.setValue("due_date", d ? d.toISOString().split("T")[0] : null)}
                  placeholder="No due date"
                  className="font-normal"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Assignee</span>
                <Select
                  value={form.watch("assignee_id") ?? "unassigned"}
                  onValueChange={(v) => form.setValue("assignee_id", v === "unassigned" ? null : v)}
                  disabled={isLoadingMembers}
                >
                  <SelectTrigger className="w-full">
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
            </div>

            <div className="border-t" />

            {/* Description */}
            <FormField
              control={form.control as any} // eslint-disable-line @typescript-eslint/no-explicit-any
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Add a description…"
                      className="min-h-20 resize-none rounded-md border-none bg-muted/50 px-2 py-1.5 text-sm shadow-none focus-visible:ring-0"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
                Create Task
              </Button>
            </DialogFooter>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
