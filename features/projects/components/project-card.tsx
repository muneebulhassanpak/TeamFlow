import { useState } from "react"
import {
  MoreHorizontal,
  Users,
  CheckSquare,
  Archive,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { useOrg } from "@/features/app-shell/context/org-context"
import {
  useDeleteProject,
  useUpdateProject,
} from "@/features/projects/hooks/use-projects"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface Project {
  id: string
  name: string
  description: string | null
  color: string
  archived: boolean
  created_at: string
  updated_at: string
  created_by: string
  member_count: number
  task_count: number
}

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { org } = useOrg()
  const deleteProjectMutation = useDeleteProject(org.id)
  const updateProjectMutation = useUpdateProject(org.id)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const handleArchive = async () => {
    try {
      await updateProjectMutation.mutateAsync({
        id: project.id,
        archived: !project.archived,
      })
      toast.success(
        project.archived ? "Project unarchived" : "Project archived"
      )
    } catch (error) {
      toast.error("Failed to update project")
    }
  }

  const handleDelete = async () => {
    try {
      await deleteProjectMutation.mutateAsync(project.id)
      toast.success("Project deleted")
    } catch (error) {
      toast.error("Failed to delete project")
    }
  }

  return (
    <div className="group relative rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="size-4 rounded"
            style={{ backgroundColor: project.color }}
          />
          <Link
            href={`/${org.slug}/projects/${project.id}`}
            className="font-medium hover:underline"
          >
            {project.name}
          </Link>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/${org.slug}/projects/${project.id}/settings`}>
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleArchive}>
              <Archive className="mr-2 size-4" />
              {project.archived ? "Unarchive" : "Archive"}
            </DropdownMenuItem>
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  className="text-destructive"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Trash2 className="mr-2 size-4" />
                  Delete
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Project</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete "{project.name}"? This
                    action cannot be undone. All tasks and data associated with
                    this project will be permanently removed.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDeleteOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={deleteProjectMutation.isPending}
                  >
                    {deleteProjectMutation.isPending && (
                      <Trash2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Delete Project
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {project.description && (
        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
          {project.description}
        </p>
      )}

      <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Users className="size-4" />
          <span>{project.member_count}</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckSquare className="size-4" />
          <span>{project.task_count}</span>
        </div>
      </div>

      {project.archived && (
        <Badge variant="secondary" className="absolute top-3 right-3">
          Archived
        </Badge>
      )}
    </div>
  )
}
