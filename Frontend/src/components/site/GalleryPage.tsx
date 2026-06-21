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
 * Standalone gallery page (hash route #/galereya). Keeps the heavy image grid
 * off the main landing page. Masonry columns + full-screen lightbox.
 */
export default function GalleryPage({ settings, lang, onBack }: GalleryPageProps) {
  const t = createTranslator(lang);
  const images = settings.gallery ?? [];
  const [active, setActive] = useState<number | null>(null);
  useSmoothScroll();

  // Always start at the top when the page mounts.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="bg-warm min-h-screen">
      {/* Top bar */}
      <header className="fixed inset-x-0 top-0 z-50 py-4">
        <div className="mx-auto w-[95%] max-w-7xl">
          <div className="flex h-[4.5rem] items-center justify-between rounded-2xl px-4 glass-nav sm:px-6">
            <button
              onClick={onBack}
              className="group inline-flex items-center gap-2 text-sm font-semibold text-charcoal transition hover:text-caramel-deep"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/60 transition group-hover:-translate-x-0.5 group-hover:border-caramel/40">
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

      <main className="mx-auto w-[92%] max-w-7xl px-1 pb-24 pt-32">
        {/* Heading */}
        <div className="text-center">
          <span className="inline-block rounded-full bg-jade/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-jade">
            {t("galleryBadge")}
          </span>
          <h1 className="font-display mt-4 text-3xl font-extrabold tracking-tight text-charcoal sm:text-4xl">
            {t("galleryTitle")}
          </h1>
        </div>

        {/* Masonry grid */}
        {images.length === 0 ? (
          <div className="mt-20 flex flex-col items-center gap-3 text-charcoal-soft">
            <ImageOff size={40} className="text-caramel/50" />
            <p className="text-sm">{t("galleryEmpty")}</p>
          </div>
        ) : (
          <div className="mt-12 columns-2 gap-4 sm:columns-3 lg:columns-4 [column-fill:_balance]">
            {images.map((src, i) => (
              <motion.button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.05 }}
                className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-caramel"
              >
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  className="w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                />
              </motion.button>
            ))}
          </div>
        )}
      </main>

      <Lightbox images={images} index={active} onClose={() => setActive(null)} onChange={setActive} />
    </div>
  );
}
