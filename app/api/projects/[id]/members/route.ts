import { NextRequest, NextResponse } from "next/server"
import { getAuthUser, requireOrgMember } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/server"

// GET /api/projects/[id]/members
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<any> /* eslint-disable-line @typescript-eslint/no-explicit-any */ }
) {
  const { user, error } = await getAuthUser()
  if (error || !user)
    return NextResponse.json(
      { error: error ?? "Unauthorized" },
      { status: 401 }
    )

  const { id: projectId } = await params

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

  // Get project members with profile info
  const { data: projectMembers, error: membersError } = await supabase
    .from("project_members")
    .select("id, user_id, is_manager, added_at, profiles ( id, full_name, avatar_url )")
    .eq("project_id", projectId)

  if (membersError)
    return NextResponse.json({ error: membersError.message }, { status: 500 })

  // Fetch emails from auth.users (not stored in the profiles table)
  const userIds = (projectMembers ?? []).map((m) => m.user_id)
  const { data: authUsers } = await supabase.auth.admin.listUsers({
    perPage: 1000,
  })
  const emailMap = Object.fromEntries(
    (authUsers?.users ?? [])
      .filter((u) => userIds.includes(u.id))
      .map((u) => [u.id, u.email ?? ""])
  )

  const members = (projectMembers ?? []).map((m) => ({
    id: m.id,
    user_id: m.user_id,
    is_manager: m.is_manager,
    added_at: m.added_at,
    email: emailMap[m.user_id] ?? "",
    full_name: m.profiles?.full_name ?? null,
    avatar_url: m.profiles?.avatar_url ?? null,
  }))

  return NextResponse.json({ data: members })
}

// POST /api/projects/[id]/members
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<any> /* eslint-disable-line @typescript-eslint/no-explicit-any */ }
) {
  const { user, error } = await getAuthUser()
  if (error || !user)
    return NextResponse.json(
      { error: error ?? "Unauthorized" },
      { status: 401 }
    )

  const { id: projectId } = await params
  const body = await req.json()
  const { userId, isManager = false } = body

  if (!userId)
    return NextResponse.json({ error: "userId required" }, { status: 400 })

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

  // Check if userId is also an org member
  const { member: targetMember, error: targetError } = await requireOrgMember(
    userId,
    project.org_id
  )
  if (targetError || !targetMember)
    return NextResponse.json(
      { error: "User is not an org member" },
      { status: 400 }
    )

  // Check if already a project member
  const { data: existing } = await supabase
    .from("project_members")
    .select("id")
    .eq("project_id", projectId)
    .eq("user_id", userId)
    .single()

  if (existing)
    return NextResponse.json(
      { error: "User is already a project member" },
      { status: 400 }
    )

  const { data, error: insertError } = await supabase
    .from("project_members")
    .insert({
      project_id: projectId,
      user_id: userId,
      is_manager: isManager,
    })
    .select()
    .single()

  if (insertError)
    return NextResponse.json({ error: insertError.message }, { status: 500 })

  return NextResponse.json({ data })
}
