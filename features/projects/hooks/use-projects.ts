import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
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

export function useCreateProject(orgId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateProjectInput) => {
      const supabase = createClient()

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        throw new Error("Unable to determine current user")
      }

      const { data, error } = await supabase
        .from("projects")
        .insert({
          name: input.name,
          description: input.description || null,
          color: input.color,
          org_id: orgId,
          created_by: user.id,
        })
        .select()
        .single()

      if (error) throw error
      return data
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
      const supabase = createClient()
      const { data, error } = await supabase
        .from("projects")
        .update(input)
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data
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
      const supabase = createClient()
      const { error } = await supabase.from("projects").delete().eq("id", id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all(orgId) })
    },
  })
}

export function useProjectMembers(projectId: string) {
  return useQuery({
    queryKey: projectKeys.members(projectId),
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("project_members")
        .select(
          `
          id,
          user_id,
          is_manager,
          added_at,
          profiles(id, full_name, avatar_url)
        `
        )
        .eq("project_id", projectId)

      if (error) throw error

      // Get emails from auth
      const userIds = data?.map((m) => m.user_id) ?? []
      const { data: authUsers } = await supabase.auth.admin.listUsers({
        perPage: 1000,
      })
      const emailMap = Object.fromEntries(
        (authUsers?.users ?? [])
          .filter((u) => userIds.includes(u.id))
          .map((u) => [u.id, u.email])
      )

      return (
        data?.map((m) => ({
          id: m.id,
          user_id: m.user_id,
          is_manager: m.is_manager,
          added_at: m.added_at,
          email: emailMap[m.user_id] ?? "",
          full_name:
            (m.profiles as { full_name: string | null } | null)?.full_name ??
            null,
          avatar_url:
            (m.profiles as { avatar_url: string | null } | null)?.avatar_url ??
            null,
        })) ?? []
      )
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
      const supabase = createClient()
      const { data, error } = await supabase
        .from("project_members")
        .insert({
          project_id: projectId,
          user_id: userId,
          is_manager: isManager,
        })
        .select()
        .single()

      if (error) throw error
      return data
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
      const supabase = createClient()
      const { error } = await supabase
        .from("project_members")
        .delete()
        .eq("project_id", projectId)
        .eq("user_id", userId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.members(projectId),
      })
    },
  })
}
