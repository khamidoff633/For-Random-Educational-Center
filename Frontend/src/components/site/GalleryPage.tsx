import { useEffect, useState } from "react";
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

/**
 * Standalone gallery page (hash route #/galereya).
 * Distinct deep-emerald "exhibit" theme (inverted site palette). Uniform 4:3
 * matted gold frames with object-contain — every photo shows in full, never
 * cropped, and the layout stays perfectly even regardless of source ratios.
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
      {/* Top bar */}
      <header className="fixed inset-x-0 top-0 z-50 py-4">
        <div className="mx-auto w-[95%] max-w-7xl">
          <div className="flex h-[4.5rem] items-center justify-between rounded-2xl px-4 glass-nav-dark sm:px-6">
            <button
              onClick={onBack}
              className="group inline-flex items-center gap-2 text-sm font-semibold text-cream transition hover:text-caramel"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 transition group-hover:-translate-x-0.5 group-hover:border-caramel/60">
                <ArrowLeft size={16} />
              </span>
              {t("galleryBackHome")}
            </button>
            <span className="font-display text-base font-extrabold tracking-tight text-cream sm:text-lg">
              {settings.name || "Apex Academy"}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto w-[92%] max-w-7xl px-1 pb-24 pt-32">
        {/* Heading */}
        <div className="text-center">
          <span className="inline-block rounded-full border border-caramel/40 bg-caramel/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-caramel">
            {t("galleryBadge")}
          </span>
          <h1 className="font-display mt-4 text-3xl font-extrabold tracking-tight text-cream sm:text-4xl">
            {t("galleryTitle")}
          </h1>
          <div className="mx-auto mt-5 h-px w-24 bg-gradient-to-r from-transparent via-caramel/70 to-transparent" />
        </div>

        {/* Uniform matted-frame grid */}
        {images.length === 0 ? (
          <div className="mt-24 flex flex-col items-center gap-3 text-cream/70">
            <ImageOff size={40} className="text-caramel/60" />
            <p className="text-sm">{t("galleryEmpty")}</p>
          </div>
        ) : (
          <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {images.map((src, i) => (
              <motion.button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
                className="gallery-frame group block focus:outline-none focus-visible:ring-2 focus-visible:ring-caramel focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                aria-label={`${t("galleryTitle")} — ${i + 1}`}
              >
                <div className="gallery-mat flex aspect-[4/3] items-center justify-center overflow-hidden">
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    className="max-h-full max-w-full object-contain transition duration-500 group-hover:scale-[1.04]"
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
