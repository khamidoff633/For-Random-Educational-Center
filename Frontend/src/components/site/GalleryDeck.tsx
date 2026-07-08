import { useState, useRef, useEffect } from "react";
import { ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";
import gsap from "gsap";
import type { UIKey } from "../../i18n";
import libraryDeskBg from "../../assets/library_desk_bg.jpg";

interface GalleryDeckProps {
  images: string[];
  t: (key: UIKey) => string;
}

export default function GalleryDeck({ images, t }: GalleryDeckProps) {
  // We pair images up into sheets. 
  // Left page of sheet K is images[K*2], Right page is images[K*2 + 1].
  // To keep it simple and clean, each sheet has:
  // - Front Face (visible on the right before flipping)
  // - Back Face (visible on the left after flipping)
  // Since user requested "har bir varaqda faqat 1 tadan rasim bulishi kerak" (1 photo per page):
  // An open book has a Left Page and a Right Page.
  // We can make it so:
  // Page 0 is on the Right. Left page is initially a welcoming blank parchment page.
  // When Page 0 flips to the left, it shows Image 0 on the left, and reveals Image 1 on the right.
  // When Page 1 flips to the left, it shows Image 1 on the left (now covering Image 0), and reveals Image 2 on the right.
  // This creates a realistic page turning experience.
  
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

    // Dynamic shadow elements inside the turning sheet
    const shadowFront = sheet.querySelector(".page-shadow-front");
    const shadowBack = sheet.querySelector(".page-shadow-back");

    // GSAP 3D page turn timeline with bending effect
    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentPage((prev) => prev + 1);
        setIsAnimating(false);
        setDragOffset({ x: 0, y: 0 });
      }
    });

    // 3D rotation, scaling up slightly in the middle of the flip to look like it lifts,
    // and moving shadows dynamically across the paper.
    tl.to(sheet, {
      rotationY: -180,
      z: 50,
      duration: 1.05,
      ease: "power2.inOut",
    });

    // Bring it back down to sit flat on the left stack
    tl.to(sheet, {
      z: 0,
      duration: 0.15,
      ease: "power1.out"
    }, "-=0.2");

    // Shadow moves across front side as it stands up
    if (shadowFront) {
      tl.to(shadowFront, {
        opacity: 0.6,
        duration: 0.5,
        ease: "power2.in"
      }, 0);
    }

    // Shadow fades on back side as it sits down
    if (shadowBack) {
      tl.fromTo(shadowBack, 
        { opacity: 0.7 },
        { opacity: 0, duration: 0.5, ease: "power2.out" },
        0.5
      );
    }
  };

  // Drag and Swipe logic
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
      const clickThreshold = 6; // px

      // Tap/Click OR Dragged Left past threshold -> Turn Page!
      if (distance < clickThreshold || dragOffset.x < -60) {
        flipPage();
      } else {
        // Snap back if dragged other directions or not enough
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

  return (
    <section id="gallery" className="py-24 bg-[#140b04] overflow-hidden relative">
      {/* Soft warm light bloom from behind the book */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-caramel/10 blur-[130px] pointer-events-none z-0" />

      <div className="mx-auto w-[92%] max-w-7xl relative z-10">
        
        {/* Header elements */}
        <div className="text-center mb-16">
          <span className="inline-block rounded-full border border-caramel/30 bg-caramel/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-caramel">
            {t("galleryBadge")}
          </span>
          <h2 className="font-display mt-4 text-3xl font-extrabold tracking-tight text-cream sm:text-4xl">
            {t("galleryTitle")}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-cream-soft/70 font-medium leading-relaxed max-w-lg mx-auto">
            {t("navGallery") === "Galereya" 
              ? "Markazimiz hayoti, o'quvchilarimiz yutuqlari va o'quv jarayonidan jonli foto-lavhalarni varaqlang." 
              : t("navGallery") === "Галерея"
              ? "Пролистайте живые фотографии из жизни нашего центра, успехов студентов и учебного процесса."
              : "Browse through live photo moments from our center life, student achievements, and study process."}
          </p>
        </div>

        {/* 📚 3D OPEN BOOK WORKSPACE */}
        <div className="flex flex-col items-center justify-center">
          
          {/* Main Book Shell */}
          <div 
            className="relative w-full max-w-[340px] aspect-[1.3/1] sm:max-w-[720px] sm:aspect-[1.5/1] bg-[#2a1b10] rounded-lg p-2.5 sm:p-5 flex select-none"
            style={{
              boxShadow: 
                "0 30px 70px rgba(0,0,0,0.85), " +
                "0 15px 35px rgba(0,0,0,0.5), " +
                "inset 0 0 40px rgba(0,0,0,0.9)",
              /* Leather Book Edge Bevel styling */
              border: "4px solid #362315",
              outline: "2px solid #5a3a22",
            }}
          >
            {/* Book Spine Center Line */}
            <div className="absolute top-0 bottom-0 left-[50%] -translate-x-[50%] w-1.5 sm:w-2 bg-gradient-to-r from-black/60 via-black/90 to-black/60 z-40 border-l border-r border-[#1a110a]" />

            {/* Left Hand Stack (Background layers of turned pages) */}
            <div 
              className="w-1/2 h-full bg-[#fdf5e2] rounded-l-md border-r border-black/15 relative overflow-hidden flex items-center justify-center p-3 sm:p-6"
              style={{
                boxShadow: "inset 10px 0 25px rgba(0,0,0,0.06), inset -2px 0 10px rgba(0,0,0,0.18)",
                backgroundImage: "linear-gradient(to right, #ece1ca 0%, #fdf5e2 8%, #fffcf6 100%)"
              }}
            >
              {/* Paper stacked side edges depth effect */}
              <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-r from-black/40 via-black/15 to-transparent z-10" />
              
              {/* Image rendered on the Left stack (corresponds to current flipped back page) */}
              {currentPage > 0 && currentPage <= images.length ? (
                <div className="w-full h-full rounded-md overflow-hidden relative border border-black/5 opacity-90 transition duration-300">
                  <img 
                    src={images[currentPage - 1]} 
                    alt="" 
                    className="w-full h-full object-cover" 
                    style={{ filter: "sepia(0.08) contrast(1.02) brightness(0.96)", mixBlendMode: "multiply" }}
                  />
                  {/* Subtle paper vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-black/5 pointer-events-none" />
                </div>
              ) : (
                /* Welcoming front-page title on left side */
                <div className="text-center max-w-[140px] sm:max-w-xs px-2 pointer-events-none select-none opacity-85">
                  <BookOpen size={24} className="mx-auto text-caramel mb-2 sm:mb-4 animate-pulse" />
                  <h4 className="font-display text-[10px] sm:text-base font-bold text-charcoal tracking-wide uppercase">
                    Apex Academy
                  </h4>
                  <p className="text-[7px] sm:text-[11px] font-bold text-caramel mt-1">
                    {t("navGallery") === "Galereya" ? "Foto Albom" : t("navGallery") === "Галерея" ? "Фото Альбом" : "Photo Album"}
                  </p>
                </div>
              )}
            </div>

            {/* Right Hand Stack (Background layers of upcoming pages) */}
            <div 
              className="w-1/2 h-full bg-[#fdf5e2] rounded-r-md border-l border-black/15 relative overflow-hidden flex items-center justify-center p-3 sm:p-6"
              style={{
                boxShadow: "inset -10px 0 25px rgba(0,0,0,0.06), inset 2px 0 10px rgba(0,0,0,0.18)",
                backgroundImage: "linear-gradient(to left, #ece1ca 0%, #fdf5e2 8%, #fffcf6 100%)"
              }}
            >
              {/* Paper stacked side edges depth effect */}
              <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-gradient-to-l from-black/40 via-black/15 to-transparent z-10" />

              {/* Next image in line shows up on the right background layer */}
              {currentPage < totalSheets - 1 ? (
                <div className="w-full h-full rounded-md overflow-hidden relative border border-black/5 opacity-90 transition duration-300">
                  <img 
                    src={images[currentPage + 1]} 
                    alt="" 
                    className="w-full h-full object-cover" 
                    style={{ filter: "sepia(0.08) contrast(1.02) brightness(0.96)", mixBlendMode: "multiply" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-black/5 pointer-events-none" />
                </div>
              ) : (
                /* Completed State: empty blank page at the end */
                <div className="text-center max-w-[140px] sm:max-w-xs px-2 pointer-events-none select-none opacity-50">
                  <CheckCircle2 size={24} className="mx-auto text-jade-deep mb-2" />
                  <span className="font-display text-[9px] sm:text-xs font-bold text-charcoal-soft uppercase tracking-wider">
                    {t("navGallery") === "Galereya" ? "Albom yakunlandi" : t("navGallery") === "Галерея" ? "Альбом завершен" : "End of Album"}
                  </span>
                </div>
              )}
            </div>

            {/* ── 3D FLIPPING SHEETS WRAPPER ── */}
            {/* We map sheets in reverse order so the first sheets are stacked on top */}
            {!isCompleted && images.map((src, idx) => {
              if (idx < currentPage) return null; // already flipped
              const isTop = idx === currentPage;

              return (
                <div
                  key={idx}
                  ref={(el) => {
                    sheetRefs.current[idx] = el;
                  }}
                  onMouseDown={isTop ? handleStart : undefined}
                  onTouchStart={isTop ? handleStart : undefined}
                  className="absolute top-2.5 bottom-2.5 right-2.5 left-[50%] sm:top-5 sm:bottom-5 sm:right-5 origin-left"
                  style={{
                    transformStyle: "preserve-3d",
                    zIndex: 35 - idx,
                    cursor: isTop ? (isDragging ? "grabbing" : "grab") : "default",
                    touchAction: "none",
                  }}
                >
                  
                  {/* FRONT FACE (Visible on the right side) */}
                  <div 
                    className="absolute inset-0 bg-[#fffcf6] rounded-r-md border-l border-black/10 p-3 sm:p-6 flex items-center justify-center backface-hidden"
                    style={{
                      backgroundImage: "linear-gradient(to left, #ece1ca 0%, #fdf5e2 8%, #fffcf6 100%)",
                      boxShadow: "inset -12px 0 25px rgba(0,0,0,0.05), 1px 0 5px rgba(0,0,0,0.1)",
                    }}
                  >
                    {/* Shadow overlay used for page bend flex simulation */}
                    <div className="page-shadow-front absolute inset-0 bg-black opacity-0 pointer-events-none z-10 transition-opacity" />

                    <div className="w-full h-full rounded-md overflow-hidden relative border border-black/5">
                      <img 
                        src={src} 
                        alt="" 
                        className="w-full h-full object-cover pointer-events-none"
                        style={{ filter: "sepia(0.08) contrast(1.02) brightness(0.96)", mixBlendMode: "multiply" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-black/5 pointer-events-none" />
                    </div>
                  </div>

                  {/* BACK FACE (Visible on the left side after flipped) */}
                  <div 
                    className="absolute inset-0 bg-[#fffcf6] rounded-l-md border-r border-black/10 p-3 sm:p-6 flex items-center justify-center backface-hidden"
                    style={{
                      transform: "rotateY(180deg)",
                      backgroundImage: "linear-gradient(to right, #ece1ca 0%, #fdf5e2 8%, #fffcf6 100%)",
                      boxShadow: "inset 12px 0 25px rgba(0,0,0,0.05), -1px 0 5px rgba(0,0,0,0.1)",
                    }}
                  >
                    <div className="page-shadow-back absolute inset-0 bg-black opacity-0 pointer-events-none z-10 transition-opacity" />

                    <div className="w-full h-full rounded-md overflow-hidden relative border border-black/5">
                      <img 
                        src={src} 
                        alt="" 
                        className="w-full h-full object-cover pointer-events-none"
                        style={{ filter: "sepia(0.08) contrast(1.02) brightness(0.96)", mixBlendMode: "multiply" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-black/5 pointer-events-none" />
                    </div>
                  </div>

                </div>
              );
            })}

          </div>

          {/* Page Indicators & Actions (Bottom) */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
            {!isCompleted ? (
              <button
                onClick={flipPage}
                disabled={isAnimating}
                className="btn-primary rounded-full px-7 py-3 text-sm flex items-center gap-2 group shadow-lg"
              >
                <span>{t("navGallery") === "Galereya" ? "Varaqlash" : t("navGallery") === "Галерея" ? "Листать" : "Flip Page"}</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            ) : (
              <div className="flex items-center gap-2 text-xs font-bold text-cream-soft/75 bg-white/5 px-4 py-2 rounded-full border border-white/10">
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
              <span className="text-xs font-bold text-caramel/90 tracking-wider">
                {currentPage + 1} / {totalSheets}
              </span>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
