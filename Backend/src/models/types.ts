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

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  mapsUrl: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  highlighted?: boolean;
}

export interface ReviewItem {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  avatar?: string;
}

export interface SchoolSettings {
  name: string;
  logoText: string;
  /** Uploaded logo image (optional; falls back to text + icon). */
  logoImage?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBgImage: string;
  heroVideoUrl?: string;
  heroMediaType?: "image" | "video";
  /** Dedicated "About" section image (admin-editable). */
  aboutImage?: string;
  phone: string;
  email: string;
  address: string;
  mapsUrl: string;
  telegram: string;
  instagram: string;
  facebook: string;
  youtube: string;
  /** WhatsApp number (digits) for the floating contact button. */
  whatsapp?: string;
  aboutText: string;
  features: FeatureItem[];
  /** Admin-managed collections (stored in settings, no extra tables). */
  gallery?: string[];
  partners?: string[];
  branches?: Branch[];
  pricing?: PricingPlan[];
  reviews?: ReviewItem[];
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
 * Server-only entity. The password is stored only as a salted hash, and the
 * TOTP secret powers authenticator-app 2FA. Neither is ever returned to the
 * client (the secret is only exposed once, during first-time setup).
 */
export interface AdminUser {
  id: string;
  email: string;
  passwordHash: string;
  /** Base32 TOTP secret (generated on first login), or null before setup. */
  totpSecret: string | null;
  /** True once the admin has confirmed their authenticator app. */
  totpEnabled: boolean;
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
