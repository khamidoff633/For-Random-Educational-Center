import { motion } from "motion/react";
import { Check } from "lucide-react";
import Reveal from "../ui/Reveal";
import type { SchoolSettings } from "../../types";
import type { UIKey } from "../../i18n";

const ABOUT_FALLBACK =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop";

const HIGHLIGHTS_BY_LANG: Record<string, string[]> = {
  uz: ["Xalqaro sertifikatli ustozlar", "Kichik va samarali guruhlar", "Natijaga kafolatli yondashuv"],
  ru: ["Преподаватели с межд. сертификатами", "Малые эффективные группы", "Подход с гарантией результата"],
  en: ["Internationally certified mentors", "Small, effective groups", "Result-driven approach"],
};

export default function About({
  settings,
  lang,
  t,
}: {
  settings: SchoolSettings;
  lang: string;
  t: (key: UIKey) => string;
}) {
  const highlights = HIGHLIGHTS_BY_LANG[lang] ?? HIGHLIGHTS_BY_LANG.en;

  return (
    <section id="about" className="mx-auto w-[92%] max-w-7xl py-24">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* Image collage */}
        <Reveal>
          <div className="relative">
            <img
              src={settings.heroBgImage || ABOUT_FALLBACK}
              alt={settings.name}
              loading="lazy"
              onError={(e) => ((e.target as HTMLImageElement).src = ABOUT_FALLBACK)}
              className="h-[26rem] w-full rounded-[2rem] object-cover shadow-soft-lg"
            />
            <div className="card-soft animate-breathe absolute -right-3 -top-5 rounded-2xl px-5 py-3 sm:-right-6">
              <p className="font-display text-2xl font-extrabold text-caramel-deep">15+</p>
              <p className="text-xs text-charcoal-soft">{t("statYears")}</p>
            </div>
          </div>
        </Reveal>

        {/* Text */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-caramel/20 bg-caramel/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-caramel-deep">
            <span className="h-1.5 w-1.5 rounded-full bg-caramel" />
            {t("aboutBadge")}
          </span>
          <h2 className="font-display mt-4 text-3xl font-extrabold leading-tight text-charcoal sm:text-4xl">
            {t("aboutTitle")}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-charcoal-soft">{settings.aboutText}</p>

          <ul className="mt-7 space-y-3">
            {highlights.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 text-charcoal"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-caramel/15 text-caramel-deep">
                  <Check size={14} />
                </span>
                {item}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
