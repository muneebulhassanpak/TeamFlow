import { NextRequest, NextResponse } from "next/server"
import { getAuthUser, requireOrgMember } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/server"
import { CreateTaskSchema } from "@/features/tasks/validations/tasks"

// GET /api/projects/[projectId]/tasks
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<any> /* eslint-disable-line @typescript-eslint/no-explicit-any */ }
) {
  const { user, error: authError } = await getAuthUser()
  if (authError || !user) {
    return NextResponse.json({ error: authError ?? "Unauthorized" }, { status: 401 })
  }

  const { id: projectId } = await params
  
  const searchParams = req.nextUrl.searchParams
  const priority = searchParams.get("priority")
  const assigneeId = searchParams.get("assigneeId")
  const status = searchParams.get("status")
  const search = searchParams.get("search")

  const supabase = createServiceClient()

  // First verify project exists and user has access to its org
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("org_id")
    .eq("id", projectId)
    .single()

  if (projectError || !project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }

  const { member, error: memberError } = await requireOrgMember(user.id, project.org_id)
  if (memberError || !member) {
    return NextResponse.json({ error: memberError }, { status: 403 })
  }

  // Build the query
  let query = supabase
    .from("tasks")
    .select(`
      *,
      assignee:profiles!tasks_assignee_id_fkey(id, full_name, avatar_url)
    `)
    .eq("project_id", projectId)
    .order("position", { ascending: true })

  // Apply filters
  if (priority) {
    query = query.eq("priority", priority as "low" | "medium" | "high" | "urgent")
  }
  if (assigneeId) {
    query = query.eq("assignee_id", assigneeId)
  }
  if (status) {
    query = query.eq("status", status as "todo" | "in_progress" | "in_review" | "done")
  }
  if (search) {
    query = query.ilike("title", `%${search}%`)
  }

  const { data: tasks, error: tasksError } = await query

  if (tasksError) {
    return NextResponse.json({ error: tasksError.message }, { status: 500 })
  }

  if (!tasks || tasks.length === 0) {
    return NextResponse.json({ data: [] })
  }

  // Fetch subtask and comment counts in two batch queries
  const taskIds = tasks.map((t) => t.id)

  const [{ data: subtaskRows }, { data: commentRows }] = await Promise.all([
    supabase.from('subtasks').select('task_id, completed').in('task_id', taskIds),
    supabase.from('task_comments').select('task_id').in('task_id', taskIds),
  ])

  const subtaskCountMap = new Map<string, { total: number; completed: number }>()
  for (const row of subtaskRows ?? []) {
    const entry = subtaskCountMap.get(row.task_id) ?? { total: 0, completed: 0 }
    entry.total++
    if (row.completed) entry.completed++
    subtaskCountMap.set(row.task_id, entry)
  }

  const commentCountMap = new Map<string, number>()
  for (const row of commentRows ?? []) {
    commentCountMap.set(row.task_id, (commentCountMap.get(row.task_id) ?? 0) + 1)
  }

  const enriched = tasks.map((t) => ({
    ...t,
    subtask_count: subtaskCountMap.get(t.id)?.total ?? 0,
    completed_subtask_count: subtaskCountMap.get(t.id)?.completed ?? 0,
    comment_count: commentCountMap.get(t.id) ?? 0,
  }))

  return NextResponse.json({ data: enriched })
}

// POST /api/projects/[projectId]/tasks
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<any> /* eslint-disable-line @typescript-eslint/no-explicit-any */ }
) {
  const { user, error: authError } = await getAuthUser()
  if (authError || !user) {
    return NextResponse.json({ error: authError ?? "Unauthorized" }, { status: 401 })
  }

  const { id: projectId } = await params
  const body = await req.json()
  
  const validation = CreateTaskSchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json(
      { error: "Invalid input", details: validation.error.issues },
      { status: 400 }
    )
  }

  const supabase = createServiceClient()

  // Verify project and access
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("org_id")
    .eq("id", projectId)
    .single()

  if (projectError || !project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }

  const { member, error: memberError } = await requireOrgMember(user.id, project.org_id)
  if (memberError || !member) {
    return NextResponse.json({ error: memberError }, { status: 403 })
  }

  // Setup positional logic - default appending to the bottom
  const { data: maxPositionTask } = await supabase
    .from("tasks")
    .select("position")
    .eq("project_id", projectId)
    .eq("status", validation.data.status)
    .order("position", { ascending: false })
    .limit(1)
    .single()

  const newPosition = maxPositionTask ? maxPositionTask.position + 1024 : 1024

  const { data: task, error: createError } = await supabase
    .from("tasks")
    .insert({
      title: validation.data.title,
      description: validation.data.description ?? null,
      priority: validation.data.priority,
      status: validation.data.status,
      assignee_id: validation.data.assignee_id ?? null,
      due_date: validation.data.due_date ?? null,
      position: newPosition,
      project_id: projectId,
      org_id: project.org_id,
      created_by: user.id
    })
    .select()
    .single()

  if (createError) {
    return NextResponse.json({ error: createError.message }, { status: 500 })
  }

  // Also record activity log for task creation
  await supabase.from("activity_logs").insert({
    org_id: project.org_id,
    project_id: projectId,
    task_id: task.id,
    actor_id: user.id,
    action: "task.created",
    entity_type: "task",
    entity_id: task.id,
    meta: { title: task.title }
  })

  // Increment project task count
  // We can do an RPC or just let an RPC do it, but for our MVP, we don't strictly need accurate counts without a trigger.
  // Actually, we could be updating project counts directly, but let's assume we won't right now unless needed.

  return NextResponse.json({ data: task }, { status: 201 })
}
