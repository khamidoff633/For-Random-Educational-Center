/**
 * PostgreSQL repository (production target).
 *
 * The `pg` driver is imported dynamically and only when DATABASE_URL is set,
 * so the project builds and runs without it in environments where Postgres is
 * not configured (e.g. local/sandbox file-store mode).
 *
 * To enable on your server:
 *   1. npm install pg
 *   2. set DATABASE_URL=postgres://user:pass@host:5432/dbname
 */
import { env } from "../config/env";
import { buildSeedDatabase } from "./seed";
import { SCHEMA_SQL } from "./schema";
import type { Repository } from "./repository";
import type {
  AdminUser,
  Course,
  Lead,
  SchoolSettings,
  StudentResultItem,
  Teacher,
} from "../models/types";

/* eslint-disable @typescript-eslint/no-explicit-any */
type PgPool = {
  query: (text: string, params?: any[]) => Promise<{ rows: any[]; rowCount: number }>;
  end: () => Promise<void>;
};

export class PostgresRepository implements Repository {
  private pool!: PgPool;

  async init(): Promise<void> {
    // Dynamic specifier prevents the bundler/type-checker from requiring `pg`
    // at build time; it is only loaded when this code path actually runs.
    const moduleName = "pg";
    const pg: any = await import(moduleName);
    const Pool = pg.Pool ?? pg.default?.Pool;
    this.pool = new Pool({ connectionString: env.databaseUrl });

    await this.pool.query(SCHEMA_SQL);

    await this.seedIfEmpty();
  }

  private async seedIfEmpty(): Promise<void> {
    const { rows } = await this.pool.query("SELECT COUNT(*)::int AS n FROM admin_users");
    if (rows[0]?.n > 0) return;

    const seed = buildSeedDatabase();
    await this.pool.query(
      "INSERT INTO settings (id, data) VALUES ('singleton', $1) ON CONFLICT (id) DO NOTHING",
      [JSON.stringify(seed.settings)]
    );
    await this.pool.query(
      `INSERT INTO admin_users (id, email, password_hash, totp_secret, totp_enabled)
       VALUES ('admin', $1, $2, NULL, false) ON CONFLICT (id) DO NOTHING`,
      [seed.admin.email, seed.admin.passwordHash]
    );
    for (const t of seed.teachers) await this.createTeacher(t);
    for (const c of seed.courses) await this.createCourse(c);
    for (const l of seed.leads) await this.createLead(l);
    for (const r of seed.studentResults) await this.createResult(r);
  }

  // ---- Settings ----------------------------------------------------------
  async getSettings(): Promise<SchoolSettings> {
    const { rows } = await this.pool.query("SELECT data FROM settings WHERE id = 'singleton'");
    return (rows[0]?.data as SchoolSettings) ?? buildSeedDatabase().settings;
  }

  async updateSettings(patch: Partial<SchoolSettings>): Promise<SchoolSettings> {
    const current = await this.getSettings();
    const next = { ...current, ...patch };
    await this.pool.query(
      `INSERT INTO settings (id, data, updated_at) VALUES ('singleton', $1, now())
       ON CONFLICT (id) DO UPDATE SET data = $1, updated_at = now()`,
      [JSON.stringify(next)]
    );
    return next;
  }

  // ---- Teachers ----------------------------------------------------------
  private mapTeacher = (r: any): Teacher => ({
    id: r.id,
    name: r.name,
    specialty: r.specialty,
    slogan: r.slogan,
    bio: r.bio,
    image: r.image,
    experience: r.experience,
    phone: r.phone,
    gender: r.gender,
  });

  async listTeachers(): Promise<Teacher[]> {
    const { rows } = await this.pool.query("SELECT * FROM teachers ORDER BY created_at");
    return rows.map(this.mapTeacher);
  }

  async createTeacher(t: Teacher): Promise<Teacher> {
    await this.pool.query(
      `INSERT INTO teachers (id, name, specialty, slogan, bio, image, experience, phone, gender)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [t.id, t.name, t.specialty, t.slogan ?? "", t.bio, t.image, t.experience, t.phone, t.gender ?? "erkak"]
    );
    return t;
  }

  async updateTeacher(id: string, patch: Partial<Teacher>): Promise<Teacher | null> {
    const { rows } = await this.pool.query("SELECT * FROM teachers WHERE id = $1", [id]);
    if (!rows[0]) return null;
    const next = { ...this.mapTeacher(rows[0]), ...patch, id };
    await this.pool.query(
      `UPDATE teachers SET name=$2, specialty=$3, slogan=$4, bio=$5, image=$6, experience=$7, phone=$8, gender=$9 WHERE id=$1`,
      [id, next.name, next.specialty, next.slogan ?? "", next.bio, next.image, next.experience, next.phone, next.gender ?? "erkak"]
    );
    return next;
  }

  async deleteTeacher(id: string): Promise<boolean> {
    const { rowCount } = await this.pool.query("DELETE FROM teachers WHERE id = $1", [id]);
    return rowCount > 0;
  }

  // ---- Courses -----------------------------------------------------------
  private mapCourse = (r: any): Course => ({
    id: r.id,
    name: r.name,
    category: r.category,
    description: r.description,
    duration: r.duration,
    price: r.price,
    teacherId: r.teacher_id,
    days: r.days,
    time: r.time,
    image: r.image,
    capacity: r.capacity,
  });

  async listCourses(): Promise<Course[]> {
    const { rows } = await this.pool.query("SELECT * FROM courses ORDER BY created_at");
    return rows.map(this.mapCourse);
  }

  async createCourse(c: Course): Promise<Course> {
    await this.pool.query(
      `INSERT INTO courses (id, name, category, description, duration, price, teacher_id, days, time, image, capacity)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [c.id, c.name, c.category, c.description, c.duration, c.price, c.teacherId, c.days, c.time, c.image, c.capacity]
    );
    return c;
  }

