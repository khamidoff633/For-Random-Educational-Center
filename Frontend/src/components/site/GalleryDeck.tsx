import { useState, useRef, useEffect } from "react";
import { ArrowRight, RotateCcw, CheckCircle2 } from "lucide-react";
import gsap from "gsap";
import type { UIKey } from "../../i18n";

interface GalleryDeckProps {
  images: string[];
  t: (key: UIKey) => string;
}

export default function GalleryDeck({ images, t }: GalleryDeckProps) {
  const [cards, setCards] = useState(() => 
    images.map((src, index) => ({ id: index, src, index }))
  );
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const activeCardRef = useRef<HTMLDivElement>(null);
  
  // 3D Mouse Parallax Tilt for top card
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const total = images.length;

  const throwCard = (dirX: number, dirY: number) => {
    if (isAnimating || cards.length === 0) return;
    setIsAnimating(true);

    const topCardEl = activeCardRef.current;
    if (!topCardEl) {
      cycleCards();
      return;
    }

    const targetX = dirX * (window.innerWidth > 768 ? 480 : 320);
    const targetY = dirY * 180 - 60;
    const targetRot = dirX * 35;

    // Smooth throw animation
    gsap.to(topCardEl, {
      x: targetX,
      y: targetY,
      rotation: targetRot,
      opacity: 0,
      scale: 0.9,
      duration: 0.65,
      ease: "power2.out",
      onComplete: () => {
        cycleCards();
      }
    });
  };

  const cycleCards = () => {
    setCards((prev) => {
      if (prev.length === 0) return prev;
      const [first, ...rest] = prev;
      return [...rest, first];
    });
    setDragOffset({ x: 0, y: 0 });
    setIsAnimating(false);
  };

  const handleNextClick = () => {
    if (isAnimating) return;
    const dir = Math.random() > 0.5 ? 1 : -1;
    throwCard(dir, -0.3);
  };

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
    if (isAnimating || cards.length === 0) return;
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

      const distance = Math.sqrt(dragOffset.x * dragOffset.x + dragOffset.y * dragOffset.y);
      const clickThreshold = 6;

      if (distance < clickThreshold) {
        const dir = Math.random() > 0.5 ? 1 : -1;
        throwCard(dir, -0.3);
      } else {
        const threshold = 110;
        if (Math.abs(dragOffset.x) > threshold) {
          const dirX = dragOffset.x > 0 ? 1 : -1;
          const dirY = dragOffset.y / 150;
          throwCard(dirX, dirY);
        } else {
          const topCardEl = activeCardRef.current;
          if (topCardEl) {
            gsap.to(topCardEl, {
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
  }, [isDragging, dragStart, dragOffset, cards]);

  const handleTiltMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging || isAnimating) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Tilt calculations
    const rotateY = (x / (rect.width / 2)) * 12;
    const rotateX = -(y / (rect.height / 2)) * 12;
    setTilt({ x: rotateY, y: rotateX });
  };

  const handleTiltLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const getCardStyle = (deckIndex: number): React.CSSProperties => {
    const isTop = deckIndex === 0;

    if (deckIndex >= 4) {
      return {
        opacity: 0,
        pointerEvents: "none",
        transform: "scale(0.8) translateY(30px) translateZ(-120px)",
        zIndex: 0,
        transition: "opacity 0.4s ease, transform 0.4s ease",
      };
    }

    // Top Card under drag - lifted slightly on Z-axis (+20px) to float above stack
    if (isTop && isDragging) {
      const rot = (dragOffset.x / window.innerWidth) * 35;
      return {
        transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) translateZ(20px) rotate(${rot}deg)`,
        zIndex: 35,
        cursor: "grabbing",
        userSelect: "none",
        touchAction: "none",
      };
    }

    const scale = 1 - deckIndex * 0.045;
    const zIndex = 30 - deckIndex;
    const opacity = 1 - deckIndex * 0.18;

    // Organic layout coordinates
    const rotList = [0, -3.2, 3.8, -2];
    const xList = [0, -8, 6, -4];
    const yList = [0, 8, 14, 18];

    const idxKey = deckIndex % 4;
    const baseRotation = rotList[idxKey];
    const shiftX = xList[idxKey];
    const shiftY = yList[idxKey];

    // CRITICAL FIX: translateZ separates cards in 3D depth to prevent intersection clipping on hover
    const translateZ = deckIndex * -30;

    const tiltX = isTop ? tilt.y : 0;
    const tiltY = isTop ? tilt.x : 0;

    return {
      position: "absolute",
      left: "0",
      top: "0",
      width: "100%",
      height: "100%",
      transform: `translate(${shiftX}px, ${shiftY}px) translateZ(${translateZ}px) scale(${scale}) rotate(${baseRotation + tiltY}deg) rotateX(${tiltX}deg)`,
      opacity,
      zIndex,
      transformOrigin: "center center",
      transition: isTop ? "none" : "transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1.15), opacity 0.4s ease",
      cursor: isTop ? "grab" : "default",
      userSelect: "none",
      touchAction: "none",
    };
  };

  return (
    <section id="gallery" className="py-24 bg-cream-soft/10 overflow-hidden relative">
      <div className="mx-auto w-[92%] max-w-7xl relative z-10">
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
              <button
                onClick={handleNextClick}
                disabled={isAnimating || cards.length === 0}
                className="btn-primary rounded-full px-7 py-3 text-sm flex items-center gap-2 group shadow-soft"
              >
                <span>{t("navGallery") === "Galereya" ? "Varaqlash" : t("navGallery") === "Галерея" ? "Листать" : "Swipe Photo"}</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Right Column (3D Organic Stack Deck with depth translation fix) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            
            <div 
              className="relative w-[290px] h-[193px] sm:w-[460px] sm:h-[306px] flex items-center justify-center"
              style={{
                perspective: "1200px",
                transformStyle: "preserve-3d",
              }}
            >
              {cards.map((card, deckIndex) => {
                const isTop = deckIndex === 0;

                return (
                  <div
                    key={card.id}
                    ref={isTop ? activeCardRef : undefined}
                    onMouseDown={isTop ? handleStart : undefined}
                    onTouchStart={isTop ? handleStart : undefined}
                    onMouseMove={isTop ? handleTiltMove : undefined}
                    onMouseLeave={isTop ? handleTiltLeave : undefined}
                    style={{
                      ...getCardStyle(deckIndex),
                      transformStyle: "preserve-3d", // enable internal 3D rendering
                    }}
                    className="rounded-2xl bg-[#fffdf8] border border-caramel/20 p-2 sm:p-3 shadow-[0_18px_40px_-10px_rgba(40,25,12,0.15)] hover:shadow-[0_22px_50px_-8px_rgba(40,25,12,0.22)] transition-shadow duration-300"
                  >
                    {/* Inner image container */}
                    <div className="w-full h-full rounded-xl overflow-hidden bg-cream-soft/20 flex items-center justify-center relative border border-black/5">
                      <img
                        src={card.src}
                        alt=""
                        className="w-full h-full object-cover pointer-events-none"
                        style={{
                          filter: "brightness(1.01) contrast(1.01)",
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-white/10 pointer-events-none" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination dot indicator */}
            {cards.length > 0 && (
              <div className="flex gap-1.5 mt-8 justify-center">
                {images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === cards[0].index
                        ? "w-7 bg-gradient-to-r from-caramel to-caramel-deep"
                        : "w-1.5 bg-charcoal/10"
                    }`}
                  />
                ))}
              </div>
            )}

          </div>

        </div>
      </div>
    </section>
  );
}
