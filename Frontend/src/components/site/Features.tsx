import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import { FeatureIcon } from "./featureIcon";
import type { SchoolSettings } from "../../types";
import type { UIKey } from "../../i18n";

export default function Features({
  settings,
  t,
}: {
  settings: SchoolSettings;
  t: (key: UIKey) => string;
}) {
  // Auto-scroll loop for mobile Features Carousel
  const mobileScrollRef = useRef<HTMLDivElement | null>(null);
  const isMobilePausedRef = useRef(false);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const featuresList = settings.features?.slice(0, 4) || [];

  const handleScroll = () => {
    const el = mobileScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  };

  useEffect(() => {
    handleScroll();
  }, [featuresList]);

  useEffect(() => {
    if (featuresList.length <= 1) return;
    const timer = setInterval(() => {
      const el = mobileScrollRef.current;
      if (!el || isMobilePausedRef.current) return;
      
      const cardWidth = el.clientWidth;
      const maxScroll = el.scrollWidth - el.clientWidth;
      
      if (el.scrollLeft >= maxScroll - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: cardWidth, behavior: "smooth" });
      }
    }, 4500); // 4.5s reading speed

    return () => clearInterval(timer);
  }, [featuresList]);

  const scrollMobile = (direction: "left" | "right") => {
    const el = mobileScrollRef.current;
    if (!el) return;
    isMobilePausedRef.current = true;
    const cardWidth = el.clientWidth;
    el.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
    setTimeout(() => {
      isMobilePausedRef.current = false;
    }, 5000); // Resume auto scroll after 5 seconds of manual interaction
  };

  return (
    <section className="mx-auto w-[92%] max-w-7xl py-24">
      <SectionHeading eyebrow={t("whyUs")} title={t("featuresTitle")} description={t("featuresDesc")} />

      {/* Mobile view: Swipeable Reels Carousel with buttons */}
      <div className="relative mt-10 group sm:hidden">
        {/* Navigation Buttons */}
        <button
          onClick={() => scrollMobile("left")}
          disabled={!canScrollLeft}
          className={`absolute left-1 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-caramel/20 bg-white/90 text-caramel-deep shadow-md backdrop-blur-sm transition focus:outline-none ${
            !canScrollLeft ? "opacity-30 pointer-events-none" : "opacity-100 hover:scale-105"
          }`}
          aria-label="Oldingi"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => scrollMobile("right")}
          disabled={!canScrollRight}
          className={`absolute right-1 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-caramel/20 bg-white/90 text-caramel-deep shadow-md backdrop-blur-sm transition focus:outline-none ${
            !canScrollRight ? "opacity-30 pointer-events-none" : "opacity-100 hover:scale-105"
          }`}
          aria-label="Keyingi"
        >
          <ChevronRight size={16} />
        </button>

        {/* Swipe container */}
        <div
          ref={mobileScrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-4 pb-6 px-1 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onTouchStart={() => { isMobilePausedRef.current = true; }}
          onTouchEnd={() => { 
            setTimeout(() => { isMobilePausedRef.current = false; }, 5000); 
          }}
        >
          {featuresList.map((feature, i) => {
            const tone = i % 2 === 1 ? "bg-jade/12 text-jade-deep" : "bg-caramel/12 text-caramel-deep";
            return (
              <div key={feature.id} className="w-[85vw] shrink-0 snap-center">
                <div className="card-soft bg-white group flex h-60 flex-col gap-4 rounded-2xl p-6 transition-all duration-300">
                  <span className={`inline-flex h-14 w-14 items-center justify-center rounded-xl transition group-hover:scale-110 ${tone}`}>
                    <FeatureIcon name={feature.icon} />
                  </span>
                  <h3 className="font-display text-lg font-bold text-charcoal">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-charcoal-soft">{feature.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop view: Grid */}
      <div className="mt-14 hidden sm:grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featuresList.map((feature, i) => {
          // Alternate caramel / jade accents for a tasteful two-tone rhythm.
          const tone = i % 2 === 1 ? "bg-jade/12 text-jade-deep" : "bg-caramel/12 text-caramel-deep";
          return (
            <Reveal key={feature.id} delay={i * 0.08}>
              <div className="card-soft group flex h-full flex-col gap-4 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-soft-lg">
                <span className={`inline-flex h-14 w-14 items-center justify-center rounded-xl transition group-hover:scale-110 ${tone}`}>
                  <FeatureIcon name={feature.icon} />
                </span>
                <h3 className="font-display text-lg font-bold text-charcoal">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-charcoal-soft">{feature.desc}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
