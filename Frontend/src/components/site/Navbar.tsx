import { useState } from "react";
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const hasGallery = (settings.gallery ?? []).length > 0;

  const links: { href: string; key: UIKey }[] = [
    { href: "#about", key: "navAbout" },
    { href: "#courses", key: "navCourses" },
    { href: "#teachers", key: "navTeachers" },
    { href: "#results", key: "navResults" },
    ...(hasGallery ? [{ href: "#/galereya", key: "navGallery" as UIKey }] : []),
    { href: "#faq", key: "navFaq" },
    { href: "#contact", key: "navContact" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 py-4">
      <div className="mx-auto w-[95%] max-w-7xl">
        <nav className="flex h-[4.5rem] items-center justify-between rounded-2xl px-4 glass-nav sm:px-6">
          {/* Logo */}
          <a href="#top" className="flex items-center gap-2.5">
            {settings.logoImage ? (
              <img src={settings.logoImage} alt={settings.name} className="h-10 w-auto object-contain" />
            ) : (
              <>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-caramel to-caramel-deep text-white shadow-soft">
                  <GraduationCap size={20} strokeWidth={2.5} />
                </span>
                <span className="font-display text-lg font-extrabold tracking-tight text-charcoal">
                  {settings.logoText || settings.name || "Apex Academy"}
                </span>
              </>
            )}
          </a>

          {/* Desktop links */}
          <div className="hidden items-center gap-8 lg:flex">
            {links.map((link) => (
              <a key={link.href} href={link.href} className="nav-warm text-sm font-semibold">
                {t(link.key)}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onEnroll}
              className="btn-primary hidden rounded-full px-5 py-2.5 text-sm sm:inline-flex"
            >
              {t("heroCtaPrimary")}
            </button>
            <LanguageSwitcher lang={lang} onChange={setLang} />
            <button
              onClick={onAdminClick}
              title={t("admin")}
              aria-label={t("admin")}
              className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/60 text-charcoal-soft transition hover:border-caramel/40 hover:text-caramel-deep"
            >
              <UserCog size={17} className="transition group-hover:scale-110" />
            </button>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/60 text-charcoal lg:hidden"
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
              className="glass-nav mt-2 overflow-hidden rounded-2xl p-3 shadow-soft lg:hidden"
            >
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-semibold text-charcoal transition hover:bg-cream-soft hover:text-caramel-deep"
                >
                  {t(link.key)}
                </a>
              ))}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onEnroll();
                }}
                className="btn-primary mt-2 w-full rounded-xl py-3 text-sm"
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
