# TeamFlow — Build Progress

Full scope: `../SCOPE.md` | Architecture rules: `CLAUDE.md`

---

## Module Status

| # | Module | Branch | Status |
|---|---|---|---|
| 0 | Foundation | `feature/foundation` | ✅ Done |
| 1 | Auth | `feature/auth` | ✅ Done |
| 2 | Onboarding | `feature/onboarding` | ✅ Done |
| 3 | App Shell (layout, sidebar, navbar) | `feature/app-shell` | ✅ Done |
| 4 | Member Management | `feature/members` | ✅ Done |
| 5 | Projects | `feature/projects` | ✅ Done |
| 6 | Tasks & Kanban | `feature/kanban` | ✅ Done |
| 7 | Task Detail | `feature/kanban` | ✅ Done |
| 8 | Activity Logs | `feature/activity` | ⬜ Not started |
| 9 | Notifications | `feature/notifications` | ⬜ Not started |
| 10 | Dashboard & My Tasks | `feature/dashboard` | ⬜ Not started |
| 11 | Landing Page | `feature/landing` | ⬜ Not started |

---

## Module 0 — Foundation ✅

- [x] All 9 DB tables created with indexes, enums, triggers, RLS policies
- [x] `org_role` enum updated: `admin | member` (no `owner`)
- [x] `profiles.is_platform_owner` added (platform owner flag for Muneeb)
- [x] `organizations.owner_id` renamed to `created_by`
- [x] Supabase browser / server / service-role / middleware clients
- [x] Root middleware — auth gate + onboarding redirect
- [x] TanStack Query provider in root layout
- [x] Centralized query key factory (`lib/query-keys.ts`)
- [x] Server-side auth helpers (`lib/auth.ts`) — `getAuthUser`, `requireOrgMember`, `isAdmin`, `isPlatformOwner`
- [x] TypeScript DB types + app-level type aliases
- [x] Feature folder structure established
- [x] `.env.local` and `.env.local.example` aligned
- [x] `typecheck` passes
- [x] `lint` passes

---

## Module 1 — Auth ✅

> `/login`, `/signup`, Google OAuth, GitHub OAuth, email verification, session handling

- [x] `(auth)` route group layout — dark bg + decorative circles, centered card
- [x] `/login` page — email/password + Google + GitHub
- [x] `/signup` page — email/password + Google + GitHub + verify email notice
- [x] `/auth/callback` route handler — OAuth + PKCE code exchange
- [x] `/auth/confirm` route handler — email OTP verification
- [x] `features/auth/components/login-form.tsx`
- [x] `features/auth/components/signup-form.tsx`
- [x] `features/auth/components/verify-email-notice.tsx`
- [x] `features/auth/hooks/use-auth.ts` — useLogin, useSignup, useSignout, useOAuth
- [x] `features/auth/validations/auth.ts` — LoginSchema, SignupSchema
- [x] `app/api/auth/signout/route.ts`
- [x] shadcn UI components: card, form, input, label, separator
- [x] Responsive + light/dark mode
- [x] `typecheck` + `lint` pass

---

## Module 2 — Onboarding ✅

> First-login multi-step wizard, profile + org creation

- [x] `/onboarding` page (full-screen, no sidebar)
- [x] Step 1: Profile (full name)
- [x] Step 2: Org setup (name, slug auto-suggest + editable with prefix decoration)
- [x] Step 3: Confirm + submit
- [x] Step progress indicator
- [x] On submit: create `profiles` + `organizations` + `org_members` (role: admin) via `POST /api/onboarding`
- [x] Set `profiles.onboarding_completed = true`
- [x] Set `profiles.default_org_slug`
- [x] Redirect to `/[slug]/dashboard` on complete
- [x] `features/onboarding/` — components, hooks, validations
- [x] Middleware skips `/api/` routes (fixed JSON parse error)
- [x] `createServiceClient` uses `@supabase/supabase-js` directly (true RLS bypass)
- [x] RLS recursion on `org_members` fixed via `SECURITY DEFINER` function
- [x] `typecheck` + `lint` pass

---

## Module 3 — App Shell ✅

> Sidebar, navbar, layout for all `[orgSlug]` routes

- [x] `app/[orgSlug]/layout.tsx` — auth guard + org membership guard + `OrgProvider`
- [x] shadcn `sidebar-04` block installed and wired up (`SidebarProvider` + `SidebarInset`)
- [x] `components/app-sidebar.tsx` — org name + initials header, nav links with active state (Dashboard, Projects, My Tasks, Members, Activity), Settings in footer
- [x] `features/app-shell/components/navbar.tsx` — `SidebarTrigger`, breadcrumb (org → current page), user avatar dropdown (profile, sign out)
- [x] `features/app-shell/context/org-context.tsx` — `OrgProvider` + `useOrg()` hook
- [x] Page stubs for all org routes (dashboard, projects, my-tasks, members, activity, settings)
- [x] shadcn UI components: avatar, badge, breadcrumb, dropdown-menu, scroll-area, sheet, sidebar, skeleton, tooltip
- [x] Mobile-responsive (sheet drawer on mobile via shadcn sidebar)
- [x] `typecheck` + `lint` pass

---

## Module 4 — Member Management ✅

> Invite flow, member list, revoke invitations, remove members

