import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ImageOff } from "lucide-react";
import { motion } from "motion/react";
import Lightbox from "../ui/Lightbox";
import { useSmoothScroll } from "../../hooks/useSmoothScroll";
import { createTranslator } from "../../i18n";
import type { Language, SchoolSettings } from "../../types";

interface GalleryPageProps {
  settings: SchoolSettings;
  lang: Language;
  onBack: () => void;
}

/** Soft sunlight motes drifting upward, like dust in a sunbeam. */
function SunlightMotes() {
  const motes = useMemo(
    () =>
      Array.from({ length: 16 }).map(() => ({
        left: Math.random() * 100,
        size: 4 + Math.random() * 10,
        duration: 9 + Math.random() * 10,
        delay: -Math.random() * 16,
      })),
    []
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {motes.map((m, i) => (
        <span
          key={i}
          className="gh-mote"
          style={{
            left: `${m.left}%`,
            width: `${m.size}px`,
            height: `${m.size}px`,
            animationDuration: `${m.duration}s`,
            animationDelay: `${m.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Standalone gallery page (hash route #/galereya).
 * "Sunlit meadow" Ghibli theme: warm cream/gold palette (matching the site),
 * drifting clouds + floating sunlight motes for gentle life. Uniform painted
 * frames with object-contain — every photo shows in full, never cropped.
 */
export default function GalleryPage({ settings, lang, onBack }: GalleryPageProps) {
  const t = createTranslator(lang);
  const images = settings.gallery ?? [];
  const [active, setActive] = useState<number | null>(null);
  useSmoothScroll();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="bg-gallery min-h-screen">
      {/* Drifting clouds */}
      <div
        className="gh-cloud"
        style={{ top: "6%", left: "-6%", width: "30rem", height: "12rem", animationDuration: "26s" }}
        aria-hidden
      />
      <div
        className="gh-cloud"
        style={{ top: "22%", right: "-8%", width: "26rem", height: "10rem", animationDuration: "34s", animationDelay: "-8s" }}
        aria-hidden
      />
      <SunlightMotes />

      {/* Top bar */}
      <header className="fixed inset-x-0 top-0 z-50 py-4">
        <div className="mx-auto w-[95%] max-w-7xl">
          <div className="flex h-[4.5rem] items-center justify-between rounded-2xl px-4 glass-nav sm:px-6">
            <button
              onClick={onBack}
              className="group inline-flex items-center gap-2 text-sm font-semibold text-charcoal transition hover:text-caramel-deep"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/60 transition group-hover:-translate-x-0.5 group-hover:border-caramel/50">
                <ArrowLeft size={16} />
              </span>
              {t("galleryBackHome")}
            </button>
            <span className="font-display text-base font-extrabold tracking-tight text-charcoal sm:text-lg">
              {settings.name || "Apex Academy"}
            </span>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-[92%] max-w-7xl px-1 pb-24 pt-32">
        {/* Heading */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block rounded-full border border-caramel/30 bg-caramel/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-caramel-deep">
            {t("galleryBadge")}
          </span>
          <h1 className="font-display mt-4 text-3xl font-extrabold tracking-tight text-charcoal sm:text-4xl">
            {t("galleryTitle")}
          </h1>
          <div className="mx-auto mt-5 h-px w-24 bg-gradient-to-r from-transparent via-caramel/60 to-transparent" />
        </motion.div>

        {/* Uniform painted-frame grid */}
        {images.length === 0 ? (
          <div className="mt-24 flex flex-col items-center gap-3 text-charcoal-soft">
            <ImageOff size={40} className="text-caramel/50" />
            <p className="text-sm">{t("galleryEmpty")}</p>
          </div>
        ) : (
          <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {images.map((src, i) => (
              <motion.button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: (i % 4) * 0.07, ease: [0.2, 0.7, 0.2, 1] }}
                className="ghibli-frame group block focus:outline-none focus-visible:ring-2 focus-visible:ring-caramel focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                aria-label={`${t("galleryTitle")} — ${i + 1}`}
              >
                <div className="ghibli-mat flex aspect-[4/3] items-center justify-center overflow-hidden">
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    className="max-h-full max-w-full object-contain transition duration-700 group-hover:scale-[1.05]"
                  />
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </main>

      <Lightbox images={images} index={active} onClose={() => setActive(null)} onChange={setActive} />
    </div>
  );
}
