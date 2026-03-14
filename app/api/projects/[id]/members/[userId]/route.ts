import { NextRequest, NextResponse } from "next/server"
import { getAuthUser, requireOrgMember } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/server"

// DELETE /api/projects/[id]/members/[userId]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<any> /* eslint-disable-line @typescript-eslint/no-explicit-any */ }
) {
  const { user, error } = await getAuthUser()
  if (error || !user)
    return NextResponse.json(
      { error: error ?? "Unauthorized" },
      { status: 401 }
    )

  const { id: projectId, userId } = await params

  const supabase = createServiceClient()

  // Get project to check org membership
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("org_id")
    .eq("id", projectId)
    .single()

  if (projectError || !project)
    return NextResponse.json({ error: "Project not found" }, { status: 404 })

  const { member, error: memberError } = await requireOrgMember(
    user.id,
    project.org_id
  )
  if (memberError || !member)
    return NextResponse.json({ error: memberError }, { status: 403 })

  // Check if the userId to remove is the current user (can remove themselves)
  // or if current user is project manager or org admin
  if (userId !== user.id) {
    const { data: projectMember } = await supabase
      .from("project_members")
      .select("is_manager")
      .eq("project_id", projectId)
      .eq("user_id", user.id)
      .single()

    const canRemove = member.role === "admin" || projectMember?.is_manager
    if (!canRemove)
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      )
  }

  const { error: deleteError } = await supabase
    .from("project_members")
    .delete()
    .eq("project_id", projectId)
    .eq("user_id", userId)

  if (deleteError)
    return NextResponse.json({ error: deleteError.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
