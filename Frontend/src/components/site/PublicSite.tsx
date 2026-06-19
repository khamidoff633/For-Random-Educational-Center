import { useState } from "react";
import { Sparkles, Trophy, GraduationCap, Globe, Rocket } from "lucide-react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Stats from "./Stats";
import Features from "./Features";
import Courses from "./Courses";
import Teachers from "./Teachers";
import Results from "./Results";
import Reviews from "./Reviews";
import AIPlanner from "./AIPlanner";
import AdmissionForm from "./AdmissionForm";
import Footer from "./Footer";
import Marquee from "../effects/Marquee";
import CustomCursor from "../effects/CustomCursor";
import ParticleField from "../effects/ParticleField";
import { createTranslator } from "../../i18n";
import type { Course, Language, SchoolSettings, StudentResultItem, Teacher } from "../../types";

interface PublicSiteProps {
  settings: SchoolSettings;
  courses: Course[];
  teachers: Teacher[];
  results: StudentResultItem[];
  lang: Language;
  setLang: (lang: Language) => void;
  onAdminClick: () => void;
}

export default function PublicSite({
  settings,
  courses,
  teachers,
  results,
  lang,
  setLang,
  onAdminClick,
}: PublicSiteProps) {
  const t = createTranslator(lang);
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>("");

  const openEnroll = (courseId = "") => {
    setSelectedCourse(courseId);
    setEnrollOpen(true);
  };

  const marqueeItems = [
    <><Sparkles size={15} className="text-neon-cyan" /> {settings.name}</>,
    <><Trophy size={15} className="text-neon-violet" /> IELTS · CEFR · SAT</>,
    <><GraduationCap size={15} className="text-neon-cyan" /> 5000+ {t("statStudents")}</>,
    <><Globe size={15} className="text-neon-violet" /> Toshkent · Samarqand · Andijon</>,
    <><Rocket size={15} className="text-neon-cyan" /> {t("admissionsOpen")}</>,
  ];

  return (
    <div className="bg-aurora min-h-screen">
      <div className="pointer-events-none fixed inset-0 -z-[1] opacity-60">
        <ParticleField />
      </div>
      <CustomCursor />
      <Navbar
        settings={settings}
        lang={lang}
        setLang={setLang}
        t={t}
        onAdminClick={onAdminClick}
        onEnroll={() => openEnroll()}
      />

      <main>
        <Hero settings={settings} t={t} onEnroll={() => openEnroll()} />
        <Stats teacherCount={teachers.length} t={t} />
        <div className="mt-20">
          <Marquee items={marqueeItems} />
        </div>
        <Features settings={settings} t={t} />
        <Courses courses={courses} teachers={teachers} t={t} onEnroll={openEnroll} />
        <Teachers teachers={teachers} t={t} />
        <Results results={results} t={t} />
        <Reviews t={t} />
        <AIPlanner t={t} />
      </main>

      <Footer settings={settings} t={t} />

      <AdmissionForm
        open={enrollOpen}
        onClose={() => setEnrollOpen(false)}
        courses={courses}
        initialCourseId={selectedCourse}
        t={t}
      />
    </div>
  );
}
