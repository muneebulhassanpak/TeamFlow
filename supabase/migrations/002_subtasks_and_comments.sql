-- ─── Subtasks ────────────────────────────────────────────────────────────────

CREATE TABLE subtasks (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id     uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  org_id      uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title       text NOT NULL,
  completed   boolean NOT NULL DEFAULT false,
  position    integer NOT NULL DEFAULT 0,
  created_by  uuid NOT NULL REFERENCES profiles(id),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX subtasks_task_id_idx ON subtasks(task_id);
CREATE INDEX subtasks_org_id_idx ON subtasks(org_id);

ALTER TABLE subtasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service role full access subtasks" ON subtasks
  USING (true) WITH CHECK (true);

-- ─── Task Comments ────────────────────────────────────────────────────────────

CREATE TABLE task_comments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id     uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  org_id      uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  author_id   uuid NOT NULL REFERENCES profiles(id),
  body        text NOT NULL,
  edited_at   timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX task_comments_task_id_idx ON task_comments(task_id);
CREATE INDEX task_comments_org_id_idx ON task_comments(org_id);

ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service role full access task_comments" ON task_comments
  USING (true) WITH CHECK (true);
