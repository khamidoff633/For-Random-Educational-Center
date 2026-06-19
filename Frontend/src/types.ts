export interface SchoolSettings {
  name: string;
  logoText: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBgImage: string;
  heroVideoUrl?: string;
  heroMediaType?: 'image' | 'video';
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

export interface StudentResultItem {
  id: string;
  studentName: string;
  score: string;
  examType: 'IELTS' | 'CEFR' | 'SAT' | 'Dasturlash';
  image: string;
  courseName?: string;
  achievementDate?: string;
  studentPhoto?: string;
  studentBio?: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  desc: string;
  icon: string;
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
  gender?: 'erkak' | 'ayol';
}

export interface Lead {
  id: string;
  studentName: string;
  phone: string;
  courseId: string;
  status: 'yangi' | 'suhbatda' | 'oqiyapti' | 'rad-etildi';
  notes: string;
  createdAt: string;
}

export interface DashboardStats {
  totalLeads: number;
  activeStudents: number;
  totalCourses: number;
  totalTeachers: number;
  recentLeads: Lead[];
  leadsByStatus: {
    yangi: number;
    suhbatda: number;
    oqiyapti: number;
    'rad-etildi': number;
  };
}
