import { useState, useRef, useEffect } from "react";
import { Check, Star, ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import type { PricingPlan } from "../../types";
import type { UIKey } from "../../i18n";

export default function Pricing({
  plans,
  t,
  onEnroll,
}: {
  plans: PricingPlan[];
  t: (key: UIKey) => string;
  onEnroll: () => void;
}) {
  if (!plans.length) return null;

  // Auto-scroll loop for mobile Pricing Carousel
  // Auto-scroll loop for mobile Pricing Carousel
  const mobileScrollRef = useRef<HTMLDivElement | null>(null);
  const isMobilePausedRef = useRef(false);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleScroll = () => {
    const el = mobileScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  };

  useEffect(() => {
    handleScroll();
  }, [plans]);

  useEffect(() => {
    if (plans.length <= 1) return;
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
  }, [plans]);

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
    <section id="pricing" className="mx-auto w-[92%] max-w-7xl py-24">
      <SectionHeading eyebrow={t("pricingBadge")} title={t("pricingTitle")} description={t("pricingDesc")} />

      {/* Mobile view: Swipeable Reels Carousel with buttons */}
      <div className="relative mt-10 group sm:hidden">
        {/* Navigation Buttons */}
        <button
          onClick={() => scrollMobile("left")}
          disabled={!canScrollLeft}
          className={`absolute -left-2 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-caramel/20 bg-white/90 text-caramel-deep shadow-md backdrop-blur-sm transition focus:outline-none ${
            !canScrollLeft ? "opacity-30 pointer-events-none" : "opacity-100 hover:scale-105"
          }`}
          aria-label="Oldingi"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => scrollMobile("right")}
          disabled={!canScrollRight}
          className={`absolute -right-2 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-caramel/20 bg-white/90 text-caramel-deep shadow-md backdrop-blur-sm transition focus:outline-none ${
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
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-4 pt-4 pb-6 px-1 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onTouchStart={() => { isMobilePausedRef.current = true; }}
          onTouchEnd={() => { 
            setTimeout(() => { isMobilePausedRef.current = false; }, 5000); 
          }}
        >
          {plans.map((plan) => (
            <div key={plan.id} className="w-[85vw] shrink-0 snap-center">
              <div
                className={`relative flex h-[22rem] flex-col rounded-3xl p-7 transition-all duration-300 ${
                  plan.highlighted
                    ? "bg-espresso text-cream shadow-soft-lg ring-2 ring-caramel"
                    : "card-soft bg-white"
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-caramel px-3 py-1 text-[11px] font-bold text-white">
                    <Star size={11} /> {t("pricingPopular")}
                  </span>
                )}
                <h3 className={`font-display text-lg font-bold ${plan.highlighted ? "text-cream" : "text-charcoal"}`}>
                  {plan.name}
                </h3>
                <div className="mt-3 flex items-end gap-1">
                  <span className={`font-display text-4xl font-extrabold ${plan.highlighted ? "text-white" : "text-charcoal"}`}>
                    {plan.price}
                  </span>
                  <span className={`mb-1 text-sm ${plan.highlighted ? "text-cream/70" : "text-charcoal-soft"}`}>
                    so'm / {plan.period}
                  </span>
                </div>

                {plan.features && plan.features.length > 0 && (
                  <ul className="mt-6 flex-1 space-y-3 overflow-y-auto">
                    {plan.features.map((f, idx) => (
                      <li key={idx} className={`flex items-center gap-2.5 text-sm ${plan.highlighted ? "text-cream/90" : "text-charcoal-soft"}`}>
                        <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${plan.highlighted ? "bg-caramel/30 text-caramel" : "bg-jade/12 text-jade-deep"}`}>
                          <Check size={12} />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                )}

                <button
                  onClick={onEnroll}
                  className={`mt-7 w-full rounded-full py-3 text-sm font-bold transition ${
                    plan.highlighted
                      ? "btn-primary"
                      : "btn-outline"
                  }`}
                >
                  {t("pricingChoose")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop view: Grid */}
      <div className="mt-14 hidden sm:grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan, i) => (
          <Reveal key={plan.id} delay={i * 0.08}>
            <div
              className={`relative flex h-full flex-col rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1.5 ${
                plan.highlighted
                  ? "bg-espresso text-cream shadow-soft-lg ring-2 ring-caramel"
                  : "card-soft"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-caramel px-3 py-1 text-[11px] font-bold text-white">
                  <Star size={11} /> {t("pricingPopular")}
                </span>
              )}
              <h3 className={`font-display text-lg font-bold ${plan.highlighted ? "text-cream" : "text-charcoal"}`}>
                {plan.name}
              </h3>
              <div className="mt-3 flex items-end gap-1">
                <span className={`font-display text-4xl font-extrabold ${plan.highlighted ? "text-white" : "text-charcoal"}`}>
                  {plan.price}
                </span>
                <span className={`mb-1 text-sm ${plan.highlighted ? "text-cream/70" : "text-charcoal-soft"}`}>
                  so'm / {plan.period}
                </span>
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f, idx) => (
                  <li key={idx} className={`flex items-center gap-2.5 text-sm ${plan.highlighted ? "text-cream/90" : "text-charcoal-soft"}`}>
                    <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${plan.highlighted ? "bg-caramel/30 text-caramel" : "bg-jade/12 text-jade-deep"}`}>
                      <Check size={12} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={onEnroll}
                className={`mt-7 rounded-full py-3 text-sm font-bold transition ${
                  plan.highlighted
                    ? "btn-primary"
                    : "btn-outline"
                }`}
              >
                {t("pricingChoose")}
              </button>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
