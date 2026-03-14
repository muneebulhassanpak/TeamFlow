import { NextRequest, NextResponse } from "next/server"
import { getAuthUser, requireOrgMember } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/server"
import { z } from "zod"

const CreateProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i),
})

// GET /api/projects?orgId=xxx
export async function GET(req: NextRequest) {
  const { user, error } = await getAuthUser()
  if (error || !user)
    return NextResponse.json(
      { error: error ?? "Unauthorized" },
      { status: 401 }
    )

  const orgId = req.nextUrl.searchParams.get("orgId")
  if (!orgId)
    return NextResponse.json({ error: "orgId required" }, { status: 400 })

  const search = req.nextUrl.searchParams.get("search") || ""
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10)
  const pageSize = parseInt(req.nextUrl.searchParams.get("pageSize") || "10", 10)
  const sortBy = req.nextUrl.searchParams.get("sortBy") || "created_at"
  const sortDir = req.nextUrl.searchParams.get("sortDir") === "asc" ? "asc" : "desc"

  const { member, error: memberError } = await requireOrgMember(user.id, orgId)
  if (memberError || !member)
    return NextResponse.json({ error: memberError }, { status: 403 })

  const supabase = createServiceClient()

  let query = supabase
    .from("projects")
    .select(
      `
      id,
      name,
      description,
      color,
      archived,
      created_at,
      updated_at,
      created_by,
      project_members(count),
      tasks(count)
    `,
      { count: "exact" }
    )
    .eq("org_id", orgId)
    .eq("archived", false)

  if (search) {
    query = query.ilike("name", `%${search}%`)
  }

  // Sorting
  query = query.order(sortBy, { ascending: sortDir === "asc" })

  // Pagination
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  query = query.range(from, to)

  const { data: projects, error: projectsError, count } = await query

  if (projectsError)
    return NextResponse.json({ error: projectsError.message }, { status: 500 })

  // Transform the data to include counts
  const transformedProjects =
    projects?.map((project) => ({
      id: project.id,
      name: project.name,
      description: project.description,
      color: project.color,
      archived: project.archived,
      created_at: project.created_at,
      updated_at: project.updated_at,
      created_by: project.created_by,
      member_count: Array.isArray(project.project_members)
        ? project.project_members.length
        : 0,
      task_count: Array.isArray(project.tasks) ? project.tasks.length : 0,
    })) ?? []

  return NextResponse.json({
    data: transformedProjects,
    total: count ?? 0,
    page,
    pageSize,
  })
}

// POST /api/projects
export async function POST(req: NextRequest) {
  const { user, error } = await getAuthUser()
  if (error || !user)
    return NextResponse.json(
      { error: error ?? "Unauthorized" },
      { status: 401 }
    )

  const body = await req.json()
  const validation = CreateProjectSchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json(
      { error: "Invalid input", details: validation.error.issues },
      { status: 400 }
    )
  }

  const orgId = req.nextUrl.searchParams.get("orgId")
  if (!orgId)
    return NextResponse.json({ error: "orgId required" }, { status: 400 })

  const { member, error: memberError } = await requireOrgMember(user.id, orgId)
  if (memberError || !member)
    return NextResponse.json({ error: memberError }, { status: 403 })

  const supabase = createServiceClient()

  const { data, error: insertError } = await supabase
    .from("projects")
    .insert({
      name: validation.data.name,
      description: validation.data.description || null,
      color: validation.data.color,
      org_id: orgId,
      created_by: user.id,
    })
    .select()
    .single()

  if (insertError)
    return NextResponse.json({ error: insertError.message }, { status: 500 })

  return NextResponse.json({ data })
}
