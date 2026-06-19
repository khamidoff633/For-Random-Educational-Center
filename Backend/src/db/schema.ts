/**
 * PostgreSQL schema as a string constant (single source of truth).
 *
 * Kept in code rather than a separate .sql file so it bundles reliably with
 * esbuild for production and needs no filesystem lookup at runtime. Applied on
 * first boot when DATABASE_URL is set. Safe to run repeatedly (IF NOT EXISTS).
 */
export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS settings (
  id          TEXT PRIMARY KEY DEFAULT 'singleton',
  data        JSONB NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS teachers (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  specialty   TEXT NOT NULL DEFAULT '',
  slogan      TEXT NOT NULL DEFAULT '',
  bio         TEXT NOT NULL DEFAULT '',
  image       TEXT NOT NULL DEFAULT '',
  experience  TEXT NOT NULL DEFAULT '',
  phone       TEXT NOT NULL DEFAULT '',
  gender      TEXT NOT NULL DEFAULT 'erkak',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS courses (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  category    TEXT NOT NULL DEFAULT 'General',
  description TEXT NOT NULL DEFAULT '',
  duration    TEXT NOT NULL DEFAULT '',
  price       TEXT NOT NULL DEFAULT '',
  teacher_id  TEXT NOT NULL DEFAULT '',
  days        TEXT NOT NULL DEFAULT '',
  time        TEXT NOT NULL DEFAULT '',
  image       TEXT NOT NULL DEFAULT '',
  capacity    INTEGER NOT NULL DEFAULT 12,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS leads (
  id           TEXT PRIMARY KEY,
  student_name TEXT NOT NULL,
  phone        TEXT NOT NULL,
  course_id    TEXT NOT NULL DEFAULT '',
  status       TEXT NOT NULL DEFAULT 'yangi',
  notes        TEXT NOT NULL DEFAULT '',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS leads_status_idx ON leads (status);
CREATE INDEX IF NOT EXISTS leads_created_idx ON leads (created_at DESC);

CREATE TABLE IF NOT EXISTS student_results (
  id                TEXT PRIMARY KEY,
  student_name      TEXT NOT NULL,
  score             TEXT NOT NULL DEFAULT '',
  exam_type         TEXT NOT NULL DEFAULT 'IELTS',
  image             TEXT NOT NULL DEFAULT '',
  certificate_image TEXT NOT NULL DEFAULT '',
  description       TEXT NOT NULL DEFAULT '',
  course_name       TEXT NOT NULL DEFAULT '',
  achievement_date  TEXT NOT NULL DEFAULT '',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_users (
  id             TEXT PRIMARY KEY DEFAULT 'admin',
  email          TEXT NOT NULL,
  password_hash  TEXT NOT NULL,
  otp_hash       TEXT,
  otp_expires_at BIGINT,
  otp_attempts   INTEGER NOT NULL DEFAULT 0
);
`;
