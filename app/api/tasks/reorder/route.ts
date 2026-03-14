import { NextRequest, NextResponse } from "next/server"
import { getAuthUser, requireOrgMember } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/server"
import { ReorderTasksSchema } from "@/features/tasks/validations/tasks"

// PUT /api/tasks/reorder
export async function PUT(req: NextRequest) {
  const { user, error: authError } = await getAuthUser()
  if (authError || !user) {
    return NextResponse.json({ error: authError ?? "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const validation = ReorderTasksSchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json(
      { error: "Invalid input", details: validation.error.issues },
      { status: 400 }
    )
  }

  const { tasks: items } = validation.data
  const supabase = createServiceClient()

  // Verify access by checking the first task's org_id
  const { data: firstTask, error: firstTaskError } = await supabase
    .from("tasks")
    .select("org_id")
    .eq("id", items[0].id)
    .single()

  if (firstTaskError || !firstTask) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 })
  }

  const { member, error: memberError } = await requireOrgMember(user.id, firstTask.org_id)
  if (memberError || !member) {
    return NextResponse.json({ error: memberError }, { status: 403 })
  }

  // Update all tasks in parallel
  const updatePromises = items.map((item) => {
    return supabase
      .from("tasks")
      .update({
        status: item.status,
        position: item.position,
        updated_at: new Date().toISOString()
      })
      .eq("id", item.id)
  })

  const results = await Promise.allSettled(updatePromises)
  const failedCount = results.filter(
    (r) => r.status === "rejected" || (r.status === "fulfilled" && r.value.error)
  ).length

  if (failedCount > 0) {
    return NextResponse.json(
      { error: `Failed to completely reorder tasks. ${failedCount} errors occurred.` },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true, message: `Reordered ${items.length} tasks` })
}
