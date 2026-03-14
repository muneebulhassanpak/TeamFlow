import { NextRequest, NextResponse } from "next/server"
import { getAuthUser, requireOrgMember, isAdmin } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/server"
import { z } from "zod"

const UpdateProjectSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i)
    .optional(),
  archived: z.boolean().optional(),
})

// PUT /api/projects/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await getAuthUser()
  if (error || !user)
    return NextResponse.json(
      { error: error ?? "Unauthorized" },
      { status: 401 }
    )

  const { id } = await params
  const body = await req.json()
  const validation = UpdateProjectSchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json(
      { error: "Invalid input", details: validation.error.issues },
      { status: 400 }
    )
  }

  const supabase = createServiceClient()

  // Get project to check org membership
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("org_id, created_by")
    .eq("id", id)
    .single()

  if (projectError || !project)
    return NextResponse.json({ error: "Project not found" }, { status: 404 })

  const { member, error: memberError } = await requireOrgMember(
    user.id,
    project.org_id
  )
  if (memberError || !member)
    return NextResponse.json({ error: memberError }, { status: 403 })

  // Only project creator or admin can update
  const canUpdate = member.role === "admin" || project.created_by === user.id
  if (!canUpdate)
    return NextResponse.json(
      { error: "Insufficient permissions" },
      { status: 403 }
    )

  const { data, error: updateError } = await supabase
    .from("projects")
    .update(validation.data)
    .eq("id", id)
    .select()
    .single()

  if (updateError)
    return NextResponse.json({ error: updateError.message }, { status: 500 })

  return NextResponse.json({ data })
}

// DELETE /api/projects/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await getAuthUser()
  if (error || !user)
    return NextResponse.json(
      { error: error ?? "Unauthorized" },
      { status: 401 }
    )

  const { id } = await params

  const supabase = createServiceClient()

  // Get project to check org membership
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("org_id, created_by")
    .eq("id", id)
    .single()

  if (projectError || !project)
    return NextResponse.json({ error: "Project not found" }, { status: 404 })

  const { member, error: memberError } = await requireOrgMember(
    user.id,
    project.org_id
  )
  if (memberError || !member)
    return NextResponse.json({ error: memberError }, { status: 403 })

  // Only admin can delete projects
  if (!isAdmin(member.role))
    return NextResponse.json(
      { error: "Only admins can delete projects" },
      { status: 403 }
    )

  const { error: deleteError } = await supabase
    .from("projects")
    .delete()
    .eq("id", id)

  if (deleteError)
    return NextResponse.json({ error: deleteError.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