- [x] `GET /api/members` — list members with profiles + emails (service role, auth.admin.listUsers)
- [x] `DELETE /api/members` — remove member (admin only, cannot remove self)
- [x] `GET /api/invitations` — list pending non-expired invitations (admin only)
- [x] `POST /api/invitations` — create invite, checks for existing members, upserts with 7-day expiry
- [x] `DELETE /api/invitations/[id]` — revoke invitation (admin only)
- [x] `features/members/validations/members.ts` — `InviteMemberSchema`
- [x] `features/members/hooks/use-members.ts` — useMembers, useRemoveMember, useInvitations, useInviteMember, useRevokeInvitation
- [x] `MembersTable` — TanStack Table, avatar, name/email, role badge, joined date, row actions (admin only)
- [x] `InviteDialog` — email + role select, error handling
- [x] `PendingInvitations` — table with expiry + revoke action, hidden from non-admins
- [x] `MembersView` — composes all pieces, invite button hidden from non-admins
- [x] shadcn UI components: dialog, select, table
- [x] `typecheck` passes

---

## Module 5 — Projects ✅

> Project CRUD, project cards, project members, archive/delete

- [x] `/[orgSlug]/projects` — projects grid
- [x] Project card (name, color, description, member count, task counts)
- [x] Create project modal — name, description, color picker
- [x] Edit project
- [x] Archive project (toggle)
- [x] Delete project (admin only, confirmation)
- [x] `/[orgSlug]/projects/[projectId]/settings` — project settings + member management
- [x] Add/remove org members to project
- [x] `features/projects/` — components, hooks, validations, services
- [x] `typecheck` + `lint` pass

---

## Module 6 — Tasks & Kanban ✅

> Real-time Kanban board, drag-and-drop, task CRUD, filters

- [x] `/[orgSlug]/projects/[projectId]` — Kanban board page
- [x] 4 columns: Todo / In Progress / In Review / Done with equal flex widths
- [x] Task cards: title (top-left), priority badge (top-right), assignee avatar (bottom-right), due date
- [x] Drag-and-drop between columns (`@dnd-kit`) with optimistic update + batch reorder API
- [x] Supabase Realtime subscription — live board updates for all viewers
- [x] Create task dialog (title, description, priority, assignee, due date, status)
- [x] Inline "Add Task" (`+`) button in each column header — pre-selects column status
- [x] Filter bar — priority, assignee, search (URL-persisted via `nuqs`)
- [x] Skeleton loader while board data loads
- [x] `features/tasks/` — components, hooks, validations, utils
- [x] `app/api/projects/[id]/tasks/route.ts` — GET (filtered), POST
- [x] `app/api/tasks/[taskId]/route.ts` — GET, PUT, DELETE
- [x] `app/api/tasks/reorder/route.ts` — PUT (bulk position + status update)
- [x] `typecheck` + `lint` pass

---

## Module 7 — Task Detail ✅

> Task details dialog, edit, delete

- [x] `TaskDetailsDialog` — opens on card click, shows title, description, status, priority, due date, assignee
- [x] Resizable modal (expand/collapse toggle next to close button)
- [x] Properties displayed in a clean horizontal footer bar (icons + values)
- [x] Assignee pushed to extreme right of footer
- [x] Edit Task button → opens `EditTaskDialog` (pre-populated form)
- [x] Delete Task button → confirm dialog → delete + close modal
- [x] `EditTaskDialog` — full form edit (title, description, status, priority, assignee, due date)
- [x] All logic extracted into custom hooks: `use-create-task-dialog`, `use-edit-task-dialog`, `use-task-details-dialog`, `use-kanban-board`
- [x] Task components are purely presentational
- [x] `typecheck` + `lint` pass

---

## Module 8 — Activity Logs ⬜

> Org-level activity log page, paginated + filtered

- [ ] `/[orgSlug]/activity` page
- [ ] Paginated log feed (avatar, action, entity, timestamp)
- [ ] Filter by date range, actor
- [ ] Project-level activity on project settings page
- [ ] `features/activity/` — components, hooks
- [ ] `typecheck` + `lint` pass

---

## Module 9 — Notifications ⬜

> In-app bell, notification page

- [ ] Notification bell in navbar — unread count badge
- [ ] Bell dropdown — latest 10, mark as read
- [ ] `/[orgSlug]/notifications` full page — paginated, mark all read
- [ ] Create notifications on: task assigned, invite received, role changed
- [ ] `features/notifications/` — components, hooks
- [ ] `typecheck` + `lint` pass

---

## Module 10 — Dashboard & My Tasks ⬜

- [ ] `/[orgSlug]/dashboard` — summary cards + activity feed + project list
- [ ] `/[orgSlug]/my-tasks` — tasks assigned to me, grouped by project, filterable
- [ ] `features/dashboard/` — components, hooks
- [ ] `typecheck` + `lint` pass

---

## Module 11 — Landing Page ⬜

- [ ] Navbar (logo, links, CTA, theme toggle)
- [ ] Hero section (headline, CTA, visual)
- [ ] Features section
- [ ] Pricing section (Free / Pro / Team — display only)
- [ ] Footer
- [ ] Responsive + light/dark mode
- [ ] `typecheck` + `lint` pass
