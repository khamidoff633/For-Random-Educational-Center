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

    // Infinite loop wrap
    if (diff < -total / 2) diff += total;
    if (diff > total / 2) diff -= total;

    const dragProgress = dragOffset / 300;
    const progress = diff - dragProgress;

    const isVisible = Math.abs(progress) < 2.5;
    if (!isVisible) {
      return {
        opacity: 0,
        pointerEvents: "none",
        transform: "translateX(0px) scale(0.65) rotate(0deg)",
        zIndex: 0,
      };
    }

    const isMobile = window.innerWidth < 768;
    
    // Horizontal spread settings
    const spread = isMobile ? 110 : 230; 
    const scale = 1 - Math.abs(progress) * (isMobile ? 0.15 : 0.12);
    const translateX = progress * spread;
    const opacity = 1 - Math.abs(progress) * 0.45;
    
    // Depth rotation (creates a beautiful organic desk curve, no Y-rotation bugs!)
    const rotateZ = progress * 3.5;
    const zIndex = 10 - Math.round(Math.abs(progress) * 2);

    return {
      position: "absolute",
      left: "50%",
      top: "50%",
      width: isMobile ? "250px" : "540px",
      height: isMobile ? "156px" : "338px",
      marginLeft: isMobile ? "-125px" : "-270px",
      marginTop: isMobile ? "-78px" : "-169px",
      transform: `translateX(${translateX}px) scale(${scale}) rotate(${rotateZ}deg)`,
      opacity,
      zIndex,
      cursor: index === activeIndex ? (isDragging ? "grabbing" : "grab") : "pointer",
      userSelect: "none",
      touchAction: "none",
      // GSAP style fluid CSS transition bindings
      transition: isDragging 
        ? "none" 
        : "transform 0.55s cubic-bezier(0.25, 0.8, 0.25, 1.15), opacity 0.55s ease, z-index 0.55s ease",
    };
  };

  return (
    <section id="gallery" className="py-24 bg-cream-soft/10 overflow-hidden relative">
      {/* Light soft warm ambient light blobs */}
      <div className="absolute top-[10%] left-[15%] w-96 h-96 rounded-full bg-caramel/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[15%] w-96 h-96 rounded-full bg-caramel/5 blur-[120px] pointer-events-none" />

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
          className="relative w-full h-[200px] sm:h-[420px] flex items-center justify-center"
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
                // Premium white/cream layout with thin gold borders and soft drop shadows
                className={`rounded-2xl bg-white border border-caramel/20 p-2 shadow-[0_15px_40px_-10px_rgba(40,25,12,0.14)] hover:shadow-[0_20px_50px_-8px_rgba(200,120,40,0.18)] transition-all duration-300 ${
                  isCenter ? "hover:-translate-y-2 border-caramel/40 shadow-[0_20px_45px_-8px_rgba(200,120,40,0.22)]" : "opacity-60"
                }`}
              >
                {/* 100% full-bleed crisp image display inside */}
                <div className="w-full h-full rounded-xl overflow-hidden bg-cream-soft/20 flex items-center justify-center relative border border-black/5">
                  <img
                    src={src}
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

        {/* ── Progress Dots & Swipe Tip ── */}
        <div className="flex flex-col items-center gap-6 mt-12">
          
          {/* Slider indicator dots */}
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
