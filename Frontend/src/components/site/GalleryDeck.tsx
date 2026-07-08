import { useState, useRef, useEffect } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
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
  
  // Parallax Tilt states for active card
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const total = images.length;

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  // Click direct to card
  const handleCardClick = (index: number) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
  };

  // Drag and Swipe handlers
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
    
    // Swipe threshold (50px)
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

  // Active Card 3D Parallax Tilt
  const handleTiltMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Max 12 degrees tilt rotation
    const rotateY = (x / (rect.width / 2)) * 12;
    const rotateX = -(y / (rect.height / 2)) * 12;
    setTilt({ x: rotateY, y: rotateX });
  };

  const handleTiltLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Calculate 3D layout settings for each card index
  const getCardStyle = (index: number): React.CSSProperties => {
    // Calculate circular distance
    let diff = index - activeIndex;

    // Wrap around for infinite scroll appearance
    if (diff < -total / 2) diff += total;
    if (diff > total / 2) diff -= total;

    // Dynamic offset based on drag progress
    const dragProgress = dragOffset / 320; // Normalize drag distance
    const progress = diff - dragProgress;

    // Hidden cards that are far away
    const isVisible = Math.abs(progress) < 2.5;
    if (!isVisible) {
      return {
        opacity: 0,
        pointerEvents: "none",
        transform: "scale(0.5) translateZ(-300px)",
        transition: "opacity 0.4s ease, transform 0.4s ease",
      };
    }

    // Responsive spread and scale factor
    const isMobile = window.innerWidth < 768;
    const spread = isMobile ? 120 : 250; 
    const zOffset = isMobile ? -140 : -220; 

    // Compute Y-rotation angle to create sferik curve
    const angle = progress * (isMobile ? 26 : 32); 
    const translateX = progress * spread;
    const translateZ = -Math.abs(progress) * zOffset - 50;
    const scale = 1 - Math.abs(progress) * (isMobile ? 0.12 : 0.1);

    // Apply Parallax Tilt on the Active Card
    const isCenter = index === activeIndex;
    const tiltX = isCenter ? tilt.y : 0;
    const tiltY = isCenter ? tilt.x : 0;

    return {
      position: "absolute",
      left: "50%",
      top: "50%",
      width: isMobile ? "240px" : "480px",
      height: isMobile ? "160px" : "320px",
      marginLeft: isMobile ? "-120px" : "-240px",
      marginTop: isMobile ? "-80px" : "-160px",
      transformStyle: "preserve-3d",
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${angle + tiltY}deg) rotateX(${tiltX}deg) scale(${scale})`,
      opacity: 1 - Math.abs(progress) * 0.45,
      zIndex: 10 - Math.round(Math.abs(progress)),
      cursor: isCenter ? (isDragging ? "grabbing" : "grab") : "pointer",
      userSelect: "none",
      touchAction: "none",
      transition: isDragging ? "none" : "transform 0.55s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.55s ease, z-index 0.55s ease",
    };
  };

  return (
    <section id="gallery" className="py-24 bg-cream-soft/10 overflow-hidden relative">
      {/* Light decorative neon blur circles on background */}
      <div className="absolute top-[10%] left-[15%] w-96 h-96 rounded-full bg-caramel/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[15%] w-96 h-96 rounded-full bg-caramel/5 blur-[120px] pointer-events-none" />

      <div className="mx-auto w-[92%] max-w-7xl relative z-10">
        
        {/* Header Section */}
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

        {/* ── 3D CYLINDER CAROUSEL VIEWPORT ── */}
        <div 
          ref={containerRef}
          className="relative w-full h-[220px] sm:h-[400px] flex items-center justify-center"
          style={{
            perspective: "1400px",
            transformStyle: "preserve-3d",
          }}
          onMouseDown={handleStart}
          onTouchStart={handleStart}
        >
          {images.map((src, idx) => {
            const isCenter = idx === activeIndex;
            return (
              <div
                key={idx}
                onClick={() => handleCardClick(idx)}
                onMouseMove={isCenter ? handleTiltMove : undefined}
                onMouseLeave={isCenter ? handleTiltLeave : undefined}
                style={getCardStyle(idx)}
                // Modern tech styling with glowing gold border and high shadow depth
                className="rounded-2xl bg-charcoal/95 border border-caramel/25 p-2 shadow-[0_20px_50px_rgba(40,25,12,0.35)] hover:shadow-[0_25px_60px_rgba(200,130,50,0.25)] transition-shadow duration-300"
              >
                {/* Outer Glassmorphic inner-bevel container */}
                <div className="w-full h-full rounded-xl overflow-hidden bg-black/40 flex items-center justify-center relative">
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-contain pointer-events-none"
                    style={{
                      // Premium image display without sepia filters to preserve dashboard colors
                      filter: "brightness(1.02) contrast(1.02)",
                    }}
                  />
                  {/* Gentle vignette glare mask */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/5 pointer-events-none" />
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Carousel Dot Indicators & Swipe Action ── */}
        <div className="flex flex-col items-center gap-6 mt-12">
          
          {/* Active indicator dots */}
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

          {/* Swipe indicator text / drag instruction */}
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
