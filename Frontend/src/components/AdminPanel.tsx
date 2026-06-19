import React, { useState, useEffect } from "react";
import { 
  SchoolSettings, Course, Teacher, Lead, DashboardStats 
} from "../types";
import { 
  LayoutDashboard, Settings, BookOpen, GraduationCap, Users, Save, 
  Trash2, Edit, Plus, CheckCircle, Clock, AlertCircle, XCircle, Sparkles, Send, Phone, MapPin, Globe, Mail, Eye
} from "lucide-react";

interface AdminPanelProps {
  initialSettings: SchoolSettings;
  courses: Course[];
  teachers: Teacher[];
  leads: Lead[];
  stats: DashboardStats;
  onRefreshData: () => void;
  onClose: () => void;
}

const HERO_BG_PRESETS = [
  { id: "bg1", name: "Zamonaviy Sinf", url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop" },
  { id: "bg2", name: "Talabalar", url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop" },
  { id: "bg3", name: "Noutbuk & Kod", url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop" },
  { id: "bg4", name: "Kutubxona", url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1200&auto=format&fit=crop" },
  { id: "bg5", name: "Hamkorlik Muhiti", url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop" }
];

const HERO_VIDEO_PRESETS = [
  { id: "v1", name: "Kutubxona / Sinfxona Muhiti (15s)", url: "https://raw.githubusercontent.com/intel-iot-devkit/sample-videos/master/classroom.mp4" },
  { id: "v2", name: "Talabalar va Akademik Yo'lak (15s)", url: "https://raw.githubusercontent.com/intel-iot-devkit/sample-videos/master/people-detection.mp4" },
  { id: "v3", name: "Tinchlantiruvchi Okean To'lqinlari (15s)", url: "https://vjs.zencdn.net/v/oceans.mp4" }
];

const COURSE_BANNER_PRESETS = [
  { id: "cb1", name: "Ingliz tili", url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop" },
  { id: "cb2", name: "Boshlang'ich dars", url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop" },
  { id: "cb3", name: "Dasturlash / IT", url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop" },
  { id: "cb4", name: "Robototexnika", url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop" },
  { id: "cb5", name: "Matematika", url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600&auto=format&fit=crop" },
  { id: "cb6", name: "San'at & Dizayn", url: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=600&auto=format&fit=crop" }
];

const TEACHER_AVATAR_PRESETS = {
  ayol: [
    { id: "ta_f1", name: "Zamonaviy Ustoz", url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop" },
    { id: "ta_f2", name: "IELTS Mutaxassisi", url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop" },
    { id: "ta_f3", name: "Kids Ustoz", url: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=300&auto=format&fit=crop" }
  ],
  erkak: [
    { id: "ta_m1", name: "Katta O'qituvchi", url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&auto=format&fit=crop" },
    { id: "ta_m2", name: "Raqamli Mentor", url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&auto=format&fit=crop" },
    { id: "ta_m3", name: "IT Mutaxassisi", url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&auto=format&fit=crop" }
  ]
};

export default function AdminPanel({ 
  initialSettings, courses, teachers, leads, stats, onRefreshData, onClose 
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "settings" | "courses" | "teachers" | "leads" | "ai-copilot">("dashboard");
  
  // AI Copilot State
  const [copilotMessage, setCopilotMessage] = useState("");
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [copilotChat, setCopilotChat] = useState<Array<{ sender: "user" | "ai"; text: string; actions?: any[] }>>([
    {
      sender: "ai",
      text: "Salom! Men o'quv markazining to'liq boshqaruvchi sun'iy intellekti (AI Copilot)man. Menga joriy vazifalar, talabalar tahlili, yoki markaz sozlamalarini o'zgartirish haqida buyruq bering. Masalan, 'guruhlar holatini tahlil qil' yoki 'Brend nomini Apex Academy qilib o'zgartir' deb kiriting."
    }
  ]);
  
  // Settings Form State
  const [settingsForm, setSettingsForm] = useState<SchoolSettings>(initialSettings);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState("");
  const [videoDurationError, setVideoDurationError] = useState<string | null>(null);
  const [checkingVideo, setCheckingVideo] = useState(false);

  const checkVideoDuration = (urlOrBlob: string) => {
    if (!urlOrBlob) {
      setVideoDurationError(null);
      return;
    }
    setCheckingVideo(true);
    setVideoDurationError(null);
    
    try {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = urlOrBlob;
      video.onloadedmetadata = () => {
        setCheckingVideo(false);
        const duration = video.duration;
        if (isNaN(duration)) {
          setVideoDurationError("Video davomiyligini aniqlab bo'lmadi. Video formatiga e'tibor bering (Direct MP4 tavsiya etiladi).");
        } else if (duration < 5) {
          setVideoDurationError(`Video juda qisqa (${duration.toFixed(1)}s). Minimal davomiylik 5 sekund bo'lishi kerak.`);
        } else if (duration > 20) {
          setVideoDurationError(`Video juda uzun (${duration.toFixed(1)}s). Maksimal davomiylik 20 sekund bo'lishi kerak.`);
        } else {
          setVideoDurationError(null);
        }
      };
      video.onerror = () => {
        setCheckingVideo(false);
        // We permit custom stream links (e.g. general links) but warn them
        setVideoDurationError(null); // Clear block but show warning if needed
      };
    } catch {
      setCheckingVideo(false);
    }
  };

  useEffect(() => {
    if (settingsForm.heroVideoUrl && settingsForm.heroMediaType === "video") {
      checkVideoDuration(settingsForm.heroVideoUrl);
    } else {
      setVideoDurationError(null);
    }
  }, [settingsForm.heroVideoUrl, settingsForm.heroMediaType]);

  // Course Form States
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [courseForm, setCourseForm] = useState<Partial<Course>>({
    name: "", category: "English", description: "", duration: "3 oy",
    price: "450 000 so'm / oy", teacherId: "", days: "Dush - Chor - Jum",
    time: "15:00 - 17:00", image: "", capacity: 12
  });
  const [courseLoading, setCourseLoading] = useState(false);
  const [courseAIContext, setCourseAIContext] = useState("");
  const [courseAILoading, setCourseAILoading] = useState(false);

  // Teacher Form States
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [teacherForm, setTeacherForm] = useState<Partial<Teacher>>({
    name: "", specialty: "", slogan: "", bio: "", image: "", experience: "3 yil", phone: ""
  });
  const [teacherLoading, setTeacherLoading] = useState(false);
  const [teacherAIContext, setTeacherAIContext] = useState("");
  const [teacherAILoading, setTeacherAILoading] = useState(false);

  // Sound/Haptic feedback function for negation error
  const playVibrationSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const playBuzz = (startTime: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(65, startTime);
        
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(80, startTime);
        filter.Q.setValueAtTime(1.5, startTime);
        
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.8, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.18);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(startTime);
        osc.stop(startTime + 0.2);
      };
      
      playBuzz(ctx.currentTime);
      playBuzz(ctx.currentTime + 0.22);
      
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
    } catch (err) {
      console.warn("Haptic audio feedback error:", err);
    }
  };

  // Branding button behavior state
  const [btnShake, setBtnShake] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  // Leads state
  const [selectedLeadStatusFilter, setSelectedLeadStatusFilter] = useState<string>("all");
  const [editingLeadNotes, setEditingLeadNotes] = useState<{ [leadId: string]: string }>({});

  // Manual Leads CRUD States
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadForm, setLeadForm] = useState<Partial<Lead>>({
    studentName: "", phone: "+998", courseId: "", status: "yangi", notes: ""
  });
  const [leadLoading, setLeadLoading] = useState(false);

  // Unread badge tracker state
  const [viewedLeadIds, setViewedLeadIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("viewed_lead_ids");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Whenever activeTab is "leads" and leads exist, mark them as seen
  useEffect(() => {
    if (activeTab === "leads" && leads.length > 0) {
      const allLeadIds = leads.map(l => l.id);
      setViewedLeadIds(prev => {
        const updated = Array.from(new Set([...prev, ...allLeadIds]));
        try {
          localStorage.setItem("viewed_lead_ids", JSON.stringify(updated));
        } catch (e) {
          console.error(e);
        }
        return updated;
      });
    }
  }, [activeTab, leads]);

  const uploadFileToServer = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const res = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              base64: reader.result,
              filename: file.name
            })
          });
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || "Fayl yuklashda xatolik yuz berdi");
          }
          const data = await res.json();
          resolve(data.url);
        } catch (err: any) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error("Faylni o'qishda xatolik"));
      reader.readAsDataURL(file);
    });
  };

  // Lead modal openers
  const openLeadAdd = () => {
    setEditingLead(null);
    setLeadForm({
      studentName: "", phone: "+998 ", courseId: courses[0]?.id || "", status: "yangi", notes: ""
    });
    setShowLeadModal(true);
  };

  const openLeadEdit = (lead: Lead) => {
    setEditingLead(lead);
    setLeadForm({
      studentName: lead.studentName,
      phone: lead.phone,
      courseId: lead.courseId,
      status: lead.status,
      notes: lead.notes || ""
    });
    setShowLeadModal(true);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawPhone = leadForm.phone?.trim() || "";
    const digitCount = rawPhone.replace(/\D/g, "").length;

    if (!leadForm.studentName?.trim()) {
      alert("Talabaning ismini yozish majburiy!");
      return;
    }

    if (!rawPhone || rawPhone === "+998" || rawPhone.replace(/\s+/g, '') === "+998" || digitCount < 9) {
      alert("Telefon raqamini to'liq kiritish majburiy! (Kamida 9 ta raqam bo'lishi kerak)");
      return;
    }

    setLeadLoading(true);
    const url = editingLead ? `/api/leads/${editingLead.id}` : "/api/leads";
    const method = editingLead ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadForm)
      });
      if (res.ok) {
        setShowLeadModal(false);
        onRefreshData();
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.error || "Saqlashda xatolik yuz berdi");
      }
    } catch (err) {
      console.error(err);
      alert("Server ulanish xatoligi");
    } finally {
      setLeadLoading(false);
    }
  };

  // Deletion confirm states
  const [confirmDeleteCourseId, setConfirmDeleteCourseId] = useState<string | null>(null);
  const [confirmDeleteTeacherId, setConfirmDeleteTeacherId] = useState<string | null>(null);
  const [confirmDeleteLeadId, setConfirmDeleteLeadId] = useState<string | null>(null);

  // Sync settings form state when initialSettings prop changes
  useEffect(() => {
    setSettingsForm(initialSettings);
  }, [initialSettings]);

  // Handle settings update
  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Compare settingsForm values vs initialSettings values
    const isSettingsChanged = 
      settingsForm.name !== initialSettings.name ||
      settingsForm.logoText !== initialSettings.logoText ||
      settingsForm.heroTitle !== initialSettings.heroTitle ||
      settingsForm.heroSubtitle !== initialSettings.heroSubtitle ||
      settingsForm.heroBgImage !== initialSettings.heroBgImage ||
      settingsForm.heroVideoUrl !== initialSettings.heroVideoUrl ||
      settingsForm.heroMediaType !== initialSettings.heroMediaType ||
      settingsForm.phone !== initialSettings.phone ||
      settingsForm.email !== initialSettings.email ||
      settingsForm.address !== initialSettings.address ||
      settingsForm.mapsUrl !== initialSettings.mapsUrl ||
      settingsForm.aboutText !== initialSettings.aboutText ||
      settingsForm.telegram !== initialSettings.telegram ||
      settingsForm.instagram !== initialSettings.instagram ||
      settingsForm.facebook !== initialSettings.facebook ||
      settingsForm.youtube !== initialSettings.youtube ||
      JSON.stringify(settingsForm.features) !== JSON.stringify(initialSettings.features);

    if (settingsForm.heroMediaType === "video" && videoDurationError) {
      alert(`Iltimos, video qoidasini buzmang: ${videoDurationError}`);
      return;
    }

    if (!isSettingsChanged) {
      // No changes -> shake button and trigger voice feedback / vibration haptics
      setBtnShake(true);
      playVibrationSound();
      setTimeout(() => setBtnShake(false), 500);
      return;
    }

    setSettingsLoading(true);
    setSettingsMessage("");
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsForm)
      });
      if (res.ok) {
        setJustSaved(true);
        setSettingsMessage("Sozlamalar muvaffaqiyatli saqlandi!");
        onRefreshData();
        setTimeout(() => {
          setJustSaved(false);
          setSettingsMessage("");
        }, 2000);
      } else {
        setSettingsMessage("Saqlashda xatolik yuz berdi.");
      }
    } catch {
      setSettingsMessage("Server ulanish xatoligi.");
    } finally {
      setSettingsLoading(false);
    }
  };

  // ---------------- COURSE CRUD ----------------
  const openCourseAdd = () => {
    setEditingCourse(null);
    setCourseForm({
      name: "", category: "English", description: "", duration: "3 oy",
      price: "450 000 so'm / oy", teacherId: teachers[0]?.id || "", 
      days: "Dush - Chor - Jum", time: "15:00 - 17:00", 
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=400&auto=format&fit=crop", 
      capacity: 12
    });
    setCourseAIContext("");
    setShowCourseModal(true);
  };

  const openCourseEdit = (course: Course) => {
    setEditingCourse(course);
    setCourseForm(course);
    setCourseAIContext("");
    setShowCourseModal(true);
  };

  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCourseLoading(true);
    const url = editingCourse ? `/api/courses/${editingCourse.id}` : "/api/courses";
    const method = editingCourse ? "PUT" : "POST";
    
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseForm)
      });
      if (res.ok) {
        setShowCourseModal(false);
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCourseLoading(false);
    }
  };

  const handleCourseDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/courses/${id}`, { method: "DELETE" });
      if (res.ok) onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // Generate course description with server side AI
  const handleAIFieldGenerate = async (type: "course" | "teacher") => {
    const nameVal = type === "course" ? courseForm.name : teacherForm.name;
    const contextVal = type === "course" ? courseAIContext : teacherAIContext;

    if (!nameVal?.trim()) {
      alert("Iltimos, avval ism/nom maydonini to'ldiring.");
      return;
    }

    if (type === "course") setCourseAILoading(true);
    else setTeacherAILoading(true);

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          name: nameVal,
          context: contextVal
        })
      });
      const data = await response.json();
      if (data.error) {
        alert(data.error);
      } else if (data.text) {
        if (type === "course") {
          setCourseForm(prev => ({ ...prev, description: data.text }));
        } else {
          setTeacherForm(prev => ({ ...prev, bio: data.text }));
        }
      }
    } catch {
      alert("AI xizmati ulanishda xatolik yuz berdi");
    } finally {
      if (type === "course") setCourseAILoading(false);
      else setTeacherAILoading(false);
    }
  };

  // ---------------- TEACHER CRUD ----------------
  const openTeacherAdd = () => {
    setEditingTeacher(null);
    setTeacherForm({
      name: "", specialty: "", slogan: "", bio: "", 
      image: "", 
      gender: "erkak",
      experience: "3 yil", phone: ""
    });
    setTeacherAIContext("");
    setShowTeacherModal(true);
  };

  const openTeacherEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setTeacherForm({
      ...teacher,
      slogan: teacher.slogan || "",
      gender: teacher.gender || "erkak",
      image: teacher.image || ""
    });
    setTeacherAIContext("");
    setShowTeacherModal(true);
  };

  const handleTeacherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTeacherLoading(true);
    const url = editingTeacher ? `/api/teachers/${editingTeacher.id}` : "/api/teachers";
    const method = editingTeacher ? "PUT" : "POST";
    
    // Sanitize optional phone number
    const sanitizedPhone = (teacherForm.phone && teacherForm.phone.trim() !== "" && teacherForm.phone.trim() !== "+998") 
      ? teacherForm.phone.trim() 
      : "";

    const payload = {
      ...teacherForm,
      phone: sanitizedPhone
    };
    
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowTeacherModal(false);
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTeacherLoading(false);
    }
  };

  const handleTeacherDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/teachers/${id}`, { method: "DELETE" });
      if (res.ok) onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- LEADS PIPELINE ----------------
  const handleLeadStatusChange = async (leadId: string, status: Lead["status"]) => {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLeadNotesBlur = async (leadId: string, notes: string) => {
    try {
      await fetch(`/api/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes })
      });
      onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLeadDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      if (res.ok) onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // Filter leads based on selected status
  const filteredLeads = selectedLeadStatusFilter === "all" 
    ? leads 
    : leads.filter(l => l.status === selectedLeadStatusFilter);

  // Status styling configurations
  const getStatusBadge = (status: Lead["status"]) => {
    switch (status) {
      case "yangi":
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600 border border-blue-100"><Clock size={12} /> Yangi</span>;
      case "suhbatda":
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-[#52e0a5]/10 px-2.5 py-1 text-xs font-semibold text-[#3cbd84] border border-[#52e0a5]/20"><AlertCircle size={12} /> Suhbatda</span>;
      case "oqiyapti":
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600 border border-emerald-100"><CheckCircle size={12} /> O'qiyotgan Talaba</span>;
      case "rad-etildi":
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 border border-red-100"><XCircle size={12} /> Rad etildi</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-50 md:flex-row overflow-hidden font-sans">
      
      {/* SIDEBAR NAVIGATION */}
      <div className="w-full md:w-64 bg-slate-900 text-white flex flex-col justify-between shrink-0">
        <div>
          {/* Top Branding Section */}
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent truncate">
              {initialSettings.name || "Learning SaaS"}
            </h2>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 font-mono">BOSHQARUV PANELI</p>
          </div>

          {/* Menu Options */}
          <nav className="p-4 space-y-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === "dashboard" ? "bg-emerald-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <LayoutDashboard size={18} />
              <span>Dasturlash (KPI)</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === "settings" ? "bg-emerald-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Settings size={18} />
              <span>Brend Sozlamalari</span>
            </button>

            <button
              onClick={() => setActiveTab("courses")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === "courses" ? "bg-emerald-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <BookOpen size={18} />
              <span>Kurslarni Sozlash</span>
            </button>

            <button
              onClick={() => setActiveTab("teachers")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === "teachers" ? "bg-emerald-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <GraduationCap size={18} />
              <span>Ustozlar Ro'yxati</span>
            </button>

            <button
              onClick={() => setActiveTab("leads")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === "leads" ? "bg-emerald-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white mr-1"
              }`}
            >
              <Users size={18} />
              <span>Sinflar & Arizalar</span>
              {leads.filter(l => l.status === "yangi" && !viewedLeadIds.includes(l.id)).length > 0 && (
                <span className="ml-auto inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                  {leads.filter(l => l.status === "yangi" && !viewedLeadIds.includes(l.id)).length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("ai-copilot")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors border border-dashed ${
                activeTab === "ai-copilot"
                  ? "bg-indigo-600 border-indigo-500 text-white"
                  : "border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Sparkles size={18} className="text-yellow-400" />
              <span>AI Admin Copilot</span>
              <span className="ml-auto bg-indigo-500/30 text-indigo-300 text-[9px] px-1.5 py-0.5 rounded-md uppercase font-mono font-bold tracking-wider animate-pulse">Live</span>
            </button>
          </nav>
        </div>

        {/* Closing Control buttons */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
          >
            <Eye size={14} />
            <span>Demonstratsiya</span>
          </button>
          <div className="text-[10px] text-center text-slate-500 font-mono">
            Full-Stack Engine v1.0.1
          </div>
        </div>
      </div>

      {/* WORKSPACE AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header toolbar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
          <h1 className="font-sans font-bold text-xl text-gray-900 uppercase tracking-tight">
            {activeTab === "dashboard" && "Dashboard & Tahlillar"}
            {activeTab === "settings" && "Brend Sozlamalari (SaaS Mode)"}
            {activeTab === "courses" && "Kurslarni Tahrirlash va CRUD"}
            {activeTab === "teachers" && "Ustozlar / Guruh Mentorlari"}
            {activeTab === "leads" && "Kelib tushgan Arizalar & CRM"}
            {activeTab === "ai-copilot" && "AI Administrator Terminali (Copilot)"}
          </h1>

          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-gray-950 transition-colors"
          >
            X Saytdan Chiqish
          </button>
        </header>

        {/* Tab content panel */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* ==================== DASHBOARD TAB ==================== */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* KPIs Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
                  <div className="inline-flex items-center justify-center rounded-xl bg-blue-100 p-3 text-blue-600">
                    <Users size={24} />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 font-bold block uppercase">Jami Arizalar</span>
                    <strong className="text-2xl text-gray-900 font-sans tracking-tight">{stats.totalLeads} ta</strong>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
                  <div className="inline-flex items-center justify-center rounded-xl bg-emerald-100 p-3 text-emerald-600">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 font-bold block uppercase">O'qiyotganlar</span>
                    <strong className="text-2xl text-gray-900 font-sans tracking-tight">{stats.activeStudents} ta</strong>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
                  <div className="inline-flex items-center justify-center rounded-xl bg-purple-100 p-3 text-purple-600">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 font-bold block uppercase">Joriy Kurslar</span>
                    <strong className="text-2xl text-gray-900 font-sans tracking-tight">{stats.totalCourses} ta</strong>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
                  <div className="inline-flex items-center justify-center rounded-xl bg-teal-100 p-3 text-teal-600">
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 font-bold block uppercase">Ustozlar soni</span>
                    <strong className="text-2xl text-gray-900 font-sans tracking-tight">{stats.totalTeachers} nafar</strong>
                  </div>
                </div>
              </div>

              {/* Advanced metrics & charts visualization */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Pipeline distribution chart */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
                  <h3 className="font-semibold text-gray-800 text-sm mb-4 uppercase tracking-wider font-mono"> pipeline holati</h3>
                  
                  <div className="space-y-3.5">
                    <div>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Yangi Murojaatlar</span>
                        <strong>{stats.leadsByStatus.yangi} ta ({stats.totalLeads ? Math.round((stats.leadsByStatus.yangi / stats.totalLeads)*100) : 0}%)</strong>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full" style={{ width: `${stats.totalLeads ? (stats.leadsByStatus.yangi / stats.totalLeads)*100 : 0}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Suhbatidagilar (Mock/Test)</span>
                        <strong>{stats.leadsByStatus.suhbatda} ta ({stats.totalLeads ? Math.round((stats.leadsByStatus.suhbatda / stats.totalLeads)*100) : 0}%)</strong>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-teal-500 h-full" style={{ width: `${stats.totalLeads ? (stats.leadsByStatus.suhbatda / stats.totalLeads)*100 : 0}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Guruhga qo'shilgan o'quvchilar</span>
                        <strong>{stats.leadsByStatus.oqiyapti} ta ({stats.totalLeads ? Math.round((stats.leadsByStatus.oqiyapti / stats.totalLeads)*100) : 0}%)</strong>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full" style={{ width: `${stats.totalLeads ? (stats.leadsByStatus.oqiyapti / stats.totalLeads)*100 : 0}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Rad etilgan / Kutayotganlar</span>
                        <strong>{stats.leadsByStatus["rad-etildi"]} ta ({stats.totalLeads ? Math.round((stats.leadsByStatus["rad-etildi"] / stats.totalLeads)*100) : 0}%)</strong>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-red-500 h-full" style={{ width: `${stats.totalLeads ? (stats.leadsByStatus["rad-etildi"] / stats.totalLeads)*100 : 0}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-50 text-center text-xs text-gray-400">
                    Conversion Rate: <strong className="text-emerald-600 font-bold">{stats.totalLeads ? Math.round((stats.leadsByStatus.oqiyapti / stats.totalLeads)*100) : 0}%</strong>
                  </div>
                </div>

                {/* Recent submissions list */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider font-mono">So'nggi 5 ta ariza</h3>
                    <button 
                      onClick={() => setActiveTab("leads")} 
                      className="text-xs font-bold text-emerald-600 hover:underline"
                    >
                      Barcha CRM ni ko'rish &rarr;
                    </button>
                  </div>

                  {stats.recentLeads.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-8">Hozircha hech qanday ariza mavjud emas.</p>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {stats.recentLeads.map((lead) => {
                        const course = courses.find(c => c.id === lead.courseId);
                        return (
                          <div key={lead.id} className="py-3 flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-bold text-gray-800">{lead.studentName}</h4>
                              <p className="text-xs text-gray-500 mt-0.5">{lead.phone} &bull; <span className="font-semibold text-indigo-600">{course ? course.name : "Konsultatsiya"}</span></p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-mono text-gray-400">{new Date(lead.createdAt).toLocaleDateString()}</span>
                              {getStatusBadge(lead.status)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==================== SETTINGS CONFIG TAB ==================== */}
          {activeTab === "settings" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-4xl">
              <form onSubmit={handleSettingsSubmit} className="space-y-6">
                
                {settingsMessage && (
                  <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-sm font-semibold border border-emerald-100 flex items-center gap-2">
                    <Sparkles size={18} className="text-emerald-600" />
                    <span>{settingsMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Learning school name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1.5">O'quv Markazi Nomi</label>
                    <input
                      type="text"
                      required
                      value={settingsForm.name}
                      onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:bg-white"
                      placeholder="Apex Academy"
                    />
                  </div>

                  {/* Logo Text */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1.5">Brend Logo Matni</label>
                    <input
                      type="text"
                      required
                      value={settingsForm.logoText}
                      onChange={(e) => setSettingsForm({ ...settingsForm, logoText: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:bg-white"
                      placeholder="APEX Academy"
                    />
                  </div>

                  {/* Hero Title */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1.5">Bosh sahifa Sarlavhasi (Hero Title)</label>
                    <input
                      type="text"
                      required
                      value={settingsForm.heroTitle}
                      onChange={(e) => setSettingsForm({ ...settingsForm, heroTitle: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:bg-white"
                      placeholder="Kelajagingizni Biz Bilan Birga Quring"
                    />
                  </div>

                  {/* Hero Subtitle */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1.5">Bosh sahifa Ko'makchi matni (Hero Subtitle)</label>
                    <textarea
                      required
                      rows={2}
                      value={settingsForm.heroSubtitle}
                      onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm outline-none focus:border-emerald-500 focus:bg-white resize-none"
                      placeholder="Eng yuqori natijali Ingliz tili va axborot texnologiyalari kurslari..."
                    />
                  </div>

                  {/* Bosh sahifa Media Turi Selector */}
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest">Bosh sahifa Media foni turi (Hero Backdrop Style)</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setSettingsForm({ ...settingsForm, heroMediaType: "image" })}
                        className={`flex items-center justify-center gap-2 rounded-xl p-3 border-2 font-bold text-sm transition-all ${
                          settingsForm.heroMediaType !== "video"
                            ? "border-emerald-600 bg-emerald-50/40 text-emerald-800"
                            : "border-gray-100 bg-gray-50 hover:bg-gray-100 text-gray-500"
                        }`}
                      >
                        🌅 Rasm (Static Image)
                      </button>
                      <button
                        type="button"
                        onClick={() => setSettingsForm({ ...settingsForm, heroMediaType: "video" })}
                        className={`flex items-center justify-center gap-2 rounded-xl p-3 border-2 font-bold text-sm transition-all ${
                          settingsForm.heroMediaType === "video"
                            ? "border-emerald-600 bg-emerald-50/40 text-emerald-800"
                            : "border-gray-100 bg-gray-50 hover:bg-gray-100 text-gray-500"
                        }`}
                      >
                        🎥 Video (Looping - 5s dan 20s gacha)
                      </button>
                    </div>
                  </div>

                  {settingsForm.heroMediaType !== "video" ? (
                    /* Hero backdrop image (Upload / Gallery) */
                    <div className="md:col-span-2 space-y-3">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1">
                        Bosh sahifa Orqa Fon Rasmi (Yuklang yoki Galereyadan tanlang)
                      </label>
                      
                      <div className="flex flex-col md:flex-row gap-4 p-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
                        {/* Left: Custom preview & File Uploader */}
                        <div className="flex-1 space-y-2">
                          <div className="relative h-28 w-full rounded-lg overflow-hidden border border-gray-100 bg-zinc-900 flex items-center justify-center">
                            {settingsForm.heroBgImage ? (
                              <>
                                <img src={settingsForm.heroBgImage} alt="Cover Preview" className="h-full w-full object-cover opacity-85" referrerPolicy="no-referrer" />
                                <div className="absolute inset-0 bg-black/35 flex items-center justify-center text-xs text-white font-bold backdrop-blur-xs">
                                  Tanlangan rasm
                                </div>
                              </>
                            ) : (
                              <span className="text-xs text-gray-400 font-medium">Rasm tanlanmagan</span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              accept="image/*"
                              id="settings-bg-file"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  if (file.size > 10 * 1024 * 1024) {
                                    alert("Rasm juda katta (Maks: 10MB)!");
                                    return;
                                  }
                                  setCheckingVideo(true);
                                  try {
                                    const uploadedUrl = await uploadFileToServer(file);
                                    setSettingsForm(prev => ({ ...prev, heroBgImage: uploadedUrl }));
                                  } catch (err: any) {
                                    alert(err.message || "Rasm yuklashda xatolik yuz berdi");
                                  } finally {
                                    setCheckingVideo(false);
                                  }
                                }
                              }}
                            />
                            <label
                              htmlFor="settings-bg-file"
                              className="inline-flex cursor-pointer rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800 shadow-xs transition-all"
                            >
                              Kompyuterdan yuklash (Maks: 3MB)
                            </label>
                          </div>
                        </div>

                        {/* Right: Curated Presets list */}
                        <div className="flex-1 space-y-2">
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Yoki tayyor galereyadan tanlang:</span>
                          <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                            {HERO_BG_PRESETS.map((preset) => {
                              const isSelected = settingsForm.heroBgImage === preset.url;
                              return (
                                <button
                                  key={preset.id}
                                  type="button"
                                  onClick={() => setSettingsForm({ ...settingsForm, heroBgImage: preset.url })}
                                  className={`group relative h-12 rounded-lg overflow-hidden border text-left transition-all ${
                                    isSelected ? "border-emerald-600 ring-2 ring-emerald-500/20" : "border-gray-200 hover:border-gray-300"
                                  }`}
                                >
                                  <img src={preset.url} alt={preset.name} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-200" referrerPolicy="no-referrer" />
                                  <div className="absolute inset-0 bg-black/40 hover:bg-black/30 transition-colors flex items-end p-1">
                                    <span className="text-[9px] font-bold text-white truncate w-full">{preset.name}</span>
                                  </div>
                                  {isSelected && (
                                    <div className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full bg-emerald-600 flex items-center justify-center text-[7px] text-white font-bold shadow-xs">
                                      ✓
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Hero backdrop video (Upload / Gallery / Custom URL) */
                    <div className="md:col-span-2 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest">
                          Bosh sahifa Video foni sozlamalari
                        </label>
                        <span className="text-[11px] text-emerald-600 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-full">Min: 5s, Max: 20s</span>
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-4 p-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
                        {/* Left: Custom preview & File Uploader */}
                        <div className="flex-1 space-y-2">
                          <div className="relative h-28 w-full rounded-lg overflow-hidden border border-gray-100 bg-zinc-900 flex items-center justify-center">
                            {settingsForm.heroVideoUrl ? (
                              <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-xs text-white font-bold p-2 text-center">
                                <video src={settingsForm.heroVideoUrl} muted className="h-full w-full object-cover opacity-65 absolute inset-0 pointer-events-none" autoPlay loop playsInline />
                                <span className="relative z-10 text-[10px] bg-slate-900/80 px-2 py-1 rounded-md max-w-full truncate">{settingsForm.heroVideoUrl}</span>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400 font-medium">Video tanlanmagan</span>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={settingsForm.heroVideoUrl || ""}
                              onChange={(e) => setSettingsForm({ ...settingsForm, heroVideoUrl: e.target.value })}
                              placeholder="To'g'ridan-to'g'ri MP4 havolasini kiriting..."
                              className="w-full text-xs rounded-lg border border-gray-200 p-2.5 bg-white outline-none focus:border-emerald-500"
                            />

                            <div className="flex items-center justify-between gap-2">
                              <input
                                type="file"
                                accept="video/*"
                                id="settings-video-file"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    if (file.size > 75 * 1024 * 1024) {
                                      alert("Kompyuterdan yuklanadigan video hajmi maksimal 75MB bo'lishi kerak!");
                                      return;
                                    }
                                    setCheckingVideo(true);
                                    try {
                                      const uploadedUrl = await uploadFileToServer(file);
                                      setSettingsForm(prev => ({ ...prev, heroVideoUrl: uploadedUrl }));
                                      checkVideoDuration(uploadedUrl);
                                    } catch (err: any) {
                                      alert(err.message || "Video yuklashda xatolik yuz berdi");
                                    } finally {
                                      setCheckingVideo(false);
                                    }
                                  }
                                }}
                              />
                              <label
                                htmlFor="settings-video-file"
                                className="inline-flex cursor-pointer rounded-lg bg-[#051C15] px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-[#1a4436] shadow-xs transition-all"
                              >
                                💻 Kompyuterdan tanlash
                              </label>

                              {checkingVideo && (
                                <span className="text-[10px] text-gray-500 animate-pulse font-bold">Tekshirilmoqda...</span>
                              )}
                            </div>

                            {/* Validation feedback */}
                            {videoDurationError ? (
                              <div className="rounded-lg bg-red-50 border border-red-200 p-2 text-rose-700 text-[11px] font-bold flex gap-1 items-start">
                                ⚠️ <span>{videoDurationError}</span>
                              </div>
                            ) : settingsForm.heroVideoUrl ? (
                              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2 text-emerald-800 text-[11px] font-semibold flex items-center gap-1">
                                ✅ <span>Video qabul qilinadi. 5-20 sekund talabiga 100% javob beradi.</span>
                              </div>
                            ) : null}
                          </div>
                        </div>

                        {/* Right: Curated Presets list */}
                        <div className="flex-1 space-y-2">
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Yoki sifatli video namunalardan tanlang:</span>
                          <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto pr-1">
                            {HERO_VIDEO_PRESETS.map((preset) => {
                              const isSelected = settingsForm.heroVideoUrl === preset.url;
                              return (
                                <button
                                  key={preset.id}
                                  type="button"
                                  onClick={() => setSettingsForm({ ...settingsForm, heroVideoUrl: preset.url })}
                                  className={`group relative text-left border flex rounded-lg p-2 items-center gap-3 transition-all ${
                                    isSelected ? "border-emerald-600 bg-emerald-50" : "border-gray-200 hover:border-gray-300 bg-white"
                                  }`}
                                >
                                  <div className="h-10 w-16 bg-slate-200 rounded-md overflow-hidden relative flex items-center justify-center">
                                    <video src={preset.url} muted className="h-full w-full object-cover" />
                                    <span className="absolute bottom-0 right-0 bg-black/75 text-[8px] text-white px-1">Loop</span>
                                  </div>
                                  <div className="flex-1 overflow-hidden">
                                    <p className="text-[11px] font-black leading-tight text-gray-800 truncate">{preset.name}</p>
                                    <span className="text-[9px] text-gray-400">Tasdiqlangan namuna</span>
                                  </div>
                                  {isSelected && (
                                    <div className="h-4 w-4 rounded-full bg-emerald-600 flex items-center justify-center text-[10px] text-white font-black">
                                      ✓
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Contacts details */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1.5">Aloqa telefoni</label>
                    <input
                      type="text"
                      required
                      value={settingsForm.phone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:bg-white"
                      placeholder="+998 (90) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1.5">Elektron Pochta</label>
                    <input
                      type="email"
                      required
                      value={settingsForm.email}
                      onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:bg-white"
                      placeholder="contact@uzedu.uz"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1.5">O'quv manzili (Matn ko'rinishida)</label>
                    <input
                      type="text"
                      required
                      value={settingsForm.address}
                      onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:bg-white"
                      placeholder="Toshkent shahri, Chilonzor tumani..."
                    />
                  </div>

                  {/* Social Networks links */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1.5">Telegram havola</label>
                    <input
                      type="text"
                      value={settingsForm.telegram}
                      onChange={(e) => setSettingsForm({ ...settingsForm, telegram: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1.5">Instagram havola</label>
                    <input
                      type="text"
                      value={settingsForm.instagram}
                      onChange={(e) => setSettingsForm({ ...settingsForm, instagram: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:bg-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1.5">O'quv markazi haqida to'liq matn (Biz haqimizda sahifasiga)</label>
                    <textarea
                      required
                      rows={4}
                      value={settingsForm.aboutText}
                      onChange={(e) => setSettingsForm({ ...settingsForm, aboutText: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm outline-none focus:border-emerald-500 focus:bg-white"
                      placeholder="O'quv markazimiz shu kunga qadar o'g'ituvchilari..."
                    />
                  </div>
                </div>

                {/* CSS animation style injected for shake effect */}
                <style>{`
                  @keyframes buttonShake {
                    0%, 100% { transform: translateX(0); }
                    15% { transform: translateX(-8px); }
                    30% { transform: translateX(6px); }
                    45% { transform: translateX(-5px); }
                    60% { transform: translateX(4px); }
                    75% { transform: translateX(-2px); }
                    90% { transform: translateX(1px); }
                  }
                  .animate-button-shake {
                    animation: buttonShake 0.4s ease-in-out;
                  }
                `}</style>

                <div className="flex justify-end pt-4">
                  {(() => {
                    const isSettingsFormChanged = 
                      settingsForm.name !== initialSettings.name ||
                      settingsForm.logoText !== initialSettings.logoText ||
                      settingsForm.heroTitle !== initialSettings.heroTitle ||
                      settingsForm.heroSubtitle !== initialSettings.heroSubtitle ||
                      settingsForm.heroBgImage !== initialSettings.heroBgImage ||
                      settingsForm.phone !== initialSettings.phone ||
                      settingsForm.email !== initialSettings.email ||
                      settingsForm.address !== initialSettings.address ||
                      settingsForm.mapsUrl !== initialSettings.mapsUrl ||
                      settingsForm.aboutText !== initialSettings.aboutText ||
                      settingsForm.telegram !== initialSettings.telegram ||
                      settingsForm.instagram !== initialSettings.instagram ||
                      settingsForm.facebook !== initialSettings.facebook ||
                      settingsForm.youtube !== initialSettings.youtube ||
                      JSON.stringify(settingsForm.features) !== JSON.stringify(initialSettings.features);

                    let buttonClass = "flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition-all duration-300 ";
                    let buttonLabel = "Branding Sozlamalarini Saqlash";

                    if (justSaved) {
                      buttonClass += "bg-emerald-600 text-white shadow-md animate-pulse";
                      buttonLabel = "Muvaffaqiyatli saqlandi! ✔";
                    } else if (isSettingsFormChanged) {
                      buttonClass += "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg active:scale-95";
                      if (settingsLoading) buttonLabel = "Saqlanmoqda...";
                    } else {
                      // Pale color when there are no changes
                      buttonClass += "bg-emerald-600/10 text-emerald-800/60 border border-emerald-600/15 hover:bg-emerald-600/15";
                    }

                    if (btnShake) {
                      buttonClass += " animate-button-shake ring-2 ring-red-500/30";
                    }

                    return (
                      <button
                        type="submit"
                        disabled={settingsLoading}
                        className={buttonClass}
                      >
                        <Save size={18} />
                        <span>{buttonLabel}</span>
                      </button>
                    );
                  })()}
                </div>
              </form>
            </div>
          )}

          {/* ==================== COURSES TAB ==================== */}
          {activeTab === "courses" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-gray-500">{courses.length} ta dars yo'nalishlari topildi</span>
                <button
                  onClick={openCourseAdd}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white transition-colors"
                >
                  <Plus size={16} />
                  <span>Yangi Kurs Qo'shish</span>
                </button>
              </div>

              {courses.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 text-sm">Hozircha hech qanday dars mavjud emas. Yangisini qo'shing.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => {
                    const teacher = teachers.find(t => t.id === course.teacherId);
                    return (
                      <div key={course.id} className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden flex flex-col justify-between">
                        <div className="aspect-16/9 w-full bg-slate-100 relative">
                          <img
                            src={course.image || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=400&auto=format&fit=crop"}
                            className="w-full h-full object-cover"
                            alt={course.name}
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute top-3 left-3 bg-indigo-600 text-white rounded-lg px-2.5 py-0.5 text-[10px] font-bold">
                            {course.category}
                          </span>
                        </div>
                        <div className="p-4 flex-1 space-y-2">
                          <h4 className="text-base font-bold text-gray-900 line-clamp-1">{course.name}</h4>
                          <p className="text-xs text-gray-400 line-clamp-2">{course.description}</p>
                          <div className="pt-2 border-t border-gray-50 grid grid-cols-2 gap-y-1.5 text-[11px] text-gray-500">
                            <div>Kunlar: <strong className="text-gray-700">{course.days}</strong></div>
                            <div>Soat: <strong className="text-gray-700">{course.time}</strong></div>
                            <div>Davomiyligi: <strong className="text-gray-700">{course.duration}</strong></div>
                            <div>Mentor: <strong className="text-gray-700 truncate block">{teacher ? teacher.name : "Kiritilmagan"}</strong></div>
                          </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-100">
                          <strong className="text-sm text-emerald-600">{course.price}</strong>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openCourseEdit(course)}
                              className="p-2 rounded-lg bg-white border border-gray-200 text-slate-600 hover:text-indigo-600 transition-colors"
                              title="Tahrirlash"
                            >
                              <Edit size={14} />
                            </button>
                            {confirmDeleteCourseId === course.id ? (
                              <div className="flex items-center gap-1 bg-rose-50 border border-rose-100 p-0.5 rounded-lg animate-fadeIn">
                                <button
                                  onClick={() => {
                                    handleCourseDelete(course.id);
                                    setConfirmDeleteCourseId(null);
                                  }}
                                  className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black"
                                >
                                  Ha
                                </button>
                                <button
                                  onClick={() => setConfirmDeleteCourseId(null)}
                                  className="px-2 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-705 text-[10px] font-black"
                                >
                                  Yo'q
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmDeleteCourseId(course.id)}
                                className="p-2 rounded-lg bg-white border border-gray-200 text-slate-600 hover:text-rose-600 transition-colors"
                                title="O'chirish"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ==================== TEACHERS TAB ==================== */}
          {activeTab === "teachers" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-gray-500">{teachers.length} nafar o'qituvchilar topildi</span>
                <button
                  onClick={openTeacherAdd}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white transition-colors"
                >
                  <Plus size={16} />
                  <span>Yangi O'qituvchi</span>
                </button>
              </div>

              {teachers.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 text-sm">Ustozlar yo'q. Birinchisini qo'shing.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teachers.map((teacher) => {
                    const defaultMaleAvatar = "https://cdn-icons-png.flaticon.com/256/149/149071.png";
                    const defaultFemaleAvatar = "https://gdm.com.pk/img/testimonial-1.jpg";
                    const profileFallback = teacher.gender === "ayol" ? defaultFemaleAvatar : defaultMaleAvatar;
                    const teacherImg = (teacher.image && teacher.image.trim() !== "") ? teacher.image : profileFallback;
                    
                    return (
                      <div key={teacher.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-start gap-4">
                        <img
                          src={teacherImg}
                          className="w-16 h-16 rounded-full object-cover shrink-0 border border-gray-100"
                          alt={teacher.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = profileFallback;
                          }}
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider block">{teacher.specialty}</span>
                          <h4 className="text-base font-bold text-gray-900 truncate mt-0.5">{teacher.name}</h4>
                          {teacher.slogan && <p className="text-xs italic font-medium text-indigo-600 mt-0.5">"{teacher.slogan}"</p>}
                          <p className="text-xs text-gray-400 font-medium font-mono mt-0.5">
                            {teacher.experience} tajriba {teacher.phone ? `• ${teacher.phone}` : ""}
                          </p>
                          <p className="text-xs text-gray-500 line-clamp-2 mt-1.5">{teacher.bio}</p>
                          
                          <div className="flex gap-2 mt-4 justify-end items-center">
                            <button
                              onClick={() => openTeacherEdit(teacher)}
                              className="px-2.5 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-xs text-slate-600 hover:text-indigo-600 hover:bg-white"
                            >
                              Tahrirlash
                            </button>
                            
                            {confirmDeleteTeacherId === teacher.id ? (
                              <div className="flex items-center gap-1 bg-rose-50 border border-rose-100 p-1 rounded-lg animate-fadeIn">
                                <span className="text-[9px] font-bold text-rose-500 mr-1">Rostdanmi?</span>
                                <button
                                  onClick={() => {
                                    handleTeacherDelete(teacher.id);
                                    setConfirmDeleteTeacherId(null);
                                  }}
                                  className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black"
                                >
                                  Ha
                                </button>
                                <button
                                  onClick={() => setConfirmDeleteTeacherId(null)}
                                  className="px-2 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-705 text-[10px] font-black"
                                >
                                  Yo'q
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmDeleteTeacherId(teacher.id)}
                                className="px-2.5 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                              >
                                O'chirish
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ==================== LEADS & CRM PIPELINE ==================== */}
          {activeTab === "leads" && (
            <div className="space-y-4">
              {/* Pipeline filtering ribbon */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-100 font-sans">
                <div className="flex flex-wrap gap-2">
                  {["all", "yangi", "suhbatda", "oqiyapti", "rad-etildi"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSelectedLeadStatusFilter(filter)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                        selectedLeadStatusFilter === filter 
                          ? "bg-slate-900 text-white shadow-xs" 
                          : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      {filter === "all" ? "Barchasi" : 
                       filter === "yangi" ? "Yangi" : 
                       filter === "suhbatda" ? "Suhbatda" : 
                       filter === "oqiyapti" ? "O'qiyotgan Talaba" : 
                       "Rad etildi"}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-gray-400">Jami: {filteredLeads.length} ta ariza</span>
                  <button
                    onClick={openLeadAdd}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-605 bg-emerald-600 hover:bg-emerald-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Yangi Ariza Qo'shish</span>
                  </button>
                </div>
              </div>

              {filteredLeads.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 text-sm">Ma'lumot topilmadi.</div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-400 font-bold tracking-widest font-mono">
                          <th className="p-4">Talaba Ismi / Tel</th>
                          <th className="p-4">Tanlangan Kurs</th>
                          <th className="p-4">Murojaat Sanasi</th>
                          <th className="p-4">Guruh statusi</th>
                          <th className="p-4">Kuryer Eslatmalari (Staff Notes)</th>
                          <th className="p-4 text-right">Amallar</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredLeads.map((lead) => {
                          const course = courses.find(c => c.id === lead.courseId);
                          return (
                            <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="p-4">
                                <div className="font-bold text-gray-900">{lead.studentName}</div>
                                <div className="text-xs font-mono text-gray-500 mt-0.5">{lead.phone}</div>
                              </td>
                              <td className="p-4">
                                <span className="font-semibold text-indigo-600">
                                  {course ? course.name : "Tashqi Konsultatsiya"}
                                </span>
                              </td>
                              <td className="p-4 text-xs font-mono text-gray-400">
                                {new Date(lead.createdAt).toLocaleString("uz-UZ")}
                              </td>
                              <td className="p-4">
                                <select
                                  value={lead.status}
                                  onChange={(e) => handleLeadStatusChange(lead.id, e.target.value as Lead["status"])}
                                  className="text-xs font-semibold rounded-lg border border-gray-200 bg-white p-1 text-gray-700 focus:outline-none"
                                >
                                  <option value="yangi">Yangi</option>
                                  <option value="suhbatda">Suhbatda</option>
                                  <option value="oqiyapti">O'qiyotgan talaba</option>
                                  <option value="rad-etildi">Rad etildi</option>
                                </select>
                              </td>
                              <td className="p-4">
                                <input
                                  type="text"
                                  placeholder="Eslatma yozish (Enter bosing)..."
                                  defaultValue={lead.notes}
                                  onBlur={(e) => handleLeadNotesBlur(lead.id, e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      handleLeadNotesBlur(lead.id, (e.target as HTMLInputElement).value);
                                      (e.target as HTMLInputElement).blur();
                                      alert("Izoh muvaffaqiyatli saqlandi!");
                                    }
                                  }}
                                  className="w-full bg-transparent text-xs text-gray-600 outline-none hover:bg-gray-100 p-1 rounded border border-transparent focus:border-slate-200"
                                />
                              </td>
                              <td className="p-4 text-right">
                                {confirmDeleteLeadId === lead.id ? (
                                  <div className="flex items-center justify-end gap-1 animate-fadeIn">
                                    <button
                                      onClick={() => {
                                        handleLeadDelete(lead.id);
                                        setConfirmDeleteLeadId(null);
                                      }}
                                      className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black"
                                    >
                                      Ha
                                    </button>
                                    <button
                                      onClick={() => setConfirmDeleteLeadId(null)}
                                      className="px-2 py-0.5 rounded bg-slate-200 hover:bg-slate-300 text-slate-705 text-[10px] font-black"
                                    >
                                      Yo'q
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => openLeadEdit(lead)}
                                      className="p-1 text-slate-400 hover:text-indigo-600 rounded cursor-pointer"
                                      title="Tahrirlash"
                                    >
                                      <Edit size={16} />
                                    </button>
                                    <button
                                      onClick={() => setConfirmDeleteLeadId(lead.id)}
                                      className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                                      title="Arizani o'chirish"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== AI COPILOT TAB ==================== */}
          {activeTab === "ai-copilot" && (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Introduction Card */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 relative overflow-hidden shadow-lg border border-slate-800">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none transform translate-x-4 -translate-y-4">
                  <Sparkles size={160} className="text-indigo-400" />
                </div>
                <div className="relative z-10 flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shrink-0">
                    <Sparkles size={24} className="animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold font-sans">Full-Stack AI Administrator Terminal</h2>
                      <span className="bg-emerald-500 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">Online</span>
                    </div>
                    <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
                      Siz ushbu interfeys orqali o'quv markazining so'rovlarini tahlil qilishingiz, mavjud ma'lumotlar ustida amallar qilishingiz yoki yagona jumlada mutatsiyalarni so'rashingiz mumkin.
                      AI barcha buyruqlar va tahrirlarni so'zsiz va bevosita databazaga yozgan holda amalga oshiradi!
                    </p>
                  </div>
                </div>
              </div>

              {/* Ready presets */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 font-mono">Tezkor buyruq shablonlari:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "O'quv markazimiz nomini Apex Academy dan London School ga o'zgartir",
                    "Guruhlarni qisman tahlil qil, kimlar o'qiyotgani va nechta ariza borligini hisoblab ber",
                    "Yangi ustoz qo'sh: ismi Tolib Qodirov, Mutaxassisligi: Python Mentor, tajribasi 4 yil, jinsi erkak, bio yozib ber",
                    "Kurs davomiyligi 3 oy bo'lgan yangi 'Grafik Dizayn' kursini narxi 500 000 so'm qilib qo'sh"
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCopilotMessage(preset)}
                      className="text-left bg-white border border-gray-100 hover:border-indigo-300 rounded-xl p-3 text-xs text-gray-700 font-medium hover:bg-indigo-50/20 transition-all font-sans cursor-pointer hover:shadow-xs flex items-center gap-2"
                    >
                      <span className="h-5 w-5 rounded-md bg-indigo-50 flex items-center justify-center text-indigo-500 font-bold shrink-0">{idx + 1}</span>
                      <span className="truncate">{preset}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive terminal screen */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col h-[500px] overflow-hidden">
                {/* Channel Header bar */}
                <div className="bg-gray-50 border-b border-gray-100 p-4 shrink-0 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping"></div>
                    <span className="text-xs font-bold text-gray-700 font-mono">CO-PILOT_DATABASE_CONNECTION</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setCopilotChat([{ sender: "ai", text: "Tizim tozalab o'rnatildi. Yangi topshiriqlarni kutaman..." }])}
                    className="text-[10px] text-gray-400 hover:text-gray-905 uppercase font-bold font-mono transition-colors cursor-pointer"
                  >
                    chatni tozalash (Clear)
                  </button>
                </div>

                {/* Dialog Stream */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
                  {copilotChat.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xl rounded-2xl px-4 py-3 text-sm shadow-2xs leading-relaxed ${
                          msg.sender === "user"
                            ? "bg-slate-900 text-white rounded-tr-none"
                            : "bg-white border border-gray-100 text-gray-800 rounded-tl-none"
                        }`}
                      >
                        {/* Message body */}
                        <div className="whitespace-pre-wrap">{msg.text}</div>

                        {/* Actions feedback loop if any database change happened */}
                        {msg.actions && msg.actions.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1 font-mono">
                              <CheckCircle size={11} />
                              AI Amallari bajarildi ({msg.actions.length}):
                            </span>
                            <div className="space-y-1">
                              {msg.actions.map((act, aIdx) => (
                                <div key={aIdx} className="text-xs bg-slate-50 border border-slate-100 rounded-lg p-2 font-mono flex items-center gap-1.5 text-slate-700">
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                  <strong>{act.type}:</strong> {JSON.stringify(act.payload).substring(0, 100)}...
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {copilotLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-2xs flex items-center gap-2">
                        <div className="flex gap-1.5 animate-pulse">
                          <span className="h-2 w-2 rounded-full bg-slate-600 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                          <span className="h-2 w-2 rounded-full bg-slate-600 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                          <span className="h-2 w-2 rounded-full bg-slate-600 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                        </div>
                        <span className="text-xs font-medium text-gray-500 font-mono">Copilot databazani tahlil qilmoqda...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sender Command bar */}
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!copilotMessage.trim() || copilotLoading) return;

                    const command = copilotMessage.trim();
                    setCopilotMessage("");
                    setCopilotChat(prev => [...prev, { sender: "user", text: command }]);
                    setCopilotLoading(true);

                    try {
                      const res = await fetch("/api/ai/copilot", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ message: command })
                      });
                      
                      const data = await res.json();
                      if (res.ok) {
                        setCopilotChat(prev => [...prev, {
                          sender: "ai",
                          text: data.reply,
                          actions: data.actions
                        }]);
                        if (data.dbModified) {
                          onRefreshData(); // Instant reload!
                        }
                      } else {
                        setCopilotChat(prev => [...prev, {
                          sender: "ai",
                          text: data.error || "Xatolik yuz berdi. Iltimos, boshqa buyruq bering."
                        }]);
                      }
                    } catch (err: any) {
                      setCopilotChat(prev => [...prev, {
                        sender: "ai",
                        text: "Aloqa xatoligi: " + (err.message || "Ulanib bo'lmadi.")
                      }]);
                    } finally {
                      setCopilotLoading(false);
                    }
                  }}
                  className="bg-gray-50 border-t border-gray-100 p-4 shrink-0 flex gap-3"
                >
                  <input
                    type="text"
                    value={copilotMessage}
                    onChange={(e) => setCopilotMessage(e.target.value)}
                    disabled={copilotLoading}
                    placeholder="Masalan: 'O'quv markaz logotip matnini FAST ACADEMY qil va o'qituvchilarni tahlil qil'"
                    className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 font-sans shadow-2xs placeholder-gray-400"
                  />
                  <button
                    type="submit"
                    disabled={copilotLoading || !copilotMessage.trim()}
                    className="rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 px-5 text-sm font-bold text-white shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <span>Yuborish</span>
                    <Send size={14} />
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ==================== CREATE/EDIT COURSE MODAL ==================== */}
      {showCourseModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-950/70 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-lg font-sans">
                {editingCourse ? "Kurs Tafsilotlarini Tahrirlash" : "Yangi Kurs Qo'shish"}
              </h3>
              <button onClick={() => setShowCourseModal(false)} className="text-white/70 hover:text-white"><XCircle size={20} /></button>
            </div>
            
            <form onSubmit={handleCourseSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Kurs Nomi</label>
                  <input
                    type="text"
                    required
                    value={courseForm.name}
                    onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm"
                    placeholder="Masalan: IELTS 7.5 Intensive"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Fani / Yo'nalish Kategoriya</label>
                  <select
                    value={courseForm.category}
                    onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm appearance-none"
                  >
                    <option value="English">English</option>
                    <option value="IT">IT & Programming</option>
                    <option value="Matematika">Matematika</option>
                    <option value="Kids">Kids Courses</option>
                    <option value="Kimyo/Biologiya">Kimyo / Biologiya</option>
                  </select>
                </div>

                {/* AI integration tools to generate descriptors! */}
                <div className="md:col-span-2 bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200">
                  <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
                    <Sparkles size={14} className="text-yellow-500 animate-pulse" />
                    <span>AI Kurs Ta'rifini Yaratuvchi (Server Side Gemini)</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Qo'shimcha yo'nalish bering (masalan: 3 kun haftada, muloqot va listening mashqlari, IELTS 8 ball o'qituvchidan)"
                      value={courseAIContext}
                      onChange={(e) => setCourseAIContext(e.target.value)}
                      className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleAIFieldGenerate("course")}
                      disabled={courseAILoading}
                      className="rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white transition-all duration-150 disabled:opacity-50 flex items-center gap-1 shrink-0"
                    >
                      {courseAILoading ? "Yaratilmoqda..." : "AI Yaratish"}
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Kurs haqida qisqacha ta'rif</label>
                  <textarea
                    required
                    rows={3}
                    value={courseForm.description}
                    onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm focus:bg-white resize-none"
                    placeholder="Kurs haqida to'liq va jozibador ma'lumot..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Haftalik kunlar</label>
                  <input
                    type="text"
                    required
                    value={courseForm.days}
                    onChange={(e) => setCourseForm({ ...courseForm, days: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm"
                    placeholder="Masalan: Dush - Chor - Jum"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Dars Vaqti (Soni)</label>
                  <input
                    type="text"
                    required
                    value={courseForm.time}
                    onChange={(e) => setCourseForm({ ...courseForm, time: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm"
                    placeholder="Masalan: 14:00 - 16:00"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Har oylik To'lov narxi</label>
                  <input
                    type="text"
                    required
                    value={courseForm.price}
                    onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm"
                    placeholder="Masalan: 450 000 so'm / oy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Kurs Davomiyligi</label>
                  <input
                    type="text"
                    required
                    value={courseForm.duration}
                    onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm"
                    placeholder="Masalan: 6 oy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Ustozni Biriktiring</label>
                  <select
                    value={courseForm.teacherId}
                    onChange={(e) => setCourseForm({ ...courseForm, teacherId: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm appearance-none"
                  >
                    <option value="">O'qituvchisiz (E'lon qilinadi)</option>
                    {teachers.map(teacher => (
                      <option key={teacher.id} value={teacher.id}>{teacher.name} ({teacher.specialty})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Xona Sig'imi (O'quvchi)</label>
                  <input
                    type="number"
                    required
                    value={courseForm.capacity}
                    onChange={(e) => setCourseForm({ ...courseForm, capacity: Number(e.target.value) })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm"
                    placeholder="12"
                  />
                </div>

                {/* Course Banner selection (Upload or Preset Gallery) */}
                <div className="md:col-span-2 space-y-3">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                    Kurs Banner Rasmi (Yuklang yoki Galereyadan tanlang)
                  </label>
                  
                  <div className="flex flex-col md:flex-row gap-4 p-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
                    {/* Left Custom preview & File Uploader */}
                    <div className="flex-1 space-y-2">
                      <div className="relative h-24 w-full rounded-lg overflow-hidden border border-gray-150 bg-slate-100 flex items-center justify-center">
                        {courseForm.image ? (
                          <>
                            <img src={courseForm.image} alt="Course Preview" className="h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-black/25 flex items-center justify-center text-[11px] text-white font-bold backdrop-blur-xs">
                              Tanlangan Banner
                            </div>
                          </>
                        ) : (
                          <span className="text-[11px] text-gray-400 font-medium">Bannersiz (Keluvchi rasm)</span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          id="course-bg-file"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 10 * 1024 * 1024) {
                                alert("Rasm juda katta! Maks: 10MB.");
                                return;
                              }
                              setCourseLoading(true);
                              try {
                                const uploadedUrl = await uploadFileToServer(file);
                                setCourseForm(prev => ({ ...prev, image: uploadedUrl }));
                              } catch (err: any) {
                                alert(err.message || "Rasm yuklashda xatolik");
                              } finally {
                                setCourseLoading(false);
                              }
                            }
                          }}
                        />
                        <label
                          htmlFor="course-bg-file"
                          className="inline-flex cursor-pointer rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 shadow-xs"
                        >
                          Rasm Yuklash
                        </label>
                        {courseForm.image && (
                          <button
                            type="button"
                            onClick={() => setCourseForm(prev => ({ ...prev, image: "" }))}
                            className="text-xs text-red-650 hover:underline font-bold"
                          >
                            O'chirish
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Right: Gallery Presets */}
                    <div className="flex-1 space-y-2">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Yoki dars yo'nalishiga qarab tanlang:</span>
                      <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto pr-1">
                        {COURSE_BANNER_PRESETS.map((preset) => {
                          const isSelected = courseForm.image === preset.url;
                          return (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => setCourseForm({ ...courseForm, image: preset.url })}
                              className={`group relative h-10 rounded-lg overflow-hidden border text-left transition-all ${
                                isSelected ? "border-emerald-600 ring-2 ring-emerald-500/20" : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <img src={preset.url} alt={preset.name} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-200" />
                              <div className="absolute inset-0 bg-black/40 hover:bg-black/30 transition-colors flex items-end p-1">
                                <span className="text-[9px] font-bold text-white truncate w-full">{preset.name}</span>
                              </div>
                              {isSelected && (
                                <div className="absolute top-0.5 right-0.5 h-3 w-3 rounded-full bg-emerald-600 flex items-center justify-center text-[7px] text-white font-bold shadow-xs">
                                  ✓
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={courseLoading}
                  className="rounded-xl bg-slate-900 hover:bg-slate-800 px-5 py-2.5 text-sm font-bold text-white shadow-md"
                >
                  {courseLoading ? "Saqlanmoqda..." : "Saqlash va Chonish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== CREATE/EDIT TEACHER MODAL ==================== */}
      {showTeacherModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-950/70 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between shrink-0">
              <h3 className="font-bold text-lg font-sans">
                {editingTeacher ? "O'qituvchi Profilini Tahrirlash" : "Yangi Ustoz Qo'shish"}
              </h3>
              <button onClick={() => setShowTeacherModal(false)} className="text-white/70 hover:text-white cursor-pointer"><XCircle size={20} /></button>
            </div>
            
            <form onSubmit={handleTeacherSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-slate-800">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Ism va Familiya</label>
                <input
                  type="text"
                  required
                  value={teacherForm.name || ""}
                  onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm"
                  placeholder="Ism va Familiyani kiriting"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Mutaxassisligi (Yo'nalishi / Scentist)</label>
                <input
                  type="text"
                  required
                  value={teacherForm.specialty || ""}
                  onChange={(e) => setTeacherForm({ ...teacherForm, specialty: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm"
                  placeholder="Masalan: Matematika o'qituvchisi, Rossiya darslari koordinatori"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Ustozning Shiori (Slogan / Quote)</label>
                <input
                  type="text"
                  value={teacherForm.slogan || ""}
                  onChange={(e) => setTeacherForm({ ...teacherForm, slogan: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm"
                  placeholder="Masalan: Muvaffaqiyat - to'xtovsiz harakat natijasidir."
                />
              </div>

              {/* AI integration tools to generate Teacher Bio! */}
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-dashed border-emerald-200">
                <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1.5">
                  <Sparkles size={14} className="text-[#52e0a5] animate-pulse" />
                  <span>AI Mukammal Tarjimai Hol (Bio) Yozuvchi</span>
                </div>
                
                <p className="text-[11px] text-emerald-950/80 mb-3 leading-relaxed">
                  O'zingiz haqingizda ozgina ma'lumot bering (masalan: qaysi fandan o'tishingiz, tajribangiz, yoki muhim dars yutuqlaringiz) va men sizga har safar butunlay takrorlanmas, ajoyib va professional Bio yozib beraman! ✨
                </p>

                <div className="flex flex-col gap-2">
                  <textarea
                    rows={2}
                    placeholder="Masalan: Ingliz tili fani, IELTS 8.5 ball, 5 yillik tajriba, dars uslubi juda interaktiv va quvnoq."
                    value={teacherAIContext}
                    onChange={(e) => setTeacherAIContext(e.target.value)}
                    className="w-full rounded-lg border border-emerald-100 bg-white p-2.5 text-xs outline-none focus:border-emerald-500 text-zinc-805 placeholder-zinc-400"
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleAIFieldGenerate("teacher")}
                      disabled={teacherAILoading}
                      className="rounded-lg bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-bold text-white transition-all duration-150 disabled:opacity-50 flex items-center justify-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
                    >
                      {teacherAILoading ? (
                        <>
                          <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span>AI o'ylamoqda...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={12} className="text-yellow-305" />
                          <span>Chiroyli Bio Yozish</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">O'qituvchi Tarjimai holi (Bio)</label>
                <textarea
                  required
                  rows={3}
                  value={teacherForm.bio}
                  onChange={(e) => setTeacherForm({ ...teacherForm, bio: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm focus:bg-white resize-none"
                  placeholder="Mukammal tarjimai hol..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tajribasi</label>
                  <input
                    type="text"
                    required
                    value={teacherForm.experience}
                    onChange={(e) => setTeacherForm({ ...teacherForm, experience: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm"
                    placeholder="Masalan: 5 yil"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Telefon raqami</label>
                  <input
                    type="text"
                    value={teacherForm.phone || ""}
                    onChange={(e) => setTeacherForm({ ...teacherForm, phone: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm"
                    placeholder="+998 90 123-4567"
                  />
                </div>
              </div>

              {/* Jinsi (Gender) Section for fallbacks */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Jinsi (Default Rasm uchun)</label>
                <div className="flex gap-4">
                  <label className="flex-1 flex items-center justify-center gap-2 cursor-pointer rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors">
                    <input
                      type="radio"
                      name="gender"
                      value="erkak"
                      checked={teacherForm.gender === "erkak"}
                      onChange={() => setTeacherForm({ ...teacherForm, gender: "erkak" })}
                      className="accent-slate-900"
                    />
                    <span>Erkak</span>
                  </label>
                  <label className="flex-1 flex items-center justify-center gap-2 cursor-pointer rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors">
                    <input
                      type="radio"
                      name="gender"
                      value="ayol"
                      checked={teacherForm.gender === "ayol"}
                      onChange={() => setTeacherForm({ ...teacherForm, gender: "ayol" })}
                      className="accent-slate-900"
                    />
                    <span>Ayol</span>
                  </label>
                </div>
              </div>

              {/* Advanced Dual Image Upload & Preset Gallery (No manual text URLs) */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-gray-700 uppercase">Profil Rasmi (Yuklang yoki Galereyadan tanlang)</label>
                
                <div className="flex flex-col gap-4 p-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
                  {/* Visual Preview / Upload Box */}
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-gray-100 bg-white shadow-xs">
                      {teacherForm.image ? (
                        <img
                          src={teacherForm.image}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-gray-400 font-medium">
                          Rasm yo'q
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] text-gray-500 mb-2">Telefon, Planshet yoki Laptoptan yuklang (Maks: 10MB)</p>
                      <input
                        type="file"
                        accept="image/*"
                        id="teacher-file-input"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 10 * 1024 * 1024) {
                              alert("Rasm hajmi juda katta! Maks: 10MB.");
                              return;
                            }
                            setTeacherLoading(true);
                            try {
                              const uploadedUrl = await uploadFileToServer(file);
                              setTeacherForm(prev => ({ ...prev, image: uploadedUrl }));
                            } catch (err: any) {
                              alert(err.message || "Rasm yuklashda xatolik yuz berdi");
                            } finally {
                              setTeacherLoading(false);
                            }
                          }
                        }}
                      />
                      <label
                        htmlFor="teacher-file-input"
                        className="inline-flex cursor-pointer rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 shadow-xs"
                      >
                        Rasm tanlash
                      </label>
                      {teacherForm.image && (
                        <button
                          type="button"
                          onClick={() => setTeacherForm({ ...teacherForm, image: "" })}
                          className="ml-3 text-xs font-semibold text-red-600 hover:underline"
                        >
                          O'chirish
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Curator presets (dynamic based on gender) */}
                  <div className="border-t border-gray-100 pt-3 space-y-2">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                      Yoki jinsiga mos professional fotolardan tanlang:
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {TEACHER_AVATAR_PRESETS[teacherForm.gender === "ayol" ? "ayol" : "erkak"].map((preset) => {
                        const isSelected = teacherForm.image === preset.url;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => setTeacherForm({ ...teacherForm, image: preset.url })}
                            className={`group relative h-14 w-full rounded-lg overflow-hidden border text-left transition-all ${
                              isSelected ? "border-emerald-600 ring-2 ring-emerald-500/20" : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <img src={preset.url} alt={preset.name} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-200" />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-end p-1">
                              <span className="text-[8px] font-bold text-white truncate w-full">{preset.name}</span>
                            </div>
                            {isSelected && (
                              <div className="absolute top-0.5 right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-600 flex items-center justify-center text-[7px] text-white font-bold shadow-xs">
                                ✓
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowTeacherModal(false)}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={teacherLoading}
                  className="rounded-xl bg-slate-900 hover:bg-slate-800 px-5 py-2.5 text-sm font-bold text-white shadow-md"
                >
                  {teacherLoading ? "Saqlanmoqda..." : "Ustozni Saqlash"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== CREATE/EDIT LEAD (MANUAL ENTRY) MODAL ==================== */}
      {showLeadModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-950/70 p-4 backdrop-blur-xs overflow-y-auto font-sans">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between shrink-0">
              <h3 className="font-bold text-lg font-sans text-white">
                {editingLead ? "Ariza Ma'lumotlarini Tahrirlash" : "Yangi Ariza Qo'shish (Offline)"}
              </h3>
              <button type="button" onClick={() => setShowLeadModal(false)} className="text-white/70 hover:text-white cursor-pointer"><XCircle size={20} /></button>
            </div>
            
            <form onSubmit={handleLeadSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-slate-800">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Talabaning Ism va Familiyasi</label>
                <input
                  type="text"
                  required
                  value={leadForm.studentName || ""}
                  onChange={(e) => setLeadForm({ ...leadForm, studentName: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm"
                  placeholder="Masalan: Jamshid Ismoilov"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Telefon raqami</label>
                <input
                  type="text"
                  required
                  value={leadForm.phone || ""}
                  onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-mono"
                  placeholder="+998 90 123-4567"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tanlangan Kurs</label>
                  <select
                    value={leadForm.courseId || ""}
                    onChange={(e) => setLeadForm({ ...leadForm, courseId: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm appearance-none"
                  >
                    <option value="">Tashqi Konsultatsiya / Kurs yo'q</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>{course.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Guruh (Ariza) Statusi</label>
                  <select
                    value={leadForm.status || "yangi"}
                    onChange={(e) => setLeadForm({ ...leadForm, status: e.target.value as Lead["status"] })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm appearance-none"
                  >
                    <option value="yangi">Yangi</option>
                    <option value="suhbatda">Suhbatda</option>
                    <option value="oqiyapti">O'qiyotgan Talaba</option>
                    <option value="rad-etildi">Rad etildi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Eslatmalar / Izohlar (Staff Notes)</label>
                <textarea
                  rows={3}
                  value={leadForm.notes || ""}
                  onChange={(e) => setLeadForm({ ...leadForm, notes: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm focus:bg-white resize-none"
                  placeholder="Mijoz haqida eslatma yozing (masalan: offline keldi, ertaga to'lov qiladi)..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowLeadModal(false)}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={leadLoading}
                  className="rounded-xl bg-slate-900 hover:bg-slate-800 px-5 py-2.5 text-sm font-bold text-white shadow-md cursor-pointer"
                >
                  {leadLoading ? "Saqlanmoqda..." : "Saqlash"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
