import type React from "react";
import { motion } from "motion/react";
import { ArrowRight, PlayCircle, Star, Users, Award } from "lucide-react";
import type { SchoolSettings } from "../../types";
import type { UIKey } from "../../i18n";

interface HeroProps {
  settings: SchoolSettings;
  t: (key: UIKey) => string;
  onEnroll: () => void;
}

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600&auto=format&fit=crop";

function isDirectVideo(url: string): boolean {
  return /\.(mp4|webm|mov)(\?|$)/i.test(url) || url.includes("/uploads/");
}

const fadeUp = {
  initial: { opacity: 0, y: 26 },
  animate: { opacity: 1, y: 0 },
};

// Top stays clear; the bottom progressively fades into the cream page.
const FADE_OVERLAY =
  "linear-gradient(to bottom," +
  " rgba(250,248,245,0) 0%," +
  " rgba(250,248,245,0) 30%," +
  " rgba(250,248,245,0.25) 45%," +
  " rgba(250,248,245,0.55) 62%," +
  " rgba(250,248,245,0.8) 78%," +
  " rgba(250,248,245,0.95) 90%," +
  " #faf8f5 100%)";

export default function Hero({ settings, t, onEnroll }: HeroProps) {
  const useVideo =
    settings.heroMediaType === "video" &&
    !!settings.heroVideoUrl &&
    isDirectVideo(settings.heroVideoUrl);

  return (
    <section id="top" className="relative flex min-h-[94vh] items-end overflow-hidden">
      {/* Full-width background media */}
      <div className="absolute inset-0 -z-10">
        {useVideo ? (
          <video
            className="h-full w-full object-cover"
            src={settings.heroVideoUrl}
            autoPlay
            muted
            loop
            playsInline
            poster={settings.heroBgImage || FALLBACK_IMG}
          />
        ) : (
          <img
            src={settings.heroBgImage || FALLBACK_IMG}
            alt=""
            className="h-full w-full object-cover"
            onError={(e) => ((e.target as HTMLImageElement).src = FALLBACK_IMG)}
            {...({ fetchpriority: "high" } as Record<string, string>)}
          />
        )}
        {/* Clear at the top, fading to cream at the bottom */}
        <div className="absolute inset-0" style={{ backgroundImage: FADE_OVERLAY }} />
      </div>

      {/* Content sits in the lower area, over the cream fade (readable) */}
      <div className="mx-auto w-[92%] max-w-4xl pb-20 pt-44 text-center">
        <motion.span
          {...fadeUp}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-caramel/25 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-caramel-deep backdrop-blur"
        >
          <span className="h-2 w-2 rounded-full bg-caramel" />
          {t("admissionsOpen")}
        </motion.span>

        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="font-display mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight text-charcoal sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {settings.heroTitle}
        </motion.h1>

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.16 }}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-charcoal-soft sm:text-lg"
        >
          {settings.heroSubtitle}
        </motion.p>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.24 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <button
            onClick={onEnroll}
            className="btn-primary inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm"
          >
            {t("heroCtaPrimary")}
            <ArrowRight size={17} />
          </button>
          <a
            href="#courses"
            className="btn-outline inline-flex items-center gap-2 rounded-full bg-white/70 px-7 py-3.5 text-sm backdrop-blur"
          >
            <PlayCircle size={17} />
            {t("heroCtaSecondary")}
          </a>
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.32 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-medium text-charcoal-soft"
        >
          <span className="flex items-center gap-2">
            <Users size={16} className="text-caramel" /> 5000+ {t("statStudents")}
          </span>
          <span className="flex items-center gap-2">
            <Star size={16} className="text-caramel" /> 4.9 / 5.0
          </span>
          <span className="flex items-center gap-2">
            <Award size={16} className="text-caramel" /> IELTS · CEFR · SAT
          </span>
        </motion.div>
      </div>
    </section>
  );
}
