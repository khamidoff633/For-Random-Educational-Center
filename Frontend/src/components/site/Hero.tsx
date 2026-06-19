import { motion } from "motion/react";
import { ArrowRight, PlayCircle, Sparkles, ChevronDown } from "lucide-react";
import type { SchoolSettings } from "../../types";
import type { UIKey } from "../../i18n";

interface HeroProps {
  settings: SchoolSettings;
  t: (key: UIKey) => string;
  onEnroll: () => void;
}

/** Returns true when a URL points to a directly playable video file. */
function isDirectVideo(url: string): boolean {
  return /\.(mp4|webm|mov)(\?|$)/i.test(url) || url.includes("/uploads/");
}

export default function Hero({ settings, t, onEnroll }: HeroProps) {
  const useVideo =
    settings.heroMediaType === "video" && !!settings.heroVideoUrl && isDirectVideo(settings.heroVideoUrl);

  return (
    <section id="top" className="relative flex min-h-screen items-center overflow-hidden pt-28 pb-16">
      {/* Background media */}
      <div className="absolute inset-0 -z-10">
        {useVideo ? (
          <video
            className="h-full w-full object-cover"
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
            className="h-full w-full object-cover"
            // Priority Hints: prioritise the LCP hero image. Spread keeps it
            // valid across React type versions.
            {...({ fetchpriority: "high" } as Record<string, string>)}
          />
        )}
        {/* Readability overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#060611]/80 via-[#060611]/70 to-[#060611]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060611]/90 to-transparent" />
      </div>

      <div className="mx-auto grid w-[92%] max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-12">
        {/* Copy */}
        <div className="lg:col-span-7">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-neon-cyan"
          >
            <span className="h-2 w-2 rounded-full bg-neon-cyan animate-pulse" />
            {t("admissionsOpen")}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-5 text-4xl font-black leading-[1.05] sm:text-5xl md:text-6xl"
          >
            <span className="text-white">{settings.heroTitle}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mt-5 max-w-xl text-base text-slate-300 sm:text-lg"
          >
            {settings.heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <button onClick={onEnroll} className="btn-neon inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm">
              {t("heroCtaPrimary")}
              <ArrowRight size={17} />
            </button>
            <a
              href="#courses"
              className="btn-ghost inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold"
            >
              <PlayCircle size={17} />
              {t("heroCtaSecondary")}
            </a>
          </motion.div>
        </div>

        {/* Floating 3D-style orb */}
        <div className="hidden lg:col-span-5 lg:flex lg:justify-center">
          <div className="relative h-80 w-80 animate-float">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-neon-cyan/30 to-neon-violet/30 blur-2xl" />
            <div className="absolute inset-6 animate-spin-slow rounded-full border border-dashed border-white/20" />
            <div className="absolute inset-12 animate-pulse-glow rounded-full glass-strong" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles size={64} className="text-neon-cyan neon-text" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <a
        href="#courses"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[11px] uppercase tracking-widest text-slate-400 transition hover:text-neon-cyan"
      >
        {t("scrollHint")}
        <ChevronDown size={18} className="animate-bounce" />
      </a>
    </section>
  );
}
