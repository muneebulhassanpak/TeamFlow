import { notFound } from "next/navigation"
import { getAuthUser, requireOrgMember } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/server"
import { ProjectBoardView } from "@/features/projects/components/project-board-view"

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ orgSlug: string; projectId: string }>
}) {
  const { user, error: authError } = await getAuthUser()
  if (authError || !user) {
    throw new Error("Unauthorized")
  }

  const { orgSlug, projectId } = await params
  const supabase = createServiceClient()

  // Get org details
  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .select("id")
    .eq("slug", orgSlug)
    .single()

  if (orgError || !org) {
    notFound()
  }

  // Check membership
  const { member, error: memberError } = await requireOrgMember(user.id, org.id)
  if (memberError || !member) {
    throw new Error("Unauthorized")
  }

  // Get project to ensure it belongs to this org and hasn't been deleted
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id, name, org_id")
    .eq("id", projectId)
    .single()

  if (projectError || !project || project.org_id !== org.id) {
    notFound()
  }

  return (
    <ProjectBoardView
      projectId={project.id}
      projectName={project.name}
      currentUserId={user.id}
      currentUserRole={member.role}
    />
  )
}
