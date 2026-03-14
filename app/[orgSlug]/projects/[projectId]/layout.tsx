import { redirect } from "next/navigation"
import { getAuthUser, requireOrgMember } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/server"

interface ProjectLayoutProps {
  children: React.ReactNode
  params: Promise<any> /* eslint-disable-line @typescript-eslint/no-explicit-any */
}

export default async function ProjectLayout({
  children,
  params,
}: ProjectLayoutProps) {
  const { orgSlug, projectId } = await params

  // 1. Auth guard
  const { user, error } = await getAuthUser()
  if (error || !user) redirect("/login")

  // 2. Get project and check org membership
  const supabase = createServiceClient()
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("org_id, archived")
    .eq("id", projectId)
    .single()

  if (projectError || !project) redirect(`/${orgSlug}/projects`)

  const { member, error: memberError } = await requireOrgMember(
    user.id,
    project.org_id
  )
  if (memberError || !member) redirect("/login")

  // 3. Check if project is archived (only show settings for active projects)
  if (project.archived) redirect(`/${orgSlug}/projects`)

  return <>{children}</>
}
