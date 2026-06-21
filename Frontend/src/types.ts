/**
 * Shared frontend DTO types. These mirror the JSON returned by the backend
 * API (see Backend/src/models/types.ts).
 */
export type Language = "uz" | "ru" | "en";

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
  logoImage?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBgImage: string;
  heroVideoUrl?: string;
  heroMediaType?: "image" | "video";
  aboutImage?: string;
  phone: string;
  email: string;
  address: string;
  mapsUrl: string;
  telegram: string;
  instagram: string;
  facebook: string;
  youtube: string;
  whatsapp?: string;
  aboutText: string;
  features: FeatureItem[];
  gallery?: string[];
  partners?: string[];
  branches?: Branch[];
  pricing?: PricingPlan[];
  reviews?: ReviewItem[];
}

export type ExamType = "IELTS" | "CEFR" | "SAT" | "Dasturlash";

export interface StudentResultItem {
  id: string;
  studentName: string;
  score: string;
  examType: ExamType;
  image: string;
  /** Uploaded certificate image. */
  certificateImage?: string;
  /** Optional caption (max 150 chars). */
  description?: string;
  courseName?: string;
  achievementDate?: string;
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

export type LeadStatus = "yangi" | "boglanildi" | "royxatga_otdi";

export interface Lead {
  id: string;
  studentName: string;
  phone: string;
  courseId: string;
  status: LeadStatus;
  notes: string;
  createdAt: string;
  seen?: boolean;
  verified?: boolean;
  verifiedAt?: string | null;
}

export interface DashboardStats {
  totalLeads: number;
  activeStudents: number;
  totalCourses: number;
  totalTeachers: number;
  recentLeads: Lead[];
  leadsByStatus: Record<LeadStatus, number>;
  leadsTrend: { date: string; count: number }[];
}