  async updateCourse(id: string, patch: Partial<Course>): Promise<Course | null> {
    const { rows } = await this.pool.query("SELECT * FROM courses WHERE id = $1", [id]);
    if (!rows[0]) return null;
    const next = { ...this.mapCourse(rows[0]), ...patch, id };
    await this.pool.query(
      `UPDATE courses SET name=$2, category=$3, description=$4, duration=$5, price=$6, teacher_id=$7, days=$8, time=$9, image=$10, capacity=$11 WHERE id=$1`,
      [id, next.name, next.category, next.description, next.duration, next.price, next.teacherId, next.days, next.time, next.image, next.capacity]
    );
    return next;
  }

  async deleteCourse(id: string): Promise<boolean> {
    const { rowCount } = await this.pool.query("DELETE FROM courses WHERE id = $1", [id]);
    return rowCount > 0;
  }

  // ---- Leads -------------------------------------------------------------
  private mapLead = (r: any): Lead => ({
    id: r.id,
    studentName: r.student_name,
    phone: r.phone,
    courseId: r.course_id,
    status: r.status,
    notes: r.notes,
    seen: r.seen,
    verified: r.verified,
    verifiedAt:
      r.verified_at instanceof Date ? r.verified_at.toISOString() : r.verified_at ?? null,
    createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : r.created_at,
  });

  async listLeads(): Promise<Lead[]> {
    const { rows } = await this.pool.query("SELECT * FROM leads ORDER BY created_at DESC");
    return rows.map(this.mapLead);
  }

  async createLead(l: Lead): Promise<Lead> {
    await this.pool.query(
      `INSERT INTO leads (id, student_name, phone, course_id, status, notes, seen, verified, verified_at, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [l.id, l.studentName, l.phone, l.courseId, l.status, l.notes, l.seen ?? false, l.verified ?? false, l.verifiedAt ?? null, l.createdAt]
    );
    return l;
  }

  async updateLead(id: string, patch: Partial<Lead>): Promise<Lead | null> {
    const { rows } = await this.pool.query("SELECT * FROM leads WHERE id = $1", [id]);
    if (!rows[0]) return null;
    const next = { ...this.mapLead(rows[0]), ...patch, id };
    await this.pool.query(
      `UPDATE leads SET student_name=$2, phone=$3, course_id=$4, status=$5, notes=$6, seen=$7, verified=$8, verified_at=$9 WHERE id=$1`,
      [id, next.studentName, next.phone, next.courseId, next.status, next.notes, next.seen ?? false, next.verified ?? false, next.verifiedAt ?? null]
    );
    return next;
  }

  async deleteLead(id: string): Promise<boolean> {
    const { rowCount } = await this.pool.query("DELETE FROM leads WHERE id = $1", [id]);
    return rowCount > 0;
  }

  // ---- Student results ---------------------------------------------------
  private mapResult = (r: any): StudentResultItem => ({
    id: r.id,
    studentName: r.student_name,
    score: r.score,
    examType: r.exam_type,
    image: r.image,
    certificateImage: r.certificate_image,
    description: r.description,
    courseName: r.course_name,
    achievementDate: r.achievement_date,
  });

  async listResults(): Promise<StudentResultItem[]> {
    const { rows } = await this.pool.query("SELECT * FROM student_results ORDER BY created_at DESC");
    return rows.map(this.mapResult);
  }

  async createResult(r: StudentResultItem): Promise<StudentResultItem> {
    await this.pool.query(
      `INSERT INTO student_results (id, student_name, score, exam_type, image, certificate_image, description, course_name, achievement_date)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [r.id, r.studentName, r.score, r.examType, r.image, r.certificateImage ?? "", r.description ?? "", r.courseName ?? "", r.achievementDate ?? ""]
    );
    return r;
  }

  async updateResult(id: string, patch: Partial<StudentResultItem>): Promise<StudentResultItem | null> {
    const { rows } = await this.pool.query("SELECT * FROM student_results WHERE id = $1", [id]);
    if (!rows[0]) return null;
    const next = { ...this.mapResult(rows[0]), ...patch, id };
    await this.pool.query(
      `UPDATE student_results SET student_name=$2, score=$3, exam_type=$4, image=$5, certificate_image=$6, description=$7, course_name=$8, achievement_date=$9 WHERE id=$1`,
      [id, next.studentName, next.score, next.examType, next.image, next.certificateImage ?? "", next.description ?? "", next.courseName ?? "", next.achievementDate ?? ""]
    );
    return next;
  }

  async deleteResult(id: string): Promise<boolean> {
    const { rowCount } = await this.pool.query("DELETE FROM student_results WHERE id = $1", [id]);
    return rowCount > 0;
  }

  // ---- Admin -------------------------------------------------------------
  private mapAdmin = (r: any): AdminUser => ({
    id: r.id,
    email: r.email,
    passwordHash: r.password_hash,
    totpSecret: r.totp_secret ?? null,
    totpEnabled: r.totp_enabled ?? false,
  });

  async getAdmin(): Promise<AdminUser> {
    const { rows } = await this.pool.query("SELECT * FROM admin_users WHERE id = 'admin'");
    return this.mapAdmin(rows[0]);
  }

  async updateAdmin(patch: Partial<AdminUser>): Promise<AdminUser> {
    const current = await this.getAdmin();
    const next = { ...current, ...patch };
    await this.pool.query(
      `UPDATE admin_users SET email=$2, password_hash=$3, totp_secret=$4, totp_enabled=$5 WHERE id=$1`,
      [next.id, next.email, next.passwordHash, next.totpSecret, next.totpEnabled]
    );
    return next;
  }
}
