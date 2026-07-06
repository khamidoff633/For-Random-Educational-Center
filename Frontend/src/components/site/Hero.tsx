import React, { useEffect, useRef } from "react";
import { ArrowRight, PlayCircle, Star, Users, Award } from "lucide-react";
import gsap from "gsap";
import { useMagnetic } from "../../hooks/useMagnetic";
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

  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const buttonsRef = useRef<HTMLDivElement | null>(null);
  const badgesRef = useRef<HTMLDivElement | null>(null);

  const primaryBtnRef = useMagnetic<HTMLButtonElement>();
  const secondaryBtnRef = useMagnetic<HTMLAnchorElement>();

  useEffect(() => {
    if (!titleRef.current) return;
    const words = titleRef.current.querySelectorAll(".hero-word-inner");
    
    const tl = gsap.timeline();

    tl.fromTo(".admissions-badge", 
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );

    tl.fromTo(words,
      { y: "110%", opacity: 0 },
      { y: "0%", opacity: 1, duration: 0.9, ease: "power4.out", stagger: 0.05 },
      "-=0.3"
    );

    if (subtitleRef.current) {
      tl.fromTo(subtitleRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
        "-=0.5"
      );
    }

    if (buttonsRef.current) {
      tl.fromTo(buttonsRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
        "-=0.5"
      );
    }

    if (badgesRef.current) {
      tl.fromTo(badgesRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
        "-=0.5"
      );
    }
  }, [settings.heroTitle]);

  const titleWords = (settings.heroTitle || "").split(" ");

  return (
    <section id="top" className="relative isolate flex min-h-[94vh] items-end overflow-hidden">
      {/* Full-width background media */}
      <div className="absolute inset-0 z-0">
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
      <div className="relative z-10 mx-auto w-[92%] max-w-4xl pb-16 pt-32 sm:pb-20 sm:pt-44 text-center">
        <div className="bg-white/80 backdrop-blur-md border border-white/30 rounded-3xl px-5 py-8 sm:bg-transparent sm:backdrop-blur-none sm:border-none sm:shadow-none sm:p-0 shadow-soft-xl">
          <span className="admissions-badge inline-flex items-center gap-2 rounded-full border border-caramel/25 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-caramel-deep backdrop-blur opacity-0">
            <span className="h-2 w-2 rounded-full bg-caramel" />
            {t("admissionsOpen")}
          </span>

          <h1
            ref={titleRef}
            className="font-display mx-auto mt-6 max-w-3xl text-3xl font-extrabold leading-[1.1] tracking-tight text-charcoal sm:text-5xl md:text-6xl lg:text-7xl flex flex-wrap justify-center"
          >
            {titleWords.map((word, i) => (
              <span key={i} className="inline-block overflow-hidden mr-3">
                <span className="hero-word-inner inline-block translate-y-[110%] opacity-0">
                  {word}
                </span>
              </span>
            ))}
          </h1>

          <p
            ref={subtitleRef}
            className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-charcoal-soft sm:text-lg opacity-0"
          >
            {settings.heroSubtitle}
          </p>

          <div
            ref={buttonsRef}
            className="mt-6 flex flex-wrap items-center justify-center gap-3 opacity-0"
          >
            <button
              ref={primaryBtnRef}
              onClick={onEnroll}
              className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm transition"
            >
              {t("heroCtaPrimary")}
              <ArrowRight size={17} />
            </button>
            <a
              ref={secondaryBtnRef}
              href="#courses"
              className="btn-outline inline-flex items-center gap-2 rounded-full bg-white/70 px-6 py-3 text-sm backdrop-blur transition"
            >
              <PlayCircle size={17} />
              {t("heroCtaSecondary")}
            </a>
          </div>

          <div
            ref={badgesRef}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm font-medium text-charcoal-soft opacity-0"
          >
            <span className="flex items-center gap-2">
              <Users size={16} className="text-caramel" /> 5000+ {t("statStudents")}
            </span>
            <span className="flex items-center gap-2">
              <Star size={16} className="text-jade" /> 4.9 / 5.0
            </span>
            <span className="flex items-center gap-2">
              <Award size={16} className="text-caramel" /> IELTS · CEFR · SAT
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
