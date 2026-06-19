/**
 * Storage-agnostic repository contract.
 *
 * Two implementations satisfy this interface:
 *   - FileRepository    (data/db.json) — zero-config default, used in the sandbox
 *   - PostgresRepository (DATABASE_URL) — production target
 *
 * Routes and services depend only on this interface, so swapping the backing
 * store never touches business logic.
 */
import type {
  AdminUser,
  Course,
  Lead,
  SchoolSettings,
  StudentResultItem,
  Teacher,
} from "../models/types";

export interface Repository {
  /** Prepares the store (creates files/tables, seeds defaults if empty). */
  init(): Promise<void>;

  // Settings (single row)
  getSettings(): Promise<SchoolSettings>;
  updateSettings(patch: Partial<SchoolSettings>): Promise<SchoolSettings>;

  // Courses
  listCourses(): Promise<Course[]>;
  createCourse(course: Course): Promise<Course>;
  updateCourse(id: string, patch: Partial<Course>): Promise<Course | null>;
  deleteCourse(id: string): Promise<boolean>;

  // Teachers
  listTeachers(): Promise<Teacher[]>;
  createTeacher(teacher: Teacher): Promise<Teacher>;
  updateTeacher(id: string, patch: Partial<Teacher>): Promise<Teacher | null>;
  deleteTeacher(id: string): Promise<boolean>;

  // Leads
  listLeads(): Promise<Lead[]>;
  createLead(lead: Lead): Promise<Lead>;
  updateLead(id: string, patch: Partial<Lead>): Promise<Lead | null>;
  deleteLead(id: string): Promise<boolean>;

  // Student results
  listResults(): Promise<StudentResultItem[]>;
  createResult(result: StudentResultItem): Promise<StudentResultItem>;
  updateResult(id: string, patch: Partial<StudentResultItem>): Promise<StudentResultItem | null>;
  deleteResult(id: string): Promise<boolean>;

  // Admin user (single row)
  getAdmin(): Promise<AdminUser>;
  updateAdmin(patch: Partial<AdminUser>): Promise<AdminUser>;
}
