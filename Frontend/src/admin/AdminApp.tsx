import type React from "react";
import { useCallback, useEffect, useState } from "react";
import {
  LayoutDashboard,
  Settings,
  BookOpen,
  GraduationCap,
  Users,
  Award,
  Sparkles,
  LogOut,
  ArrowLeft,
  KeyRound,
  Loader2,
  Menu,
  X,
  ArchiveRestore,
} from "lucide-react";
import { api, getToken, setToken } from "../api/client";
import AdminLogin from "./AdminLogin";
import Dashboard from "./sections/Dashboard";
import SettingsPanel from "./sections/SettingsPanel";
import CoursesPanel from "./sections/CoursesPanel";
import TeachersPanel from "./sections/TeachersPanel";
import LeadsPanel from "./sections/LeadsPanel";
import VerifiedLeadsPanel from "./sections/VerifiedLeadsPanel";
import ResultsPanel from "./sections/ResultsPanel";
import CopilotPanel from "./sections/CopilotPanel";
import Modal from "../components/ui/Modal";
import { Field, TextInput } from "./ui/AdminField";
import type {
  Course,
  DashboardStats,
  Lead,
  SchoolSettings,
  StudentResultItem,
  Teacher,
} from "../types";

type SectionId = "dashboard" | "settings" | "courses" | "teachers" | "leads" | "verified" | "results" | "copilot";

const NAV: { id: SectionId; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Boshqaruv paneli", icon: <LayoutDashboard size={18} /> },
  { id: "courses", label: "Kurslar", icon: <BookOpen size={18} /> },
  { id: "teachers", label: "O'qituvchilar", icon: <GraduationCap size={18} /> },
  { id: "leads", label: "Arizalar (CRM)", icon: <Users size={18} /> },
  { id: "verified", label: "Tekshirilgan arizalar", icon: <ArchiveRestore size={18} /> },
  { id: "results", label: "O'quvchilar natijalari", icon: <Award size={18} /> },
  { id: "settings", label: "Sozlamalar", icon: <Settings size={18} /> },
  { id: "copilot", label: "AI Copilot", icon: <Sparkles size={18} /> },
];

export default function AdminApp({ onExit }: { onExit: () => void }) {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [section, setSection] = useState<SectionId>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);

  const [settings, setSettings] = useState<SchoolSettings | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [results, setResults] = useState<StudentResultItem[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const loadAll = useCallback(async () => {
    const [s, c, t, l, r, st] = await Promise.all([
      api.get<SchoolSettings>("/settings"),
      api.get<Course[]>("/courses"),
      api.get<Teacher[]>("/teachers"),
      api.get<Lead[]>("/leads", true),
      api.get<StudentResultItem[]>("/results"),
      api.get<DashboardStats>("/stats", true),
    ]);
    setSettings(s);
    setCourses(c);
    setTeachers(t);
    setLeads(l);
    setResults(r);
    setStats(st);
  }, []);

  // Restore an existing session on mount.
  useEffect(() => {
    (async () => {
      if (!getToken()) {
        setChecking(false);
        return;
      }
      try {
        await api.get("/auth/me", true);
        await loadAll();
        setAuthed(true);
      } catch {
        setToken(null);
      } finally {
        setChecking(false);
      }
    })();
  }, [loadAll]);

  const onLoginSuccess = async () => {
    await loadAll();
    setAuthed(true);
  };

  const logout = () => {
    setToken(null);
    setAuthed(false);
    onExit();
  };

  if (checking) {
    return (
      <div className="bg-aurora flex min-h-screen items-center justify-center text-slate-400">
        <Loader2 size={28} className="animate-spin text-neon-cyan" />
      </div>
    );
  }

  if (!authed) return <AdminLogin onSuccess={onLoginSuccess} />;

  const activeLabel = NAV.find((n) => n.id === section)?.label ?? "";
  const newLeadsCount = leads.filter((l) => !l.seen && !l.verified).length;

  return (
    <div className="bg-aurora min-h-screen lg:flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform glass-strong p-5 transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-neon-cyan to-neon-violet text-[#050510]">
              <GraduationCap size={20} strokeWidth={2.5} />
            </span>
            <span className="font-black text-white">{settings?.logoText || "Apex Academy"}</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="text-slate-400 lg:hidden">
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-1.5">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setSection(item.id);
                setSidebarOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                section === item.id
                  ? "bg-gradient-to-r from-neon-cyan/20 to-neon-violet/20 text-white shadow-[0_0_18px_rgba(34,211,238,0.25)]"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.icon}
              <span className="flex-1 text-left">{item.label}</span>
              {item.id === "leads" && newLeadsCount > 0 && (
                <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-neon-cyan px-1.5 text-[11px] font-bold text-[#050510]">
                  {newLeadsCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="absolute inset-x-5 bottom-5 space-y-1.5">
          <button
            onClick={() => setPwOpen(true)}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <KeyRound size={18} /> Parolni o'zgartirish
          </button>
          <button
            onClick={onExit}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft size={18} /> Saytga qaytish
          </button>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-rose-400 transition hover:bg-rose-500/10"
          >
            <LogOut size={18} /> Chiqish
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-0">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-white/10 bg-[#060611]/80 px-4 py-4 backdrop-blur sm:px-8">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-300 lg:hidden">
            <Menu size={22} />
          </button>
          <h1 className="text-xl font-black text-white">{activeLabel}</h1>
        </header>

        <main className="p-4 sm:p-8">
          {section === "dashboard" && <Dashboard stats={stats} />}
          {section === "settings" && settings && <SettingsPanel settings={settings} onSaved={loadAll} />}
          {section === "courses" && <CoursesPanel courses={courses} teachers={teachers} onChanged={loadAll} />}
          {section === "teachers" && <TeachersPanel teachers={teachers} onChanged={loadAll} />}
          {section === "leads" && <LeadsPanel leads={leads} courses={courses} onChanged={loadAll} />}
          {section === "verified" && (
            <VerifiedLeadsPanel leads={leads} courses={courses} onChanged={loadAll} />
          )}
          {section === "results" && <ResultsPanel results={results} onChanged={loadAll} />}
          {section === "copilot" && <CopilotPanel onChanged={loadAll} />}
        </main>
      </div>

      <ChangePasswordModal open={pwOpen} onClose={() => setPwOpen(false)} />
    </div>
  );
}

function ChangePasswordModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMsg("");
    try {
      await api.post("/auth/change-password", { currentPassword: current, newPassword: next }, true);
      setMsg("Parol muvaffaqiyatli o'zgartirildi.");
      setCurrent("");
      setNext("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xatolik");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <h3 className="text-lg font-bold text-white">Parolni o'zgartirish</h3>
        <Field label="Joriy parol">
          <TextInput type="password" value={current} onChange={(e) => setCurrent(e.target.value)} required />
        </Field>
        <Field label="Yangi parol" hint="Kamida 8 ta belgi">
          <TextInput type="password" value={next} onChange={(e) => setNext(e.target.value)} required />
        </Field>
        {error && <p className="text-sm text-rose-400">{error}</p>}
        {msg && <p className="text-sm text-emerald-400">{msg}</p>}
        <button type="submit" disabled={busy} className="btn-neon w-full rounded-xl py-3 text-sm disabled:opacity-60">
          {busy ? "Saqlanmoqda..." : "Saqlash"}
        </button>
      </form>
    </Modal>
  );
}
