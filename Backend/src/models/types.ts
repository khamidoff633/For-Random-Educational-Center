/**
 * Backend domain models.
 *
 * These mirror the public DTO shapes consumed by the Frontend, plus a few
 * server-only entities (e.g. the admin user) that are never exposed verbatim.
 */

export interface FeatureItem {
  id: string;
  title: string;
  desc: string;
  icon: string;
}

export interface SchoolSettings {
  name: string;
  logoText: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBgImage: string;
  heroVideoUrl?: string;
  heroMediaType?: "image" | "video";
  phone: string;
  email: string;
  address: string;
  mapsUrl: string;
  telegram: string;
  instagram: string;
  facebook: string;
  youtube: string;
  aboutText: string;
  features: FeatureItem[];
}

export interface Teacher {
  id: string;
  name: string;
  specialty: string;
  slogan?: string;
  bio: string;
  image: string;
  experience: string;
  phone: string;
  gender?: "erkak" | "ayol";
}

export interface Course {
  id: string;
  name: string;
  category: string;
  description: string;
  duration: string;
  price: string;
  teacherId: string;
  days: string;
  time: string;
  image: string;
  capacity: number;
}

/**
 * CRM pipeline statuses (simplified, real-world funnel):
 *  - yangi         : new, not yet contacted
 *  - boglanildi    : admin has contacted the prospect
 *  - royxatga_otdi : converted — became a student
 */
export type LeadStatus = "yangi" | "boglanildi" | "royxatga_otdi";

export interface Lead {
  id: string;
  studentName: string;
  phone: string;
  courseId: string;
  status: LeadStatus;
  notes: string;
  createdAt: string;
  /** False until the admin has opened the leads list (drives the "new" badge). */
  seen?: boolean;
  /** True once the admin marks the lead as handled ("Tekshirildi"). */
  verified?: boolean;
  /** ISO timestamp when verified; used for the 7-day auto-cleanup countdown. */
  verifiedAt?: string | null;
}

export type ExamType = "IELTS" | "CEFR" | "SAT" | "Dasturlash";

export interface StudentResultItem {
  id: string;
  studentName: string;
  score: string;
  examType: ExamType;
  /** Public showcase image (kept for backwards compatibility). */
  image: string;
  /** Uploaded certificate image (new). */
  certificateImage?: string;
  /** Optional caption, capped at 150 characters in the API layer. */
  description?: string;
  courseName?: string;
  achievementDate?: string;
  studentPhoto?: string;
  studentBio?: string;
}

/**
 * Server-only entity. The password is stored only as a salted hash and the
 * 2FA one-time code is stored hashed with an expiry. Neither is ever returned
 * to the client.
 */
export interface AdminUser {
  id: string;
  email: string;
  passwordHash: string;
  /** Hash of the active 2FA one-time code, or null when none is pending. */
  otpHash: string | null;
  /** Expiry timestamp (ms since epoch) for the active 2FA code. */
  otpExpiresAt: number | null;
  /** Number of consecutive failed 2FA attempts for the active code. */
  otpAttempts: number;
}

/** Full database shape used by the file store and seeded into PostgreSQL. */
export interface DatabaseShape {
  settings: SchoolSettings;
  teachers: Teacher[];
  courses: Course[];
  leads: Lead[];
  studentResults: StudentResultItem[];
  admin: AdminUser;
}

/** Aggregated dashboard metrics. */
export interface DashboardStats {
  totalLeads: number;
  activeStudents: number;
  totalCourses: number;
  totalTeachers: number;
  recentLeads: Lead[];
  leadsByStatus: Record<LeadStatus, number>;
  /** Leads grouped by ISO date (YYYY-MM-DD) for the last 14 days. */
  leadsTrend: { date: string; count: number }[];
}
