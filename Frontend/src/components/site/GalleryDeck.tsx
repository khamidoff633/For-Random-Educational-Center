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

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const isCompleted = activeIndex >= images.length;

  // Snappy swipe out animation
  const swipeAway = (directionX: number, velocityY = -30) => {
    if (isAnimating) return;
    setIsAnimating(true);

    const topCard = cardRefs.current[activeIndex];
    if (!topCard) {
      setActiveIndex((prev) => prev + 1);
      setIsAnimating(false);
      return;
    }

    const exitX = directionX * (window.innerWidth > 768 ? 480 : 340);
    const exitRot = directionX * 28;

    gsap.to(topCard, {
      x: exitX,
      y: velocityY,
      rotation: exitRot,
      opacity: 0,
      scale: 0.92,
      duration: 0.45,
      ease: "power3.out",
      onComplete: () => {
        setDragOffset({ x: 0, y: 0 });
        setActiveIndex((prev) => prev + 1);
        setIsAnimating(false);
      },
    });
  };

  const handleNextClick = () => {
    const dir = Math.random() > 0.5 ? 1 : -1;
    swipeAway(dir);
  };

  // Coords helper
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

      // Check drag distance vector length to differentiate drag vs click/tap
      const distance = Math.sqrt(dragOffset.x * dragOffset.x + dragOffset.y * dragOffset.y);
      const clickThreshold = 6; // pixels

      if (distance < clickThreshold) {
        // User just tapped/clicked without dragging: trigger instant auto swipe!
        const dir = Math.random() > 0.5 ? 1 : -1;
        swipeAway(dir);
      } else {
        const threshold = 110;
        if (Math.abs(dragOffset.x) > threshold) {
          const dir = dragOffset.x > 0 ? 1 : -1;
          swipeAway(dir, dragOffset.y);
        } else {
          // Snap back
          const topCard = cardRefs.current[activeIndex];
          if (topCard) {
            gsap.to(topCard, {
              x: 0,
              y: 0,
              rotation: 0,
              duration: 0.5,
              ease: "elastic.out(1, 0.65)",
            });
          }
          setDragOffset({ x: 0, y: 0 });
        }
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

  // Stack layouts with organic random offsets
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
      const rot = (dragOffset.x / window.innerWidth) * 35;
      return {
        transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rot}deg)`,
        zIndex: 50,
        cursor: "grabbing",
        userSelect: "none",
        touchAction: "none",
      };
    }

    // Stack offsets
    const scale = 1 - offset * 0.045;
    const zIndex = 30 - offset;
    const opacity = 1 - offset * 0.22;

    const rotList = [0, -3.8, 4.5, -2, 3];
    const xList = [0, -9, 7, -4, 6];
    const yList = [0, 8, 14, 20, 24];

    const idxKey = index % 5;
    const rotation = offset === 0 ? 0 : rotList[idxKey] * (1 + offset * 0.12);
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
            </div>
          </div>

          {/* Right Interactive Stack Column */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            
            {/* Instagram Stories Style Progress Indicators (Top) */}
            {!isCompleted && (
              <div className="flex w-[290px] sm:w-[400px] gap-1.5 mb-6 justify-center">
                {images.map((_, idx) => (
                  <div 
                    key={idx} 
                    className="h-1.5 rounded-full flex-1 bg-black/5 overflow-hidden"
                  >
                    <div 
                      className="h-full bg-gradient-to-r from-caramel to-caramel-deep transition-all duration-300"
                      style={{
                        width: idx < activeIndex ? "100%" : idx === activeIndex ? "50%" : "0%"
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="relative w-[300px] h-[240px] sm:w-[420px] sm:h-[315px] flex items-center justify-center">
              
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
                      {/* Premium Polaroid-inspired Photo Card with clean margins & shadow */}
                      <div className="w-full h-full p-2.5 pb-7 sm:p-3.5 sm:pb-9 bg-[#fffdf8] border border-black/5 rounded-2xl shadow-[0_12px_30px_-6px_rgba(40,25,12,0.18)] hover:shadow-[0_20px_45px_-8px_rgba(40,25,12,0.28)] transition-shadow duration-300">
                        <div className="w-full h-full rounded-xl overflow-hidden bg-cream-soft border border-black/5">
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
