import { useState, useRef, useEffect } from "react";
import { ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";
import gsap from "gsap";
import type { UIKey } from "../../i18n";

interface GalleryDeckProps {
  images: string[];
  t: (key: UIKey) => string;
}

export default function GalleryDeck({ images, t }: GalleryDeckProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const sheetRefs = useRef<(HTMLDivElement | null)[]>([]);

  const totalSheets = images.length;
  const isCompleted = currentPage >= totalSheets;

  const flipPage = () => {
    if (isAnimating || currentPage >= totalSheets) return;
    setIsAnimating(true);

    const sheet = sheetRefs.current[currentPage];
    if (!sheet) {
      setCurrentPage((prev) => prev + 1);
      setIsAnimating(false);
      return;
    }

    const shadowFront = sheet.querySelector(".page-shadow-front");
    const shadowBack = sheet.querySelector(".page-shadow-back");

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentPage((prev) => prev + 1);
        setIsAnimating(false);
        setDragOffset({ x: 0, y: 0 });
      }
    });

    // 3D bend flip animation
    tl.to(sheet, {
      rotationY: -180,
      z: 40,
      duration: 0.95,
      ease: "power2.inOut",
    });

    tl.to(sheet, {
      z: 0,
      duration: 0.15,
      ease: "power1.out"
    }, "-=0.15");

    if (shadowFront) {
      tl.to(shadowFront, {
        opacity: 0.55,
        duration: 0.45,
        ease: "power2.in"
      }, 0);
    }

    if (shadowBack) {
      tl.fromTo(shadowBack, 
        { opacity: 0.65 },
        { opacity: 0, duration: 0.45, ease: "power2.out" },
        0.45
      );
    }
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

      const distance = Math.sqrt(dragOffset.x * dragOffset.x + dragOffset.y * dragOffset.y);
      const clickThreshold = 6;

      if (distance < clickThreshold || dragOffset.x < -60) {
        flipPage();
      } else {
        const sheet = sheetRefs.current[currentPage];
        if (sheet) {
          gsap.to(sheet, {
            rotationY: 0,
            z: 0,
            duration: 0.45,
            ease: "power2.out",
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
  }, [isDragging, dragStart, dragOffset, currentPage]);

  const getCardStyle = (index: number): React.CSSProperties => {
    const offset = index - currentPage;

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

    if (offset === 0 && isDragging) {
      const rot = (dragOffset.x / window.innerWidth) * 30;
      return {
        transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rot}deg)`,
        zIndex: 50,
        cursor: "grabbing",
        userSelect: "none",
        touchAction: "none",
      };
    }

    const scale = 1 - offset * 0.04;
    const zIndex = 35 - offset;
    const opacity = 1 - offset * 0.22;

    const rotList = [0, -3, 3.5, -1.5, 2];
    const xList = [0, -5, 5, -2, 4];
    const yList = [0, 4, 8, 12, 15];

    const idxKey = index % 5;
    const rotation = offset === 0 ? 0 : rotList[idxKey] * (1 + offset * 0.1);
    const shiftX = offset === 0 ? 0 : xList[idxKey];
    const shiftY = offset === 0 ? 0 : yList[idxKey];

    return {
      position: "absolute",
      left: "0",
      top: "0",
      width: "100%",
      height: "100%",
      transform: `translate(${shiftX}px, ${shiftY}px) scale(${scale}) rotate(${rotation}deg)`,
      transformOrigin: "left bottom",
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
              {!isCompleted ? (
                <button
                  onClick={flipPage}
                  disabled={isAnimating}
                  className="btn-primary rounded-full px-7 py-3 text-sm flex items-center gap-2 group shadow-soft"
                >
                  <span>{t("navGallery") === "Galereya" ? "Varaqlash" : t("navGallery") === "Галерея" ? "Листать" : "Flip Page"}</span>
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
                  {currentPage + 1} / {totalSheets}
                </span>
              )}
            </div>
          </div>

          {/* Right Interactive Column (3D OPEN BOOK) */}
          <div className="lg:col-span-7 flex justify-center items-center">
            
            {/* 3D OPEN BOOK CONTAINER */}
            <div 
              className="relative w-full max-w-[320px] aspect-[1.3/1] sm:max-w-[500px] sm:aspect-[1.45/1] bg-[#27180e] rounded-lg p-2 sm:p-3.5 flex select-none"
              style={{
                boxShadow: 
                  "0 20px 45px rgba(0,0,0,0.45), " +
                  "inset 0 0 25px rgba(0,0,0,0.85)",
                border: "3px solid #3c2415",
                outline: "1px solid #56331e",
              }}
            >
              {/* Spine Center Line shadow */}
              <div className="absolute top-0 bottom-0 left-[50%] -translate-x-[50%] w-1 bg-black/75 z-40" />

              {/* LEFT PAGE STACK (With page depth box-shadow lines) */}
              <div 
                className="w-1/2 h-full bg-[#fdf5e2] rounded-l border-r border-black/10 relative overflow-hidden flex items-center justify-center p-2.5 sm:p-5"
                style={{
                  backgroundImage: "linear-gradient(to right, #ebdcb7 0%, #fdf6e2 8%, #fffdf8 100%)",
                  /* Multiple offset shadows create realistic stacked paper layers on left side */
                  boxShadow: 
                    "inset -2px 0 10px rgba(0,0,0,0.18), " +
                    "-1px 1px 0 #d2c09d, -2px 2px 0 #fffcf6, " +
                    "-3px 3px 0 #d2c09d, -4px 4px 0 #fffcf6, " +
                    "-5px 5px 0 #d2c09d, -6px 6px 0 #fffcf6, " +
                    "-7px 7px 12px rgba(0,0,0,0.3)"
                }}
              >
                {currentPage > 0 && currentPage <= images.length ? (
                  <div className="w-full h-full rounded overflow-hidden relative border border-black/5">
                    <img 
                      src={images[currentPage - 1]} 
                      alt="" 
                      className="w-full h-full object-cover" 
                      style={{ filter: "sepia(0.06) contrast(1.02) brightness(0.96)", mixBlendMode: "multiply" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-black/5 pointer-events-none" />
                  </div>
                ) : (
                  <div className="text-center max-w-[130px] sm:max-w-xs px-1 pointer-events-none select-none opacity-80 scale-90 sm:scale-100">
                    <BookOpen size={20} className="mx-auto text-caramel mb-2 animate-pulse" />
                    <h4 className="font-display text-[9px] sm:text-sm font-bold text-charcoal uppercase">
                      Apex Academy
                    </h4>
                    <p className="text-[7px] sm:text-[10px] font-bold text-caramel mt-0.5">
                      {t("navGallery") === "Galereya" ? "Foto Albom" : t("navGallery") === "Галерея" ? "Фото Альбом" : "Photo Album"}
                    </p>
                  </div>
                )}
              </div>

              {/* RIGHT PAGE STACK (With page depth box-shadow lines) */}
              <div 
                className="w-1/2 h-full bg-[#fdf5e2] rounded-r border-l border-black/10 relative overflow-hidden flex items-center justify-center p-2.5 sm:p-5"
                style={{
                  backgroundImage: "linear-gradient(to left, #ebdcb7 0%, #fdf6e2 8%, #fffdf8 100%)",
                  /* Multiple offset shadows create realistic stacked paper layers on right side */
                  boxShadow: 
                    "inset 2px 0 10px rgba(0,0,0,0.18), " +
                    "1px 1px 0 #d2c09d, 2px 2px 0 #fffcf6, " +
                    "3px 3px 0 #d2c09d, 4px 4px 0 #fffcf6, " +
                    "5px 5px 0 #d2c09d, 6px 6px 0 #fffcf6, " +
                    "7px 7px 12px rgba(0,0,0,0.3)"
                }}
              >
                {currentPage < totalSheets - 1 ? (
                  <div className="w-full h-full rounded overflow-hidden relative border border-black/5">
                    <img 
                      src={images[currentPage + 1]} 
                      alt="" 
                      className="w-full h-full object-cover" 
                      style={{ filter: "sepia(0.06) contrast(1.02) brightness(0.96)", mixBlendMode: "multiply" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-black/5 pointer-events-none" />
                  </div>
                ) : (
                  <div className="text-center max-w-[130px] sm:max-w-xs px-1 pointer-events-none select-none opacity-50 scale-90 sm:scale-100">
                    <CheckCircle2 size={20} className="mx-auto text-jade-deep mb-2" />
                    <span className="font-display text-[8px] sm:text-[10px] font-bold text-charcoal-soft uppercase">
                      {t("navGallery") === "Galereya" ? "Albom yakunlandi" : t("navGallery") === "Галерея" ? "Альбом завершен" : "End of Album"}
                    </span>
                  </div>
                )}
              </div>

              {/* ── 3D FLIPPING SHEETS ── */}
              {!isCompleted && images.map((src, idx) => {
                if (idx < currentPage) return null;
                const isTop = idx === currentPage;

                return (
                  <div
                    key={idx}
                    ref={(el) => {
                      sheetRefs.current[idx] = el;
                    }}
                    onMouseDown={isTop ? handleStart : undefined}
                    onTouchStart={isTop ? handleStart : undefined}
                    className="absolute top-2 bottom-2 right-2 left-[50%] sm:top-3.5 sm:bottom-3.5 sm:right-3.5 origin-left"
                    style={{
                      transformStyle: "preserve-3d",
                      zIndex: 35 - idx,
                      cursor: isTop ? (isDragging ? "grabbing" : "grab") : "default",
                      touchAction: "none",
                    }}
                  >
                    
                    {/* FRONT FACE */}
                    <div 
                      className="absolute inset-0 bg-[#fffcf6] rounded-r border-l border-black/5 p-2.5 sm:p-5 flex items-center justify-center backface-hidden"
                      style={{
                        backgroundImage: "linear-gradient(to left, #ebdcb7 0%, #fdf6e2 8%, #fffdf8 100%)",
                        /* Individual page shadow thickness */
                        boxShadow: 
                          "inset -12px 0 25px rgba(0,0,0,0.05), " +
                          "1px 1px 0 #d2c09d, 2px 2px 0 #fffcf6, " +
                          "3px 3px 10px rgba(0,0,0,0.2)"
                      }}
                    >
                      <div className="page-shadow-front absolute inset-0 bg-black opacity-0 pointer-events-none z-10" />

                      <div className="w-full h-full rounded overflow-hidden relative border border-black/5">
                        <img 
                          src={src} 
                          alt="" 
                          className="w-full h-full object-cover pointer-events-none"
                          style={{ filter: "sepia(0.06) contrast(1.02) brightness(0.96)", mixBlendMode: "multiply" }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-black/5 pointer-events-none" />
                      </div>
                    </div>

                    {/* BACK FACE */}
                    <div 
                      className="absolute inset-0 bg-[#fffcf6] rounded-l border-r border-black/5 p-2.5 sm:p-5 flex items-center justify-center backface-hidden"
                      style={{
                        transform: "rotateY(180deg)",
                        backgroundImage: "linear-gradient(to right, #ebdcb7 0%, #fdf6e2 8%, #fffdf8 100%)",
                        boxShadow: 
                          "inset 12px 0 25px rgba(0,0,0,0.05), " +
                          "-1px 1px 0 #d2c09d, -2px 2px 0 #fffcf6, " +
                          "-3px 3px 10px rgba(0,0,0,0.2)"
                      }}
                    >
                      <div className="page-shadow-back absolute inset-0 bg-black opacity-0 pointer-events-none z-10" />

                      <div className="w-full h-full rounded overflow-hidden relative border border-black/5">
                        <img 
                          src={src} 
                          alt="" 
                          className="w-full h-full object-cover pointer-events-none"
                          style={{ filter: "sepia(0.06) contrast(1.02) brightness(0.96)", mixBlendMode: "multiply" }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-black/5 pointer-events-none" />
                      </div>
                    </div>

                  </div>
                );
              })}

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
