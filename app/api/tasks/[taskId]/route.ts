import { NextRequest, NextResponse } from "next/server"
import { getAuthUser, requireOrgMember } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/server"
import { UpdateTaskSchema } from "@/features/tasks/validations/tasks"

// PUT /api/tasks/[taskId]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<any> /* eslint-disable-line @typescript-eslint/no-explicit-any */ }
) {
  const { user, error: authError } = await getAuthUser()
  if (authError || !user) {
    return NextResponse.json({ error: authError ?? "Unauthorized" }, { status: 401 })
  }

  const { taskId } = await params
  const body = await req.json()
  
  const validation = UpdateTaskSchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json(
      { error: "Invalid input", details: validation.error.issues },
      { status: 400 }
    )
  }

  const supabase = createServiceClient()

  // First verify task exists and user has access to its org
  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .select("org_id, project_id, title")
    .eq("id", taskId)
    .single()

  if (taskError || !task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 })
  }

  const { member, error: memberError } = await requireOrgMember(user.id, task.org_id)
  if (memberError || !member) {
    return NextResponse.json({ error: memberError }, { status: 403 })
  }

  // Update task
  const { data: updatedTask, error: updateError } = await supabase
    .from("tasks")
    .update({
      ...validation.data,
      updated_at: new Date().toISOString()
    })
    .eq("id", taskId)
    .select()
    .single()

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  // Log activity
  await supabase.from("activity_logs").insert({
    org_id: task.org_id,
    project_id: task.project_id,
    task_id: taskId,
    actor_id: user.id,
    action: "task.updated",
    entity_type: "task",
    entity_id: taskId,
    meta: { title: validation.data.title ?? task.title, updates: validation.data }
  })

  return NextResponse.json({ data: updatedTask })
}

// DELETE /api/tasks/[taskId]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<any> /* eslint-disable-line @typescript-eslint/no-explicit-any */ }
) {
  const { user, error: authError } = await getAuthUser()
  if (authError || !user) {
    return NextResponse.json({ error: authError ?? "Unauthorized" }, { status: 401 })
  }

  const { taskId } = await params
  const supabase = createServiceClient()

  // First verify task exists and user has access to its org
  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .select("org_id, project_id, title, created_by")
    .eq("id", taskId)
    .single()

  if (taskError || !task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 })
  }

  const { member, error: memberError } = await requireOrgMember(user.id, task.org_id)
  if (memberError || !member) {
    return NextResponse.json({ error: memberError }, { status: 403 })
  }

  // Only project admin or task creator can delete
  const canDelete = member.role === "admin" || task.created_by === user.id
  if (!canDelete) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
  }

  const { error: deleteError } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId)

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 })
  }

  // Log activity
  await supabase.from("activity_logs").insert({
    org_id: task.org_id,
    project_id: task.project_id,
    actor_id: user.id,
    action: "task.deleted",
    entity_type: "task",
    entity_id: taskId,
    meta: { title: task.title }
  })

  return NextResponse.json({ success: true })
}
