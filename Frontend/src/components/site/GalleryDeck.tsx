import { useState, useRef, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import gsap from "gsap";
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
    
    if (dragOffset < -50) {
      handleNext();
    } else if (dragOffset > 50) {
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

    // CRITICAL CLEANUP: Only show 3 cards (Active, Left neighbor, Right neighbor).
    // All other cards are completely hidden (opacity: 0) to avoid stacked clutter!
    const isVisible = Math.abs(progress) < 1.6;
    if (!isVisible) {
      return {
        opacity: 0,
        pointerEvents: "none",
        transform: "translateX(0px) scale(0.6) rotate(0deg)",
        zIndex: 0,
      };
    }

    const isMobile = window.innerWidth < 768;
    
    // Spread distances tailored to eliminate messy card overlaps
    const spread = isMobile ? 140 : 340; 
    const scale = 1 - Math.abs(progress) * (isMobile ? 0.22 : 0.18);
    const translateX = progress * spread;
    
    // Soft fade for background cards
    const opacity = 1 - Math.abs(progress) * 0.55;
    
    // Minimal organic Z-rotation (tilt) for realistic desk paper feel
    const rotateZ = progress * 3.2;
    const zIndex = 10 - Math.round(Math.abs(progress) * 2);

    return {
      position: "absolute",
      left: "50%",
      top: "50%",
      width: isMobile ? "210px" : "400px",
      height: isMobile ? "131px" : "250px",
      marginLeft: isMobile ? "-105px" : "-200px",
      marginTop: isMobile ? "-65px" : "-125px",
      transform: `translateX(${translateX}px) scale(${scale}) rotate(${rotateZ}deg)`,
      opacity,
      zIndex,
      cursor: index === activeIndex ? (isDragging ? "grabbing" : "grab") : "pointer",
      userSelect: "none",
      touchAction: "none",
      // Premium snappy elastic snap transition
      transition: isDragging 
        ? "none" 
        : "transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.65s ease, z-index 0.65s ease",
    };
  };

  return (
    <section id="gallery" className="py-24 bg-cream-soft/10 overflow-hidden relative">
      {/* Dynamic warm glow lights */}
      <div className="absolute top-[10%] left-[20%] w-96 h-96 rounded-full bg-caramel/5 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[20%] w-96 h-96 rounded-full bg-caramel/5 blur-[130px] pointer-events-none" />

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

        {/* ── 2.5D COVERFLOW VIEWPORT ── */}
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
                // Clean white card format, caramel border, deep shadow
                className={`rounded-2xl bg-white border border-caramel/20 p-3 shadow-[0_12px_35px_-6px_rgba(40,25,12,0.12)] hover:shadow-[0_18px_45px_-8px_rgba(200,120,40,0.16)] transition-all duration-300 ${
                  isCenter ? "hover:-translate-y-2 border-caramel shadow-[0_18px_40px_-6px_rgba(200,120,40,0.2)]" : "opacity-50"
                }`}
              >
                {/* Image fits naturally inside white card, no distortion or black margins */}
                <div className="w-full h-full rounded-xl overflow-hidden bg-[#faf8f4] flex items-center justify-center relative border border-black/5">
                  <img
                    src={src}
                    alt=""
                    // object-contain ensures absolute original aspect ratio with zero cropping/stretching
                    className="w-full h-full object-contain pointer-events-none p-1 sm:p-2"
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

        {/* ── Progress Indicators & Swipe tip ── */}
        <div className="flex flex-col items-center gap-6 mt-12">
          
          {/* Progress Dots */}
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

          {/* Swipe indicator text */}
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-charcoal-soft/50 uppercase tracking-wider">
            <span>
              {t("navGallery") === "Galereya" 
                ? "Aylantirish uchun sudrang yoki kliklang" 
                : t("navGallery") === "Галерея" 
                ? "Проведите или нажмите для прокрутки" 
                : "Drag or click to rotate"}
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
