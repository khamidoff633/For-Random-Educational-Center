import { useState, useRef, useEffect } from "react";
import { ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";
import gsap from "gsap";
import type { UIKey } from "../../i18n";
import luxuryOpenBook from "../../assets/luxury_open_book.jpg";

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

    // 3D bend flip animation mimicking physical page weight
    tl.to(sheet, {
      rotationY: -180,
      z: 50,
      duration: 1.05,
      ease: "power2.inOut",
    });

    tl.to(sheet, {
      z: 0,
      duration: 0.15,
      ease: "power1.out"
    }, "-=0.15");

    if (shadowFront) {
      tl.to(shadowFront, {
        opacity: 0.5,
        duration: 0.5,
        ease: "power2.in"
      }, 0);
    }

    if (shadowBack) {
      tl.fromTo(shadowBack, 
        { opacity: 0.6 },
        { opacity: 0, duration: 0.5, ease: "power2.out" },
        0.5
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
            duration: 0.5,
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

    if (offset === 0 && isDragging) {
      const rot = (dragOffset.x / window.innerWidth) * 30;
      return {
        position: "absolute",
        left: "50.7%",
        width: "34.5%",
        top: "10%",
        height: "80%",
        transformOrigin: "left center",
        transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rot}deg)`,
        zIndex: 50,
        cursor: "grabbing",
        userSelect: "none",
        touchAction: "none",
      };
    }

    const scale = 1 - offset * 0.005;
    const zIndex = 35 - index;
    const opacity = offset === 0 ? 1 : 0;

    return {
      position: "absolute",
      left: "50.7%",
      width: "34.5%",
      top: "10%",
      height: "80%",
      transformOrigin: "left center",
      transform: `scale(${scale})`,
      opacity,
      zIndex,
      cursor: "grab",
      userSelect: "none",
      touchAction: "none",
    };
  };

  return (
    <section id="gallery" className="py-24 bg-cream-soft/10 overflow-hidden relative">
      <div className="mx-auto w-[92%] max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column - Adjusted size (4 cols) to fit larger book */}
          <div className="lg:col-span-4 text-center lg:text-left">
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

          {/* Right Interactive Column - Expanded size (8 cols) for twice larger book */}
          <div className="lg:col-span-8 flex justify-center items-center">
            
            {/* Twice larger 3D Book shell container */}
            <div 
              className="relative w-full max-w-[340px] aspect-[1.33/1] sm:max-w-[760px] sm:aspect-[1.33/1] select-none"
              style={{
                backgroundImage: `url(${luxuryOpenBook})`,
                backgroundSize: "100% 100%",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                perspective: "1500px" // Increased perspective depth for larger scale
              }}
            >

              {/* LEFT PAGE SURFACE OVERLAY */}
              <div 
                className="absolute overflow-hidden flex items-center justify-center p-1 sm:p-2.5"
                style={{
                  left: "14.8%",
                  width: "34.5%",
                  top: "10%",
                  height: "80%",
                }}
              >
                {currentPage > 0 && currentPage <= images.length ? (
                  <div className="w-full h-full rounded overflow-hidden relative">
                    <img 
                      src={images[currentPage - 1]} 
                      alt="" 
                      className="w-full h-full object-cover" 
                      style={{ filter: "sepia(0.06) contrast(1.02) brightness(0.96)", mixBlendMode: "multiply" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-black/5 pointer-events-none" />
                  </div>
                ) : (
                  <div className="text-center max-w-[100px] sm:max-w-xs px-1 pointer-events-none select-none opacity-80 scale-[0.8] sm:scale-100">
                    <BookOpen size={22} className="mx-auto text-caramel-deep mb-2.5 animate-pulse" />
                    <h4 className="font-display text-[9px] sm:text-xs font-bold text-charcoal uppercase">
                      Apex Academy
                    </h4>
                    <p className="text-[7px] sm:text-[9px] font-bold text-caramel-deep mt-0.5">
                      {t("navGallery") === "Galereya" ? "Foto Albom" : t("navGallery") === "Галерея" ? "Фото Альбом" : "Photo Album"}
                    </p>
                  </div>
                )}
              </div>

              {/* RIGHT PAGE SURFACE OVERLAY (Upcoming background page layer) */}
              <div 
                className="absolute overflow-hidden flex items-center justify-center p-1 sm:p-2.5"
                style={{
                  left: "50.7%",
                  width: "34.5%",
                  top: "10%",
                  height: "80%",
                }}
              >
                {currentPage < totalSheets - 1 ? (
                  <div className="w-full h-full rounded overflow-hidden relative">
                    <img 
                      src={images[currentPage + 1]} 
                      alt="" 
                      className="w-full h-full object-cover" 
                      style={{ filter: "sepia(0.08) contrast(1.02) brightness(0.96)", mixBlendMode: "multiply" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-black/5 pointer-events-none" />
                  </div>
                ) : (
                  <div className="text-center max-w-[100px] sm:max-w-xs px-1 pointer-events-none select-none opacity-50 scale-[0.8] sm:scale-100">
                    <CheckCircle2 size={20} className="mx-auto text-jade-deep mb-2" />
                    <span className="font-display text-[8px] sm:text-[9px] font-bold text-charcoal-soft uppercase">
                      {t("navGallery") === "Galereya" ? "Albom yakunlandi" : t("navGallery") === "Галерея" ? "Альбом завершен" : "End of Album"}
                    </span>
                  </div>
                )}
              </div>

              {/* ── 3D FLIPPING SHEETS OVERLAY ── */}
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
                    style={getCardStyle(idx)}
                  >
                    
                    {/* FRONT FACE (Visible on the right side) */}
                    <div 
                      className="absolute inset-0 bg-[#fffcf6] rounded-r border-l border-black/5 p-1 sm:p-2.5 flex items-center justify-center backface-hidden"
                      style={{
                        backgroundImage: "linear-gradient(to left, #ebdcb7 0%, #fdf6e2 8%, #fffdf8 100%)",
                      }}
                    >
                      <div className="page-shadow-front absolute inset-0 bg-black opacity-0 pointer-events-none z-10" />

                      <div className="w-full h-full rounded overflow-hidden relative">
                        <img 
                          src={src} 
                          alt="" 
                          className="w-full h-full object-cover pointer-events-none"
                          style={{ filter: "sepia(0.08) contrast(1.02) brightness(0.96)", mixBlendMode: "multiply" }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-black/5 pointer-events-none" />
                      </div>
                    </div>

                    {/* BACK FACE (Visible on the left side after flipped) */}
                    <div 
                      className="absolute inset-0 bg-[#fffcf6] rounded-l border-r border-black/5 p-1 sm:p-2.5 flex items-center justify-center backface-hidden"
                      style={{
                        transform: "rotateY(180deg)",
                        backgroundImage: "linear-gradient(to right, #ebdcb7 0%, #fdf6e2 8%, #fffdf8 100%)",
                      }}
                    >
                      <div className="page-shadow-back absolute inset-0 bg-black opacity-0 pointer-events-none z-10" />

                      <div className="w-full h-full rounded overflow-hidden relative">
                        <img 
                          src={src} 
                          alt="" 
                          className="w-full h-full object-cover pointer-events-none"
                          style={{ filter: "sepia(0.08) contrast(1.02) brightness(0.96)", mixBlendMode: "multiply" }}
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
