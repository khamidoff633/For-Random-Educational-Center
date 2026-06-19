import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import PublicSite from "./components/site/PublicSite";
import AdminApp from "./admin/AdminApp";
import { api } from "./api/client";
import type { Course, Language, SchoolSettings, StudentResultItem, Teacher } from "./types";

type View = "site" | "admin";

export default function App() {
  const [view, setView] = useState<View>("site");
  const [lang, setLang] = useState<Language>("uz");
  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState<SchoolSettings | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [results, setResults] = useState<StudentResultItem[]>([]);

  const loadPublicData = useCallback(async () => {
    try {
      const [s, c, t, r] = await Promise.all([
        api.get<SchoolSettings>("/settings"),
        api.get<Course[]>("/courses"),
        api.get<Teacher[]>("/teachers"),
        api.get<StudentResultItem[]>("/results"),
      ]);
      setSettings(s);
      setCourses(c);
      setTeachers(t);
      setResults(r);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Ma'lumotlarni yuklashda xatolik:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPublicData();
  }, [loadPublicData]);

  if (view === "admin") {
    return (
      <AdminApp
        onExit={() => {
          setView("site");
          loadPublicData();
        }}
      />
    );
  }

  if (loading || !settings) {
    return (
      <div className="bg-warm flex min-h-screen flex-col items-center justify-center gap-4 text-charcoal-soft">
        <Loader2 size={32} className="animate-spin text-caramel" />
        <span className="text-xs uppercase tracking-widest">Yuklanmoqda...</span>
      </div>
    );
  }

  return (
    <PublicSite
      settings={settings}
      courses={courses}
      teachers={teachers}
      results={results}
      lang={lang}
      setLang={setLang}
      onAdminClick={() => setView("admin")}
    />
  );
}
