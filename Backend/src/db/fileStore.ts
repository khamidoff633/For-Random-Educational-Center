/**
 * JSON file-backed repository.
 *
 * Reliability features:
 *   - In-memory cache loaded once at init().
 *   - Atomic writes (write to a temp file, then rename) so a crash mid-write
 *     can never corrupt db.json.
 *   - A serialised write queue so concurrent requests can't interleave writes.
 *   - Schema back-fill for databases created by older versions.
 */
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { env } from "../config/env";
import { buildSeedDatabase } from "./seed";
import type { Repository } from "./repository";
import type {
  AdminUser,
  Course,
  DatabaseShape,
  Lead,
  SchoolSettings,
  StudentResultItem,
  Teacher,
} from "../models/types";

export class FileRepository implements Repository {
  private cache: DatabaseShape | null = null;
  private writeChain: Promise<void> = Promise.resolve();

  async init(): Promise<void> {
    await fs.mkdir(env.dataDir, { recursive: true });
    if (!fsSync.existsSync(env.dbFile)) {
      this.cache = buildSeedDatabase();
      await this.flush();
      return;
    }
    const raw = await fs.readFile(env.dbFile, "utf-8");
    const parsed = JSON.parse(raw) as Partial<DatabaseShape>;
    this.cache = this.backfill(parsed);
    await this.flush();
  }

  /** Fills in any sections missing from older database files. */
  private backfill(parsed: Partial<DatabaseShape>): DatabaseShape {
    const seed = buildSeedDatabase();
    return {
      settings: { ...seed.settings, ...(parsed.settings ?? {}) },
      teachers: parsed.teachers ?? seed.teachers,
      courses: parsed.courses ?? seed.courses,
      leads: parsed.leads ?? seed.leads,
      studentResults: parsed.studentResults ?? seed.studentResults,
      admin: parsed.admin ?? seed.admin,
    };
  }

  private db(): DatabaseShape {
    if (!this.cache) throw new Error("FileRepository used before init()");
    return this.cache;
  }

  /** Atomically persists the in-memory cache, serialising concurrent writes. */
  private flush(): Promise<void> {
    this.writeChain = this.writeChain.then(async () => {
      const tmp = `${env.dbFile}.${process.pid}.tmp`;
      await fs.writeFile(tmp, JSON.stringify(this.db(), null, 2), "utf-8");
      await fs.rename(tmp, env.dbFile);
    });
    return this.writeChain;
  }

  // ---- Settings ----------------------------------------------------------
  async getSettings(): Promise<SchoolSettings> {
    return this.db().settings;
  }

  async updateSettings(patch: Partial<SchoolSettings>): Promise<SchoolSettings> {
    this.db().settings = { ...this.db().settings, ...patch };
    await this.flush();
    return this.db().settings;
  }

  // ---- Generic collection helpers ---------------------------------------
  private async create<T>(key: keyof DatabaseShape, item: T): Promise<T> {
    (this.db()[key] as unknown as T[]).push(item);
    await this.flush();
    return item;
  }

  private async update<T extends { id: string }>(
    key: keyof DatabaseShape,
    id: string,
    patch: Partial<T>
  ): Promise<T | null> {
    const list = this.db()[key] as unknown as T[];
    const index = list.findIndex((entity) => entity.id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...patch, id };
    await this.flush();
    return list[index];
  }

  private async remove<T extends { id: string }>(
    key: keyof DatabaseShape,
    id: string
  ): Promise<boolean> {
    const list = this.db()[key] as unknown as T[];
    const next = list.filter((entity) => entity.id !== id);
    if (next.length === list.length) return false;
    (this.db()[key] as unknown as T[]) = next;
    await this.flush();
    return true;
  }

  // ---- Courses -----------------------------------------------------------
  listCourses = async (): Promise<Course[]> => this.db().courses;
  createCourse = (course: Course) => this.create("courses", course);
  updateCourse = (id: string, patch: Partial<Course>) => this.update<Course>("courses", id, patch);
  deleteCourse = (id: string) => this.remove<Course>("courses", id);

  // ---- Teachers ----------------------------------------------------------
  listTeachers = async (): Promise<Teacher[]> => this.db().teachers;
  createTeacher = (teacher: Teacher) => this.create("teachers", teacher);
  updateTeacher = (id: string, patch: Partial<Teacher>) =>
    this.update<Teacher>("teachers", id, patch);
  deleteTeacher = (id: string) => this.remove<Teacher>("teachers", id);

  // ---- Leads -------------------------------------------------------------
  listLeads = async (): Promise<Lead[]> => this.db().leads;
  createLead = (lead: Lead) => this.create("leads", lead);
  updateLead = (id: string, patch: Partial<Lead>) => this.update<Lead>("leads", id, patch);
  deleteLead = (id: string) => this.remove<Lead>("leads", id);

  // ---- Student results ---------------------------------------------------
  listResults = async (): Promise<StudentResultItem[]> => this.db().studentResults;
  createResult = (result: StudentResultItem) => this.create("studentResults", result);
  updateResult = (id: string, patch: Partial<StudentResultItem>) =>
    this.update<StudentResultItem>("studentResults", id, patch);
  deleteResult = (id: string) => this.remove<StudentResultItem>("studentResults", id);

  // ---- Admin -------------------------------------------------------------
  async getAdmin(): Promise<AdminUser> {
    return this.db().admin;
  }

  async updateAdmin(patch: Partial<AdminUser>): Promise<AdminUser> {
    this.db().admin = { ...this.db().admin, ...patch };
    await this.flush();
    return this.db().admin;
  }
}
