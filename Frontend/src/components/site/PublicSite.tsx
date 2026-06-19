import { useState } from "react";
import { Sparkles, Trophy, GraduationCap, Globe, Rocket } from "lucide-react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Stats from "./Stats";
import About from "./About";
import Features from "./Features";
import Courses from "./Courses";
import Teachers from "./Teachers";
import Results from "./Results";
import Reviews from "./Reviews";
import AIPlanner from "./AIPlanner";
import FAQ from "./FAQ";
import Contact from "./Contact";
import AdmissionForm from "./AdmissionForm";
import Footer from "./Footer";
import Marquee from "../effects/Marquee";
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
    <><Sparkles size={15} className="text-caramel" /> {settings.name}</>,
    <><Trophy size={15} className="text-caramel" /> IELTS · CEFR · SAT</>,
    <><GraduationCap size={15} className="text-caramel" /> 5000+ {t("statStudents")}</>,
    <><Globe size={15} className="text-caramel" /> Toshkent · Samarqand · Andijon</>,
    <><Rocket size={15} className="text-caramel" /> {t("admissionsOpen")}</>,
  ];

  return (
    <div className="bg-warm min-h-screen">
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
        <About settings={settings} lang={lang} t={t} />
        <Features settings={settings} t={t} />
        <Courses courses={courses} teachers={teachers} t={t} onEnroll={openEnroll} />
        <Teachers teachers={teachers} t={t} />
        <Results results={results} t={t} />
        <Reviews t={t} />
        <AIPlanner t={t} />
        <FAQ lang={lang} t={t} />
        <Contact settings={settings} t={t} />
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
