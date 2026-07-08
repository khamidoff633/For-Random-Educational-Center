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
  
  // Tactical press state for physical button compression
  const [isPressed, setIsPressed] = useState(false);
  
  // Tracking swipe start time to calculate drag velocity (Fling inertia)
  const dragStartTime = useRef(0);

  // Flicker-free parallax tilt tracked relative to viewport
  const [containerTilt, setContainerTilt] = useState({ x: 0, y: 0 });

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
    setIsPressed(true);
    dragStartTime.current = Date.now();
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
    setIsPressed(false);
    
    const dragDuration = Date.now() - dragStartTime.current;
    const absOffset = Math.abs(dragOffset);

    // Fling Inertia logic: if swipe was fast (< 220ms) and had momentum, trigger slide instantly
    const isFling = dragDuration < 220 && absOffset > 40;

    if (isFling || absOffset > 80) {
      if (dragOffset < 0) {
        handleNext();
      } else {
        handlePrev();
      }
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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const rotateY = (x / (rect.width / 2)) * 8;
    const rotateX = -(y / (rect.height / 2)) * 8;
    setContainerTilt({ x: rotateY, y: rotateX });
  };

  const handleMouseLeave = () => {
    setContainerTilt({ x: 0, y: 0 });
    setIsPressed(false);
  };

  const getCardStyle = (index: number): React.CSSProperties => {
    let diff = index - activeIndex;

    // Wrap around for infinite loop
    if (diff < -total / 2) diff += total;
    if (diff > total / 2) diff -= total;

    const dragProgress = dragOffset / 300;
    const progress = diff - dragProgress;

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
    const spread = isMobile ? 140 : 340; 
    
    // Compute basic scale and 3D Z-tilt
    let scale = 1 - Math.abs(progress) * (isMobile ? 0.22 : 0.18);
    const translateX = progress * spread;
    const opacity = 1 - Math.abs(progress) * 0.55;
    
    const isCenter = index === activeIndex;

    // Elastic Physics: neighboring cards lean organically towards active card
    const elasticSway = isCenter ? 0 : (dragOffset / 100) * 1.8;
    const rotateZ = progress * 3.5 + elasticSway;
    const zIndex = 10 - Math.round(Math.abs(progress) * 2);

    // 3D Parallax Tilt (Only on active center card)
    const tiltX = isCenter ? containerTilt.y : 0;
    const tiltY = isCenter ? containerTilt.x : 0;

    // Lift center card on hover/drag
    let liftY = isCenter ? (isDragging ? -15 : -8) : 0;
    let translateZ = isCenter ? 0 : -40; // Push background cards back

    // Tactile 3D Button Press: compress active card slightly when clicked/pressed
    if (isCenter && isPressed) {
      scale *= 0.96;
      translateZ -= 15;
    }

    // Dynamic Soya Depth
    const shadowStyle = isCenter 
      ? (isDragging 
          ? "0 35px 65px -12px rgba(200, 120, 40, 0.26), 0 10px 22px -5px rgba(200, 120, 40, 0.1)" 
          : "0 22px 45px -8px rgba(200, 120, 40, 0.18), 0 5px 15px -3px rgba(40, 25, 12, 0.06)")
      : "0 10px 25px -6px rgba(40, 25, 12, 0.08)";

    return {
      position: "absolute",
      left: "50%",
      top: "50%",
      width: isMobile ? "210px" : "400px",
      height: isMobile ? "131px" : "250px",
      marginLeft: isMobile ? "-105px" : "-200px",
      marginTop: isMobile ? "-65px" : "-125px",
      transformStyle: "preserve-3d",
      transform: `translateX(${translateX}px) translateY(${liftY}px) translateZ(${translateZ}px) scale(${scale}) rotateZ(${rotateZ}deg) rotateY(${tiltY}deg) rotateX(${tiltX}deg)`,
      opacity,
      zIndex,
      boxShadow: shadowStyle,
      cursor: isCenter ? (isDragging ? "grabbing" : "grab") : "pointer",
      userSelect: "none",
      touchAction: "none",
      transition: isDragging 
        ? "none" 
        : "transform 0.65s cubic-bezier(0.25, 0.8, 0.25, 1.15), opacity 0.65s ease, z-index 0.65s ease, box-shadow 0.45s ease",
    };
  };

  // Dynamic Ambilight Projection Color Mapping based on active image content
  const getAmbientColor = (index: number) => {
    const src = images[index] || "";
    if (src.includes("github") || src.includes("octocat")) {
      return "rgba(100, 100, 100, 0.15)";
    }
    if (src.includes("js") || src.includes("javascript")) {
      return "rgba(247, 223, 30, 0.22)";
    }
    if (src.includes("bakhiriddin") || src.includes("logo")) {
      return "rgba(212, 170, 43, 0.2)";
    }
    if (src.includes("dashboard") || src.includes("apex")) {
      return "rgba(40, 120, 240, 0.18)";
    }
    return "rgba(212, 143, 56, 0.16)"; // default warm caramel glow
  };

  const glareX = -containerTilt.x * 6;
  const glareY = containerTilt.y * 6;

  return (
    <section id="gallery" className="py-24 bg-cream-soft/10 overflow-hidden relative">
      
      {/* 🌈 DYNAMIC AMBILIGHT PROJECTION LIGHTS (Color changes dynamically to match active image) */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[340px] rounded-full pointer-events-none z-0 transition-all duration-700 ease-in-out"
        style={{
          background: `radial-gradient(circle, ${getAmbientColor(activeIndex)} 0%, transparent 70%)`,
          filter: "blur(60px)"
        }}
      />

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
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            perspective: "1200px",
            transformStyle: "preserve-3d"
          }}
        >
          {images.map((src, idx) => {
            const isCenter = idx === activeIndex;
            return (
              <div
                key={idx}
                onClick={() => handleCardClick(idx)}
                style={getCardStyle(idx)}
                onMouseDown={isCenter ? () => setIsPressed(true) : undefined}
                onMouseUp={() => setIsPressed(false)}
                className={`rounded-2xl bg-[#fffdf8] border border-caramel/20 p-3 transition-colors duration-300 relative group ${
                  isCenter ? "border-caramel/40" : "opacity-50"
                }`}
              >
                {/* ⚜️ GOLD FILIGREE CORNERS (Ornate luxury details only on active card) */}
                {isCenter && (
                  <>
                    <div className="absolute top-2.5 left-2.5 w-3 h-3 border-t-2 border-l-2 border-caramel/50 rounded-tl pointer-events-none z-30 transition-opacity duration-300" />
                    <div className="absolute top-2.5 right-2.5 w-3 h-3 border-t-2 border-r-2 border-caramel/50 rounded-tr pointer-events-none z-30 transition-opacity duration-300" />
                    <div className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b-2 border-l-2 border-caramel/50 rounded-bl pointer-events-none z-30 transition-opacity duration-300" />
                    <div className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b-2 border-r-2 border-caramel/50 rounded-br pointer-events-none z-30 transition-opacity duration-300" />
                  </>
                )}

                {/* Image backdrop container */}
                <div className="w-full h-full rounded-xl overflow-hidden bg-cream-soft/20 flex items-center justify-center relative border border-black/5">
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-contain pointer-events-none p-1 sm:p-2"
                    style={{
                      filter: "brightness(1.01) contrast(1.01)",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-white/10 pointer-events-none" />
                </div>

                {/* DYNAMIC SHIFTING GLARE OVERLAY */}
                {isCenter && (
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                    style={{
                      background: `radial-gradient(circle at ${50 + glareX}% ${50 + glareY}%, rgba(255,255,255,0.18) 0%, transparent 65%)`,
                      mixBlendMode: "overlay"
                    }}
                  />
                )}
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
