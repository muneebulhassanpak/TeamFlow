-- ============================================================
-- TeamFlow — Initial Schema
-- Run this in your Supabase SQL editor or via Supabase CLI
-- ============================================================

-- ─── Extensions ───────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ─── Enums ────────────────────────────────────────────────────────────────────
create type org_role   as enum ('owner', 'admin', 'member');
create type org_plan   as enum ('free', 'pro', 'team');
create type task_status   as enum ('todo', 'in_progress', 'in_review', 'done');
create type task_priority as enum ('low', 'medium', 'high', 'urgent');

-- ─── profiles ────────────────────────────────────────────────────────────────
-- One row per auth.users row. Auto-created via trigger.
create table profiles (
  id                   uuid primary key references auth.users(id) on delete cascade,
  full_name            text,
  avatar_url           text,
  onboarding_completed boolean   not null default false,
  default_org_slug     text,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ─── organizations ────────────────────────────────────────────────────────────
create table organizations (
  id         uuid primary key default uuid_generate_v4(),
  name       text        not null,
  slug       text        not null unique,
  logo_url   text,
  plan       org_plan    not null default 'free',
  owner_id   uuid        not null references profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_organizations_slug on organizations(slug);
create index idx_organizations_owner on organizations(owner_id);

-- ─── org_members ──────────────────────────────────────────────────────────────
create table org_members (
  id        uuid primary key default uuid_generate_v4(),
  org_id    uuid     not null references organizations(id) on delete cascade,
  user_id   uuid     not null references profiles(id) on delete cascade,
  role      org_role not null default 'member',
  joined_at timestamptz not null default now(),
  unique (org_id, user_id)
);

create index idx_org_members_org  on org_members(org_id);
create index idx_org_members_user on org_members(user_id);

-- ─── invitations ──────────────────────────────────────────────────────────────
create table invitations (
  id          uuid primary key default uuid_generate_v4(),
  org_id      uuid        not null references organizations(id) on delete cascade,
  email       text        not null,
  role        org_role    not null default 'member',
  token       text        not null unique default encode(gen_random_bytes(32), 'hex'),
  invited_by  uuid        not null references profiles(id) on delete cascade,
  expires_at  timestamptz not null default (now() + interval '72 hours'),
  accepted_at timestamptz,
  created_at  timestamptz not null default now(),
  unique (org_id, email)
);

create index idx_invitations_token  on invitations(token);
create index idx_invitations_org    on invitations(org_id);
create index idx_invitations_email  on invitations(email);

-- ─── projects ─────────────────────────────────────────────────────────────────
create table projects (
  id          uuid primary key default uuid_generate_v4(),
  org_id      uuid    not null references organizations(id) on delete cascade,
  name        text    not null,
  description text,
  color       text    not null default '#6366f1',
  archived    boolean not null default false,
  created_by  uuid    not null references profiles(id) on delete restrict,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_projects_org on projects(org_id);

-- ─── project_members ──────────────────────────────────────────────────────────
create table project_members (
  id         uuid primary key default uuid_generate_v4(),
  project_id uuid    not null references projects(id) on delete cascade,
  user_id    uuid    not null references profiles(id) on delete cascade,
  is_manager boolean not null default false,
  added_at   timestamptz not null default now(),
  unique (project_id, user_id)
);

create index idx_project_members_project on project_members(project_id);
create index idx_project_members_user    on project_members(user_id);

-- ─── tasks ────────────────────────────────────────────────────────────────────
create table tasks (
  id          uuid          primary key default uuid_generate_v4(),
  project_id  uuid          not null references projects(id) on delete cascade,
  org_id      uuid          not null references organizations(id) on delete cascade,
  title       text          not null,
  description text,
  status      task_status   not null default 'todo',
  priority    task_priority not null default 'medium',
  assignee_id uuid          references profiles(id) on delete set null,
  due_date    date,
  position    integer       not null default 0,
  created_by  uuid          not null references profiles(id) on delete restrict,
  created_at  timestamptz   not null default now(),
  updated_at  timestamptz   not null default now()
);

create index idx_tasks_project    on tasks(project_id);
create index idx_tasks_org        on tasks(org_id);
create index idx_tasks_assignee   on tasks(assignee_id);
create index idx_tasks_status     on tasks(status);

-- ─── activity_logs ────────────────────────────────────────────────────────────
create table activity_logs (
  id          uuid primary key default uuid_generate_v4(),
  org_id      uuid not null references organizations(id) on delete cascade,
  project_id  uuid references projects(id) on delete cascade,
  task_id     uuid references tasks(id) on delete cascade,
  actor_id    uuid not null references profiles(id) on delete cascade,
  action      text not null,   -- e.g. 'task.created', 'task.status_changed'
  entity_type text not null,   -- e.g. 'task', 'project', 'member'
  entity_id   text not null,
  meta        jsonb,
  created_at  timestamptz not null default now()
);

create index idx_activity_org     on activity_logs(org_id);
create index idx_activity_project on activity_logs(project_id);
create index idx_activity_task    on activity_logs(task_id);
create index idx_activity_actor   on activity_logs(actor_id);
create index idx_activity_created on activity_logs(created_at desc);

-- ─── notifications ────────────────────────────────────────────────────────────
create table notifications (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid    not null references profiles(id) on delete cascade,
  org_id     uuid    not null references organizations(id) on delete cascade,
  type       text    not null,  -- e.g. 'task_assigned', 'invite_accepted'
  title      text    not null,
  body       text,
  link       text,
  read       boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_notifications_user    on notifications(user_id);
create index idx_notifications_unread  on notifications(user_id, read) where read = false;

-- ─── updated_at trigger ───────────────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at      before update on profiles      for each row execute procedure set_updated_at();
create trigger set_organizations_updated_at before update on organizations  for each row execute procedure set_updated_at();
create trigger set_projects_updated_at      before update on projects       for each row execute procedure set_updated_at();
create trigger set_tasks_updated_at         before update on tasks          for each row execute procedure set_updated_at();

-- ─── Minimal RLS (tenant isolation backstop) ─────────────────────────────────
-- These are safety-net policies only.
-- All real permission checks happen in Next.js API route handlers.

alter table profiles      enable row level security;
alter table organizations enable row level security;
alter table org_members   enable row level security;
alter table invitations   enable row level security;
alter table projects      enable row level security;
alter table project_members enable row level security;
alter table tasks         enable row level security;
alter table activity_logs enable row level security;
alter table notifications enable row level security;

-- profiles: users can read/update only their own profile
create policy "profiles: own row" on profiles
  using (id = auth.uid());

-- org_members: users can only see memberships for orgs they belong to
create policy "org_members: own orgs" on org_members
  using (
    org_id in (
      select org_id from org_members where user_id = auth.uid()
    )
  );

-- organizations: readable by members
create policy "organizations: member read" on organizations
  using (
    id in (
      select org_id from org_members where user_id = auth.uid()
    )
  );

-- projects: readable by org members
create policy "projects: org member read" on projects
  using (
    org_id in (
      select org_id from org_members where user_id = auth.uid()
    )
  );

-- tasks: readable by org members
create policy "tasks: org member read" on tasks
  using (
    org_id in (
      select org_id from org_members where user_id = auth.uid()
    )
  );

-- notifications: users see only their own
create policy "notifications: own" on notifications
  using (user_id = auth.uid());

-- activity_logs: org members can read their org's logs
create policy "activity: org member read" on activity_logs
  using (
    org_id in (
      select org_id from org_members where user_id = auth.uid()
    )
  );

-- invitations: org admins/owners can see invitations for their org
create policy "invitations: org member read" on invitations
  using (
    org_id in (
      select org_id from org_members where user_id = auth.uid()
    )
  );

-- project_members: readable by org members
create policy "project_members: org member read" on project_members
  using (
    project_id in (
      select p.id from projects p
      join org_members om on om.org_id = p.org_id
      where om.user_id = auth.uid()
    )
  );
