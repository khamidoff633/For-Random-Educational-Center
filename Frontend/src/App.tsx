import { useCallback, useEffect, useState } from "react";
import PublicSite from "./components/site/PublicSite";
import GalleryPage from "./components/site/GalleryPage";
import PlacementTestPage from "./components/site/PlacementTestPage";
import SiteSkeleton from "./components/site/SiteSkeleton";
import AdminApp from "./admin/AdminApp";
import { api } from "./api/client";
import type { Course, Language, SchoolSettings, StudentResultItem, Teacher } from "./types";
import { DEFAULT_SETTINGS, DEFAULT_COURSES, DEFAULT_TEACHERS, DEFAULT_RESULTS } from "./lib/mockData";

type View = "site" | "admin";

const GALLERY_HASH = "#/galereya";
const LEVEL_TEST_HASH = "#/level-test";
const LANG_KEY = "apex_lang";
const VALID_LANGS: Language[] = ["uz", "ru", "en"];

/** Reads the saved UI language, defaulting to Uzbek on first visit. */
function readSavedLang(): Language {
  try {
    const saved = localStorage.getItem(LANG_KEY) as Language | null;
    if (saved && VALID_LANGS.includes(saved)) return saved;
  } catch {
    /* ignore storage errors (e.g. private mode) */
  }
  return "uz";
}

export default function App() {
  const [view, setView] = useState<View>("site");
  const [lang, setLangState] = useState<Language>(readSavedLang);
  const [loading, setLoading] = useState(true);
  const [route, setRoute] = useState<string>(() => window.location.hash);

  // Persist the chosen language so it survives a refresh.
  const setLang = useCallback((next: Language) => {
    setLangState(next);
    try {
      localStorage.setItem(LANG_KEY, next);
    } catch {
      /* ignore storage errors */
    }
  }, []);

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
      // Fallback to static mock data to render the landing page gracefully without a backend!
      setSettings(DEFAULT_SETTINGS);
      setCourses(DEFAULT_COURSES);
      setTeachers(DEFAULT_TEACHERS);
      setResults(DEFAULT_RESULTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPublicData();
  }, [loadPublicData]);

  // Keep the document language in sync with the chosen UI language.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Hash-based routing for the standalone gallery page (browser back works,
  // URL is shareable). Admin stays state-driven.
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const goToSite = useCallback(() => {
    // Strip the hash cleanly without leaving a dangling "#/galereya".
    history.pushState(null, "", window.location.pathname + window.location.search);
    setRoute("");
    window.scrollTo({ top: 0 });
  }, []);

  const isGallery = route.startsWith(GALLERY_HASH);
  const isLevelTest = route.startsWith(LEVEL_TEST_HASH);
  const isAdmin = route.startsWith("#/admin");

  if (isAdmin) {
    return (
      <AdminApp
        onExit={() => {
          // Clean hash URL when exiting admin
          history.pushState(null, "", window.location.pathname + window.location.search);
          setRoute("");
          loadPublicData();
        }}
      />
    );
  }

  if (loading || !settings) {
    return <SiteSkeleton />;
  }

  if (isGallery) {
    return <GalleryPage settings={settings} lang={lang} onBack={goToSite} />;
  }

  if (isLevelTest) {
    return (
      <PlacementTestPage
        settings={settings}
        courses={courses}
        lang={lang}
        onBack={goToSite}
      />
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
    />
  );
}
