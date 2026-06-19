import { useEffect, useState } from "react";
import { GraduationCap, Menu, X, UserCog } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import LanguageSwitcher from "./LanguageSwitcher";
import type { Language, SchoolSettings } from "../../types";
import type { UIKey } from "../../i18n";

interface NavbarProps {
  settings: SchoolSettings;
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: UIKey) => string;
  onAdminClick: () => void;
  onEnroll: () => void;
}

export default function Navbar({ settings, lang, setLang, t, onAdminClick, onEnroll }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links: { href: string; key: UIKey }[] = [
    { href: "#courses", key: "navCourses" },
    { href: "#teachers", key: "navTeachers" },
    { href: "#results", key: "navResults" },
    { href: "#planner", key: "navPlanner" },
    { href: "#contact", key: "navContact" },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="mx-auto w-[95%] max-w-7xl">
        <nav
          className={`flex items-center justify-between rounded-2xl px-4 sm:px-6 transition-all duration-500 ${
            scrolled ? "glass-strong h-16 shadow-[0_10px_40px_rgba(0,0,0,0.5)]" : "glass h-20"
          }`}
        >
          {/* Logo */}
          <a href="#top" className="flex items-center gap-2.5">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-neon-cyan to-neon-violet text-[#050510] shadow-[0_0_18px_rgba(34,211,238,0.5)]">
              <GraduationCap size={20} strokeWidth={2.5} />
            </span>
            <span className="text-lg font-black tracking-tight text-white">
              {settings.logoText || settings.name || "Apex Academy"}
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden items-center gap-7 lg:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link text-sm font-semibold text-slate-300"
              >
                {t(link.key)}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onEnroll}
              className="btn-neon hidden rounded-full px-5 py-2.5 text-sm sm:inline-flex"
            >
              {t("heroCtaPrimary")}
            </button>
            <LanguageSwitcher lang={lang} onChange={setLang} />
            {/* Subtle round admin button */}
            <button
              onClick={onAdminClick}
              title={t("admin")}
              aria-label={t("admin")}
              className="group inline-flex h-10 w-10 items-center justify-center rounded-full glass text-slate-400 transition hover:text-neon-cyan hover:shadow-[0_0_18px_rgba(34,211,238,0.55)]"
            >
              <UserCog size={17} className="transition group-hover:scale-110" />
            </button>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full glass text-white lg:hidden"
              aria-label="Menyu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-strong mt-2 overflow-hidden rounded-2xl p-3 lg:hidden"
            >
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-neon-cyan"
                >
                  {t(link.key)}
                </a>
              ))}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onEnroll();
                }}
                className="btn-neon mt-2 w-full rounded-xl py-3 text-sm"
              >
                {t("heroCtaPrimary")}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
