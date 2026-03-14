import { Suspense } from "react"
import { getAuthUser, requireOrgMember } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/server"
import { ProjectSettingsView } from "@/features/projects/components/project-settings-view"
import { Skeleton } from "@/components/ui/skeleton"

interface ProjectSettingsPageProps {
  params: Promise<{ orgSlug: string; projectId: string }>
}

async function ProjectSettingsContent({
  projectId,
}: {
  projectId: string
}) {
  // 1. Auth guard
  const { user, error } = await getAuthUser()
  if (error || !user) throw new Error("Unauthorized")

  // 2. Get project and check org membership
  const supabase = createServiceClient()
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select(
      `
      *,
      project_members (
        user_id,
        is_manager,
        profiles (
          id,
          email,
          full_name,
          avatar_url
        )
      )
    `
    )
    .eq("id", projectId)
    .single()

  if (projectError || !project) throw new Error("Project not found")

  const { member, error: memberError } = await requireOrgMember(
    user.id,
    project.org_id
  )
  if (memberError || !member) throw new Error("Unauthorized")

  // 3. Get available org members for adding to project
  const { data: orgMembers, error: orgMembersError } = await supabase
    .from("org_members")
    .select(
      `
      user_id,
      role,
      profiles (
        id,
        email,
        full_name,
        avatar_url
      )
    `
    )
    .eq("org_id", project.org_id)

  if (orgMembersError) throw new Error("Failed to load organization members")

  return (
    <ProjectSettingsView
      orgId={project.org_id}
      project={project}
      projectMembers={
        (project.project_members ?? []) as unknown as Parameters<
          typeof ProjectSettingsView
        >[0]["projectMembers"]
      }
      orgMembers={
        (orgMembers ?? []) as unknown as Parameters<
          typeof ProjectSettingsView
        >[0]["orgMembers"]
      }
      currentUserRole={member.role}
    />
  )
}

export default async function ProjectSettingsPage({
  params,
}: ProjectSettingsPageProps) {
  const { projectId } = await params

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Project Settings</h1>
        <p className="text-muted-foreground">
          Manage project details and team members
        </p>
      </div>

      <Suspense fallback={<ProjectSettingsSkeleton />}>
        <ProjectSettingsContent projectId={projectId} />
      </Suspense>
    </div>
  )
}

function ProjectSettingsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-80" />
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}
