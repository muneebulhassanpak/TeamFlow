import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { projectKeys } from "@/lib/query-keys"
import { CreateProjectInput, UpdateProjectInput } from "../validations/projects"

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useProjects(orgId: string) {
  return useQuery({
    queryKey: projectKeys.all(orgId),
    queryFn: async () => {
      const res = await fetch(`/api/projects?orgId=${orgId}`)
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error ?? "Failed to fetch projects")
      }
      const json = await res.json()
      return json.data as Array<{
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
      }>
    },
  })
}

export function useProjectMembers(projectId: string) {
  return useQuery({
    queryKey: projectKeys.members(projectId),
    queryFn: async () => {
      const res = await fetch(`/api/projects/${projectId}/members`)
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error ?? "Failed to fetch project members")
      }
      const json = await res.json()
      return json.data as Array<{
        id: string
        user_id: string
        is_manager: boolean
        added_at: string
        email: string
        full_name: string | null
        avatar_url: string | null
      }>
    },
  })
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateProject(orgId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateProjectInput) => {
      const res = await fetch(`/api/projects?orgId=${orgId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error ?? "Failed to create project")
      }
      const json = await res.json()
      return json.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all(orgId) })
    },
  })
}

export function useUpdateProject(orgId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      ...input
    }: UpdateProjectInput & { id: string }) => {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error ?? "Failed to update project")
      }
      const json = await res.json()
      return json.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all(orgId) })
    },
  })
}

export function useDeleteProject(orgId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error ?? "Failed to delete project")
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all(orgId) })
    },
  })
}

export function useAddProjectMember(projectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      userId,
      isManager = false,
    }: {
      userId: string
      isManager?: boolean
    }) => {
      const res = await fetch(`/api/projects/${projectId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isManager }),
      })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error ?? "Failed to add project member")
      }
      const json = await res.json()
      return json.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.members(projectId),
      })
    },
  })
}

export function useRemoveProjectMember(projectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await fetch(
        `/api/projects/${projectId}/members/${userId}`,
        { method: "DELETE" }
      )
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error ?? "Failed to remove project member")
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.members(projectId),
      })
    },
  })
}
