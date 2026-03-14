import { useState } from "react"
import { toast } from "sonner"
import { useOrg } from "@/features/app-shell/context/org-context"
import {
  useDeleteProject,
  useUpdateProject,
  type ProjectRow,
} from "@/features/projects/hooks/use-projects"

export function useProjectsTable() {
  const { org, role } = useOrg()
  const isAdmin = role === "admin"
  
  const deleteProjectMutation = useDeleteProject(org.id)
  const updateProjectMutation = useUpdateProject(org.id)

  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null)

  const handleArchive = async (project: ProjectRow) => {
    try {
      await updateProjectMutation.mutateAsync({
        id: project.id,
        archived: !project.archived,
      })
      toast.success(
        project.archived ? "Project unarchived" : "Project archived"
      )
    } catch (_error) {
      toast.error("Failed to update project")
    }
  }

  const handleDelete = async () => {
    if (!deleteProjectId) return
    try {
      await deleteProjectMutation.mutateAsync(deleteProjectId)
      toast.success("Project deleted")
      setDeleteProjectId(null)
    } catch (_error) {
      toast.error("Failed to delete project")
    }
  }

  return {
    org,
    isAdmin,
    deleteProjectId,
    setDeleteProjectId,
    isDeleting: deleteProjectMutation.isPending,
    handleArchive,
    handleDelete,
  }
}
