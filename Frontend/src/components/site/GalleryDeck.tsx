import { useState, useRef, useEffect } from "react";
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
  
  // Drag states
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const activeCardRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const isCompleted = activeIndex >= images.length;

  // Snappy GSAP swipe helper
  const swipeAway = (directionX: number, velocityY = -40) => {
    if (isAnimating) return;
    setIsAnimating(true);

    const topCard = cardRefs.current[activeIndex];
    if (!topCard) {
      setActiveIndex((prev) => prev + 1);
      setIsAnimating(false);
      return;
    }

    const exitX = directionX * (window.innerWidth > 768 ? 450 : 320);
    const exitRot = directionX * 22;

    gsap.to(topCard, {
      x: exitX,
      y: velocityY,
      rotation: exitRot,
      opacity: 0,
      scale: 0.93,
      duration: 0.45,
      ease: "power2.out",
      onComplete: () => {
        setDragOffset({ x: 0, y: 0 });
        setActiveIndex((prev) => prev + 1);
        setIsAnimating(false);
      },
    });
  };

  // Button click backup action
  const handleNextClick = () => {
    const dir = Math.random() > 0.5 ? 1 : -1;
    swipeAway(dir);
  };

  // ─── Drag Event Handlers ─────────────────────────────────────
  const getCoords = (e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
    if ("touches" in e) {
      if (e.touches.length > 0) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      if ("changedTouches" in e && e.changedTouches.length > 0) {
        return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
      }
    }
    if ("clientX" in e) {
      return { x: e.clientX, y: e.clientY };
    }
    return { x: 0, y: 0 };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (isAnimating || isCompleted) return;
    const coords = getCoords(e);
    setDragStart(coords);
    setDragOffset({ x: 0, y: 0 });
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const coords = getCoords(e);
      const dx = coords.x - dragStart.x;
      const dy = coords.y - dragStart.y;
      setDragOffset({ x: dx, y: dy });
    };

    const handleEnd = () => {
      setIsDragging(false);
      const threshold = 110;

      // If dragged past threshold, swipe away. Otherwise snap back.
      if (Math.abs(dragOffset.x) > threshold) {
        const dir = dragOffset.x > 0 ? 1 : -1;
        swipeAway(dir, dragOffset.y);
      } else {
        // Snap back to original center
        const topCard = cardRefs.current[activeIndex];
        if (topCard) {
          gsap.to(topCard, {
            x: 0,
            y: 0,
            rotation: 0,
            duration: 0.55,
            ease: "elastic.out(1, 0.6)",
          });
        }
        setDragOffset({ x: 0, y: 0 });
      }
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleMove, { passive: true });
    window.addEventListener("touchend", handleEnd);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, dragStart, dragOffset, activeIndex]);

  // Stack layouts with organic random offsets (messy photo stack effect)
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

    const maxVisible = 4;
    if (offset >= maxVisible) {
      return {
        pointerEvents: "none",
        opacity: 0,
        transform: "scale(0.85)",
        zIndex: 1,
      };
    }

    // Active Card is being dragged
    if (offset === 0 && isDragging) {
      const rot = dragOffset.x * 0.08; // tilts as dragged
      return {
        transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rot}deg)`,
        zIndex: 50,
        cursor: "grabbing",
        userSelect: "none",
        touchAction: "none",
      };
    }

    // Stack rendering offsets (organic scattering angles)
    const scale = 1 - offset * 0.045;
    const zIndex = 30 - offset;
    const opacity = 1 - offset * 0.22;

    // Define organic rotation & translate offsets to look scattered
    const rotList = [0, -3.5, 4.2, -1.8, 2.8];
    const xList = [0, -8, 6, -3, 5];
    const yList = [0, 6, 12, 18, 22];

    const idxKey = index % 5;
    const rotation = offset === 0 ? 0 : rotList[idxKey] * (1 + offset * 0.15);
    const shiftX = offset === 0 ? 0 : xList[idxKey];
    const shiftY = offset === 0 ? 0 : yList[idxKey];

    return {
      position: "absolute",
      left: "0",
      top: "0",
      width: "100%",
      height: "100%",
      transform: `translate(${shiftX}px, ${shiftY}px) scale(${scale}) rotate(${rotation}deg)`,
      transformOrigin: "center bottom",
      opacity,
      zIndex,
      transition: "transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1.1), opacity 0.4s ease",
      cursor: "grab",
      userSelect: "none",
      touchAction: "none",
    };
  };

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
                  onClick={handleNextClick}
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
                images.map((src, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <div
                      key={idx}
                      ref={(el) => {
                        cardRefs.current[idx] = el;
                      }}
                      onMouseDown={isActive ? handleStart : undefined}
                      onTouchStart={isActive ? handleStart : undefined}
                      style={getCardStyle(idx)}
                    >
                      {/* Premium Photo Card Design: fine ivory paper border with shadow depth */}
                      <div className="w-full h-full p-2 sm:p-3 bg-[#fffdf6] border border-caramel/15 rounded-2xl shadow-[0_12px_28px_-8px_rgba(40,25,12,0.18)] transition-shadow duration-300 hover:shadow-[0_20px_40px_-10px_rgba(40,25,12,0.28)]">
                        <div className="w-full h-full rounded-xl overflow-hidden bg-cream-soft">
                          <img
                            src={src}
                            alt=""
                            className="w-full h-full object-cover pointer-events-none"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                /* Completed State */
                <span className="text-xs font-bold tracking-wider text-charcoal-soft/50 animate-pulse">
                  {t("navGallery") === "Galereya" 
                    ? "Barcha rasmlar ko'rildi" 
                    : t("navGallery") === "Галерея" 
                    ? "Все фото просмотрены" 
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
