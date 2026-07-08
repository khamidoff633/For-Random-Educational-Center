import { useState, useRef, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { UIKey } from "../../i18n";

interface GalleryDeckProps {
  images: string[];
  t: (key: UIKey) => string;
}

export default function GalleryDeck({ images, t }: GalleryDeckProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const total = images.length;

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const handleCardClick = (index: number) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setDragStart(clientX);
    setDragOffset(0);
  };

  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const offset = clientX - dragStart;
    setDragOffset(offset);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (dragOffset < -55) {
      handleNext();
    } else if (dragOffset > 55) {
      handlePrev();
    }
    setDragOffset(0);
  };

  useEffect(() => {
    if (!isDragging) return;

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
  }, [isDragging, dragStart, dragOffset]);

  const getCardStyle = (index: number): React.CSSProperties => {
    let diff = index - activeIndex;

    // Wrap around for infinite loop
    if (diff < -total / 2) diff += total;
    if (diff > total / 2) diff -= total;

    const dragProgress = dragOffset / 300;
    const progress = diff - dragProgress;

    // Show exactly 3 cards at a time to keep layout clean and zero-overlap
    const isVisible = Math.abs(progress) < 1.6;
    if (!isVisible) {
      return {
        opacity: 0,
        pointerEvents: "none",
        transform: "translateX(0px) scale(0.6)",
        zIndex: 0,
      };
    }

    const isMobile = window.innerWidth < 768;
    
    // Strict 2D layout calculation: no 3D rotations or Z depth
    const spread = isMobile ? 130 : 340; 
    const scale = 1 - Math.abs(progress) * (isMobile ? 0.22 : 0.16);
    const translateX = progress * spread;
    const opacity = 1 - Math.abs(progress) * 0.55;
    const zIndex = 10 - Math.round(Math.abs(progress) * 2);

    // Natural paper card shadow
    const shadowStyle = index === activeIndex 
      ? "0 16px 36px -8px rgba(40, 25, 12, 0.12), 0 4px 12px -3px rgba(40, 25, 12, 0.05)"
      : "0 8px 20px -6px rgba(40, 25, 12, 0.06)";

    return {
      position: "absolute",
      left: "50%",
      top: "50%",
      width: isMobile ? "210px" : "400px",
      height: isMobile ? "131px" : "250px",
      marginLeft: isMobile ? "-105px" : "-200px",
      marginTop: isMobile ? "-65px" : "-125px",
      transform: `translateX(${translateX}px) scale(${scale})`, // 100% flat 2D transform
      opacity,
      zIndex,
      boxShadow: shadowStyle,
      cursor: index === activeIndex ? (isDragging ? "grabbing" : "grab") : "pointer",
      userSelect: "none",
      touchAction: "none",
      // Clean spring-like snap transition
      transition: isDragging 
        ? "none" 
        : "transform 0.55s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.55s ease, z-index 0.55s ease, box-shadow 0.4s ease",
    };
  };

  return (
    <section id="gallery" className="py-24 bg-cream-soft/10 overflow-hidden relative">
      <div className="mx-auto w-[92%] max-w-7xl relative z-10">
        
        {/* Header section */}
        <div className="text-center mb-16">
          <span className="inline-block rounded-full border border-caramel/30 bg-caramel/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-caramel-deep">
            {t("galleryBadge")}
          </span>
          <h2 className="font-display mt-4 text-3xl font-extrabold tracking-tight text-charcoal sm:text-4xl">
            {t("galleryTitle")}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-charcoal-soft font-medium leading-relaxed max-w-lg mx-auto">
            {t("navGallery") === "Galereya" 
              ? "Markazimiz hayoti, o'quvchilarimiz yutuqlari va o'quv jarayonidan jonli foto-lavhalarni varaqlang." 
              : t("navGallery") === "Галерея" 
              ? "Пролистайте живые фотографии из жизни нашего центра, успехов студентов и учебного процесса."
              : "Browse through live photo moments from our center life, student achievements, and study process."}
          </p>
        </div>

        {/* ── 2D COVERFLOW VIEWPORT (Clean, Flat, zero-glitch) ── */}
        <div 
          ref={containerRef}
          className="relative w-full h-[180px] sm:h-[320px] flex items-center justify-center"
          onMouseDown={handleStart}
          onTouchStart={handleStart}
        >
          {images.map((src, idx) => {
            const isCenter = idx === activeIndex;
            return (
              <div
                key={idx}
                onClick={() => handleCardClick(idx)}
                style={getCardStyle(idx)}
                // Classic cream card format with soft borders and natural flat shadow
                className={`rounded-2xl bg-white border border-caramel/20 p-3 transition-colors duration-300 ${
                  isCenter ? "border-caramel/40" : "opacity-50"
                }`}
              >
                {/* 100% contained display inside paper card */}
                <div className="w-full h-full rounded-xl overflow-hidden bg-cream-soft/10 flex items-center justify-center relative border border-black/5">
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-contain pointer-events-none p-1 sm:p-2"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-white/5 pointer-events-none" />
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Dots indicator ── */}
        <div className="flex flex-col items-center gap-6 mt-12">
          
          <div className="flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === activeIndex 
                    ? "w-8 bg-gradient-to-r from-caramel to-caramel-deep" 
                    : "w-2 bg-charcoal/15 hover:bg-charcoal/30"
                }`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
