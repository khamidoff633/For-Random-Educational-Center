interface GalleryPageProps {
  settings: SchoolSettings;
  lang: Language;
  onBack: () => void;
}


import { useEffect, useState } from "react";
import { ArrowLeft, ImageOff } from "lucide-react";
import { motion } from "motion/react";
import Lightbox from "../ui/Lightbox";
import { useSmoothScroll } from "../../hooks/useSmoothScroll";
import { createTranslator } from "../../i18n";
import type { Language, SchoolSettings } from "../../types";
import libraryDeskBg from "../../assets/library_desk_bg.jpg";

/** Soft ambient embers floating upward in the dim museum exhibition hall. */
function GalleryEmbers() {
  const [embers] = useState(() =>
    Array.from({ length: 18 }).map(() => ({
      left: Math.random() * 100,
      size: 2 + Math.random() * 5,
      duration: 10 + Math.random() * 12,
      delay: -Math.random() * 18,
    }))
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {embers.map((m, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-amber-400/25 blur-[0.5px]"
          style={{
            bottom: "-20px",
            left: `${m.left}%`,
            width: `${m.size}px`,
            height: `${m.size}px`,
            animation: `gh-mote ${m.duration}s linear infinite`,
            animationDelay: `${m.delay}s`,
            boxShadow: "0 0 10px 2px rgba(255,180,60,0.12)",
          }}
        />
      ))}
    </div>
  );
}

export default function GalleryPage({ settings, lang, onBack }: GalleryPageProps) {
  const t = createTranslator(lang);
  const images = settings.gallery ?? [];
  const [active, setActive] = useState<number | null>(null);
  useSmoothScroll();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div 
      className="min-h-screen text-charcoal relative overflow-hidden pb-32"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(18, 11, 5, 0.93) 0%, rgba(26, 17, 9, 0.90) 50%, rgba(12, 7, 3, 0.96) 100%), url(${libraryDeskBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <GalleryEmbers />

      {/* Top bar (Museum Glass Style) */}
      <header className="fixed inset-x-0 top-0 z-50 py-4">
        <div className="mx-auto w-[95%] max-w-7xl">
          <div 
            className="flex h-[4.5rem] items-center justify-between rounded-2xl px-4 border border-white/5 sm:px-6"
            style={{
              background: "rgba(35, 23, 12, 0.45)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "0 10px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            <button
              onClick={onBack}
              className="group inline-flex items-center gap-2 text-sm font-semibold text-amber-100/90 transition hover:text-amber-300"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 transition group-hover:-translate-x-0.5 group-hover:border-amber-500/40 group-hover:bg-white/10">
                <ArrowLeft size={16} />
              </span>
              {t("galleryBackHome")}
            </button>
            <span className="font-display text-base font-extrabold tracking-tight text-amber-200/95 sm:text-lg">
              {settings.name || "Apex Academy"}
            </span>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-[92%] max-w-7xl px-1 pt-32">
        {/* Heading */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-amber-300">
            {t("galleryBadge")}
          </span>
          <h1 className="font-display mt-4 text-3xl font-extrabold tracking-tight text-amber-100 sm:text-4xl">
            {t("galleryTitle")}
          </h1>
          <div className="mx-auto mt-5 h-px w-24 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
        </motion.div>

        {/* Ornate Museum Frame Grid */}
        {images.length === 0 ? (
          <div className="mt-24 flex flex-col items-center gap-3 text-amber-200/50">
            <ImageOff size={40} className="text-amber-500/30" />
            <p className="text-sm">{t("galleryEmpty")}</p>
          </div>
        ) : (
          <div className="mt-24 grid grid-cols-1 gap-14 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-16 md:grid-cols-3 lg:grid-cols-4">
            {images.map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.65, delay: (i % 4) * 0.08, ease: "easeOut" }}
                className="relative pt-6" // extra top padding to give room for spotlight
              >
                {/* Spotlight sitting on top of the frame */}
                <div className="museum-spotlight" />

                <button
                  type="button"
                  onClick={() => setActive(i)}
                  className="museum-frame w-full group block text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                  aria-label={`${t("galleryTitle")} — ${i + 1}`}
                >
                  {/* Glass reflections overlay */}
                  <div className="frame-glare" />

                  <div className="museum-mat flex aspect-[4/3] items-center justify-center overflow-hidden">
                    <img
                      src={src}
                      alt=""
                      loading="lazy"
                      className="max-h-full max-w-full object-contain transition duration-700 group-hover:scale-[1.04]"
                      style={{
                        filter: "contrast(1.02) brightness(0.98)",
                      }}
                    />
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Lightbox images={images} index={active} onClose={() => setActive(null)} onChange={setActive} />
    </div>
  );
}
