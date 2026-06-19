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

function isDirectVideo(url: string): boolean {
  return /\.(mp4|webm|mov)(\?|$)/i.test(url) || url.includes("/uploads/");
}

const fadeUp = {
  initial: { opacity: 0, y: 26 },
  animate: { opacity: 1, y: 0 },
};

export default function Hero({ settings, t, onEnroll }: HeroProps) {
  const useVideo =
    settings.heroMediaType === "video" &&
    !!settings.heroVideoUrl &&
    isDirectVideo(settings.heroVideoUrl);

  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-20 sm:pt-36">
      <div className="mx-auto grid w-[92%] max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-12">
        {/* Copy */}
        <div className="lg:col-span-6">
          <motion.span
            {...fadeUp}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-caramel/20 bg-caramel/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-caramel-deep"
          >
            <span className="h-2 w-2 rounded-full bg-caramel" />
            {t("admissionsOpen")}
          </motion.span>

          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="font-display mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-charcoal sm:text-5xl md:text-6xl"
          >
            {settings.heroTitle}
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-charcoal-soft sm:text-lg"
          >
            {settings.heroSubtitle}
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="mt-8 flex flex-wrap items-center gap-4"
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
              className="btn-outline inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm"
            >
              <PlayCircle size={17} />
              {t("heroCtaSecondary")}
            </a>
          </motion.div>

          {/* Trust row */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.32 }}
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-charcoal-soft"
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

        {/* Media */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative lg:col-span-6"
        >
          <div className="relative overflow-hidden rounded-[2rem] shadow-soft-lg">
            {useVideo ? (
              <video
                className="h-[26rem] w-full object-cover sm:h-[32rem]"
                src={settings.heroVideoUrl}
                autoPlay
                muted
                loop
                playsInline
                poster={settings.heroBgImage}
              />
            ) : (
              <img
                src={settings.heroBgImage}
                alt=""
                className="h-[26rem] w-full object-cover sm:h-[32rem]"
                {...({ fetchpriority: "high" } as Record<string, string>)}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-espresso/30 to-transparent" />
          </div>

          {/* Floating stat card */}
          <div className="card-soft absolute -bottom-6 -left-2 flex items-center gap-3 rounded-2xl p-4 sm:left-6">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-caramel/15 text-caramel-deep">
              <Award size={22} />
            </span>
            <div>
              <p className="font-display text-xl font-extrabold text-charcoal">98%</p>
              <p className="text-xs text-charcoal-soft">{t("statSuccess")}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
