import { useState, useRef } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import gsap from "gsap";
import type { UIKey } from "../../i18n";

interface GalleryDeckProps {
  images: string[];
  t: (key: UIKey) => string;
}

export default function GalleryDeck({ images, t }: GalleryDeckProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  if (!images.length) return null;

  const handleNext = () => {
    if (isAnimating || activeIndex >= images.length) return;
    setIsAnimating(true);

    const topCard = cardRefs.current[activeIndex];
    if (!topCard) {
      setActiveIndex((prev) => prev + 1);
      setIsAnimating(false);
      return;
    }

    // Modern fast physics swipe direction
    const direction = Math.random() > 0.5 ? 1 : -1;
    const exitX = direction * (window.innerWidth > 768 ? 400 : 280);
    const exitY = -40 - Math.random() * 50;
    const exitRot = direction * (12 + Math.random() * 8);

    // Highly realistic, snappy swipe exit
    gsap.to(topCard, {
      x: exitX,
      y: exitY,
      rotation: exitRot,
      opacity: 0,
      scale: 0.94,
      duration: 0.42,
      ease: "power3.inOut",
      onComplete: () => {
        setActiveIndex((prev) => prev + 1);
        setIsAnimating(false);
      },
    });
  };

  // Modern Stack offsets (Minimalist Hi-Tech look)
  const getCardStyle = (index: number): React.CSSProperties => {
    const offset = index - activeIndex;

    if (offset < 0) {
      return {
        pointerEvents: "none",
        opacity: 0,
        transform: "scale(0.9) translateY(-30px)",
        zIndex: 0,
      };
    }

    const maxVisible = 3;
    if (offset >= maxVisible) {
      return {
        pointerEvents: "none",
        opacity: 0,
        transform: "scale(0.9)",
        zIndex: 1,
      };
    }

    const scale = 1 - offset * 0.04;
    const yTranslate = offset * 12;
    const zIndex = 30 - offset;
    const opacity = 1 - offset * 0.25;

    // Subtle 3D tilt stack styling
    const baseRotation = index % 2 === 0 ? -1.5 : 1.8;
    const rotation = offset === 0 ? 0 : baseRotation * (1 + offset * 0.25);

    return {
      position: "absolute",
      left: "0",
      top: "0",
      width: "100%",
      height: "100%",
      transform: `translateY(${yTranslate}px) scale(${scale}) rotate(${rotation}deg)`,
      transformOrigin: "center bottom",
      opacity,
      zIndex,
      transition: "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease",
    };
  };

  const isCompleted = activeIndex >= images.length;

  return (
    <section id="gallery" className="py-24 bg-cream-soft/10 overflow-hidden relative">
      <div className="mx-auto w-[92%] max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-5 text-center lg:text-left">
            <span className="inline-block rounded-full border border-caramel/30 bg-caramel/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-caramel-deep">
              {t("galleryBadge")}
            </span>
            <h2 className="font-display mt-4 text-3xl font-extrabold tracking-tight text-charcoal sm:text-4xl">
              {t("galleryTitle")}
            </h2>
            <p className="mt-4 text-sm sm:text-base text-charcoal-soft font-medium leading-relaxed max-w-lg mx-auto lg:mx-0">
              {t("navGallery") === "Galereya" 
                ? "Markazimiz hayoti, o'quvchilarimiz yutuqlari va o'quv jarayonidan jonli foto-lavhalarni varaqlang." 
                : t("navGallery") === "Галерея"
                ? "Пролистайте живые фотографии из жизни нашего центра, успехов студентов и учебного процесса."
                : "Browse through live photo moments from our center life, student achievements, and study process."}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              {!isCompleted ? (
                <button
                  onClick={handleNext}
                  disabled={isAnimating}
                  className="btn-primary rounded-full px-7 py-3 text-sm flex items-center gap-2 group shadow-soft"
                >
                  <span>{t("navGallery") === "Galereya" ? "Keyingi rasm" : t("navGallery") === "Галерея" ? "Следующее фото" : "Next Photo"}</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </button>
              ) : (
                <div className="flex items-center gap-2 text-xs font-bold text-charcoal-soft/75 bg-black/5 px-4 py-2 rounded-full">
                  <CheckCircle2 size={14} className="text-jade-deep" />
                  <span>
                    {t("navGallery") === "Galereya" 
                      ? "Barcha rasmlar ko'rildi" 
                      : t("navGallery") === "Галерея" 
                      ? "Все фото просмотрены" 
                      : "All photos viewed"}
                  </span>
                </div>
              )}
              
              {!isCompleted && (
                <span className="text-xs font-bold text-caramel-deep/80 tracking-wider">
                  {activeIndex + 1} / {images.length}
                </span>
              )}
            </div>
          </div>

          {/* Right Interactive Stack Column */}
          <div className="lg:col-span-7 flex justify-center items-center">
            <div className="relative w-[300px] h-[225px] sm:w-[420px] sm:h-[315px] flex items-center justify-center">
              
              {/* Stack Wrapper */}
              {!isCompleted ? (
                images.map((src, idx) => (
                  <div
                    key={idx}
                    ref={(el) => { cardRefs.current[idx] = el; }}
                    style={getCardStyle(idx)}
                  >
                    {/* Snappy Hi-tech Card (No ornate details, clean borders, high-depth shadows) */}
                    <div
                      onClick={idx === activeIndex ? handleNext : undefined}
                      className="w-full h-full cursor-pointer select-none bg-neutral-900 border border-black/5 rounded-2xl overflow-hidden shadow-[0_15px_40px_-15px_rgba(0,0,0,0.5)] transition-all duration-300"
                    >
                      <img
                        src={src}
                        alt=""
                        loading="lazy"
                        className="w-full h-full object-cover pointer-events-none transition duration-500 hover:scale-[1.03]"
                      />
                    </div>
                  </div>
                ))
              ) : (
                /* Completed State: Simple low-key minimalist text in the empty background space */
                <span className="text-xs font-bold tracking-wider text-charcoal-soft/50 animate-pulse">
                  {t("navGallery") === "Galereya" 
                    ? "Rasmlar tugadi" 
                    : t("navGallery") === "Галерея" 
                    ? "Фотографии закончились" 
                    : "End of gallery"}
                </span>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
