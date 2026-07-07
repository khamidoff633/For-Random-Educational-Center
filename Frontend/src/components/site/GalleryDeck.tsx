import { useState, useRef } from "react";
import { ArrowRight, RotateCcw, ImageOff } from "lucide-react";
import gsap from "gsap";
import type { UIKey } from "../../i18n";

interface GalleryDeckProps {
  images: string[];
  t: (key: UIKey) => string;
}

export default function GalleryDeck({ images, t }: GalleryDeckProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  if (!images.length) return null;

  const handleNext = () => {
    if (isAnimating || activeIndex >= images.length) return;
    setIsAnimating(true);

    const topCard = cardRefs.current[activeIndex];
    if (!topCard) {
      setActiveIndex((prev) => prev + 1);
      setIsAnimating(false);
      return;
    }

    // Determine random exit angle and direction (left or right)
    const direction = Math.random() > 0.5 ? 1 : -1;
    const exitX = direction * (window.innerWidth > 768 ? 450 : 300);
    const exitY = -50 - Math.random() * 80;
    const exitRot = direction * (15 + Math.random() * 15);

    // GSAP Swipe/Throw Animation
    gsap.to(topCard, {
      x: exitX,
      y: exitY,
      rotation: exitRot,
      opacity: 0,
      scale: 0.9,
      duration: 0.65,
      ease: "power2.out",
      onComplete: () => {
        setActiveIndex((prev) => prev + 1);
        setIsAnimating(false);
      },
    });
  };

  const handleReset = () => {
    setActiveIndex(0);
    // Animate all cards flying back in
    setTimeout(() => {
      cardRefs.current.forEach((card, idx) => {
        if (!card) return;
        gsap.fromTo(
          card,
          {
            x: idx % 2 === 0 ? -300 : 300,
            y: -100,
            rotation: idx % 2 === 0 ? -25 : 25,
            opacity: 0,
            scale: 0.8,
          },
          {
            x: 0,
            y: 0,
            rotation: () => -3 + Math.random() * 6,
            opacity: 1,
            scale: 1,
            duration: 0.75,
            delay: (images.length - 1 - idx) * 0.08,
            ease: "back.out(1.2)",
          }
        );
      });
    }, 50);
  };

  // Stack styling offsets
  const getCardStyle = (index: number): React.CSSProperties => {
    const offset = index - activeIndex;

    // Card already swiped/thrown
    if (offset < 0) {
      return {
        pointerEvents: "none",
        opacity: 0,
        transform: "scale(0.85) translate(0px, -40px) rotate(0deg)",
        zIndex: 0,
      };
    }

    // Maximum cards visible in stack at once
    const maxVisible = 3;
    if (offset >= maxVisible) {
      return {
        pointerEvents: "none",
        opacity: 0,
        transform: "scale(0.85)",
        zIndex: 1,
      };
    }

    const scale = 1 - offset * 0.05;
    const yTranslate = offset * 14;
    // Layering index
    const zIndex = 30 - offset;
    const opacity = 1 - offset * 0.28;

    // Slight rotation to look naturally shuffled
    const baseRotation = index % 2 === 0 ? -2 : 2.5;
    const rotation = offset === 0 ? 0 : baseRotation * (1 + offset * 0.3);

    return {
      position: "absolute",
      left: "0",
      top: "0",
      width: "100%",
      height: "100%",
      transform: `translateY(${yTranslate}px) scale(${scale}) rotate(${rotation}deg)`,
      transformOrigin: "center bottom",
      opacity,
      zIndex,
      transition: "transform 0.45s cubic-bezier(0.2, 0.8, 0.25, 1.1), opacity 0.45s ease",
    };
  };

  const isCompleted = activeIndex >= images.length;

  return (
    <section id="gallery" className="py-24 bg-cream-soft/30 overflow-hidden relative">
      {/* Background visual elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-caramel/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-caramel/5 blur-[100px] pointer-events-none" />

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
                  onClick={handleNext}
                  disabled={isAnimating}
                  className="btn-primary rounded-full px-7 py-3 text-sm flex items-center gap-2 group shadow-soft"
                >
                  <span>{t("navGallery") === "Galereya" ? "Keyingi rasm" : t("navGallery") === "Галерея" ? "Следующее фото" : "Next Photo"}</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </button>
              ) : (
                <button
                  onClick={handleReset}
                  className="btn-secondary rounded-full px-7 py-3 text-sm flex items-center gap-2 group shadow-soft"
                >
                  <RotateCcw size={16} className="transition-transform group-hover:rotate-[-45deg]" />
                  <span>{t("navGallery") === "Galereya" ? "Qaytadan ko'rish" : t("navGallery") === "Галерея" ? "Посмотреть заново" : "View again"}</span>
                </button>
              )}
              
              {!isCompleted && (
                <span className="text-xs font-bold text-caramel-deep/80 tracking-wider">
                  {activeIndex + 1} / {images.length}
                </span>
              )}
            </div>
          </div>

          {/* Right Interactive Stack Column */}
          <div className="lg:col-span-7 flex justify-center items-center">
            <div className="relative w-[320px] h-[240px] sm:w-[440px] sm:h-[330px]">
              
              {/* Stack Wrapper */}
              {!isCompleted ? (
                images.map((src, idx) => (
                  <div
                    key={idx}
                    ref={(el) => { cardRefs.current[idx] = el; }}
                    style={getCardStyle(idx)}
                  >
                    {/* Spotlight at the top of active card */}
                    {idx === activeIndex && <div className="museum-spotlight" style={{ top: "-15px" }} />}

                    <div
                      onClick={idx === activeIndex ? handleNext : undefined}
                      className="museum-frame w-full h-full cursor-pointer select-none"
                    >
                      <div className="frame-glare" />
                      <div className="museum-mat w-full h-full">
                        <img
                          src={src}
                          alt=""
                          loading="lazy"
                          className="max-h-full max-w-full object-contain pointer-events-none"
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                /* Completed State Card */
                <div
                  className="w-full h-full museum-frame flex flex-col items-center justify-center text-center p-6"
                  style={{
                    boxShadow: "0 15px 35px rgba(0,0,0,0.35)",
                    background: "linear-gradient(135deg, #1f140b 0%, #130a05 100%)",
                  }}
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-caramel/10 text-caramel mb-4">
                    <ImageOff size={24} />
                  </div>
                  <h3 className="font-display text-lg font-bold text-amber-200/90 mb-1">
                    {t("navGallery") === "Galereya" ? "Rasmlar tugadi" : t("navGallery") === "Галерея" ? "Фотографии закончились" : "End of gallery"}
                  </h3>
                  <p className="text-xs text-amber-100/60 max-w-xs mb-5 leading-relaxed">
                    {t("navGallery") === "Galereya" 
                      ? "Barcha foto-lavhalarni ko'rib chiqdingiz. Qiziqishingiz uchun rahmat!" 
                      : t("navGallery") === "Галерея"
                      ? "Вы просмотрели все фотографии. Спасибо за ваш интерес!"
                      : "You have viewed all photos. Thank you for your interest!"}
                  </p>
                  <button
                    onClick={handleReset}
                    className="btn-primary rounded-full px-5 py-2.5 text-xs flex items-center gap-1.5 shadow-md"
                  >
                    <RotateCcw size={13} />
                    <span>{t("navGallery") === "Galereya" ? "Boshidan boshlash" : t("navGallery") === "Галерея" ? "Начать сначала" : "Start over"}</span>
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
