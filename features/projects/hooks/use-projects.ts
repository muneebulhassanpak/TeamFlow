import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { projectKeys } from "@/lib/query-keys"
import { CreateProjectInput, UpdateProjectInput } from "../validations/projects"
import { keepPreviousData } from "@tanstack/react-query"

export interface ProjectRow {
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

export interface ProjectsQueryParams {
  search?: string
  page?: number
  pageSize?: number
  sortBy?: "name" | "created_at"
  sortDir?: "asc" | "desc"
}

export interface ProjectsResponse {
  data: ProjectRow[]
  total: number
  page: number
  pageSize: number
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useProjects(orgId: string, params: ProjectsQueryParams = {}) {
  const {
    search = "",
    page = 1,
    pageSize = 10,
    sortBy = "created_at",
    sortDir = "desc",
  } = params

  return useQuery({
    queryKey: projectKeys.all(orgId, { search, page, pageSize, sortBy, sortDir }),
    queryFn: async (): Promise<ProjectsResponse> => {
      const url = new URL("/api/projects", window.location.origin)
      url.searchParams.set("orgId", orgId)
      if (search) url.searchParams.set("search", search)
      url.searchParams.set("page", String(page))
      url.searchParams.set("pageSize", String(pageSize))
      url.searchParams.set("sortBy", sortBy)
      url.searchParams.set("sortDir", sortDir)
      
      const res = await fetch(url.toString())
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Failed to fetch projects")
      return json
    },
    enabled: !!orgId,
    placeholderData: keepPreviousData,
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
