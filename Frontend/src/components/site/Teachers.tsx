import { useState, useRef, useEffect } from "react";
import { Phone, BadgeCheck, ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import Avatar from "../ui/Avatar";
import type { Teacher } from "../../types";
import type { UIKey } from "../../i18n";

function TeacherCard({ teacher, t }: { teacher: Teacher; t: (key: UIKey) => string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="card-soft group relative flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-soft-lg"
    >
      {/* Spotlight overlay */}
      {isHovered && (
        <div
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(180px circle at ${coords.x}px ${coords.y}px, rgba(200, 118, 26, 0.08), transparent 80%)`,
          }}
        />
      )}
      <div className="relative z-10 flex h-full flex-col flex-1">
      <div className="relative h-60 overflow-hidden">
        <Avatar
          name={teacher.name}
          src={teacher.image}
          className="h-60 w-full transition duration-500 group-hover:scale-105"
          fontClass="text-6xl"
        />
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-caramel-deep shadow-soft">
          <BadgeCheck size={12} /> {teacher.experience} {t("experience")}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold text-charcoal">{teacher.name}</h3>
        <p className="mt-0.5 text-xs font-semibold text-caramel-deep">{teacher.specialty}</p>
        <p className="mt-3 line-clamp-4 flex-1 text-sm leading-relaxed text-charcoal-soft">{teacher.bio}</p>
        {teacher.phone && (
          <a
            href={`tel:${teacher.phone}`}
            className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-charcoal-soft transition hover:text-caramel-deep"
          >
            <Phone size={13} /> {teacher.phone}
          </a>
        )}
      </div>
      </div>
    </div>
  );
}

export default function Teachers({
  teachers,
  t,
}: {
  teachers: Teacher[];
  t: (key: UIKey) => string;
}) {
  // Auto-scroll loop for mobile Teachers Carousel
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
  }, [teachers]);

  useEffect(() => {
    if (teachers.length <= 1) return;
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
  }, [teachers]);

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
    <section id="teachers" className="bg-cream-soft py-24">
      <div className="mx-auto w-[92%] max-w-7xl">
        <SectionHeading
          eyebrow={t("teachersSubtitle")}
          title={t("teachersTitle")}
          description={t("teachersDesc")}
        />
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
            {teachers.map((teacher) => (
              <div key={teacher.id} className="w-[85vw] shrink-0 snap-center">
                <TeacherCard teacher={teacher} t={t} />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop view: 3-column Grid */}
        <div className="mt-14 hidden sm:grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teachers.map((teacher, i) => (
            <Reveal key={teacher.id} delay={(i % 3) * 0.08}>
              <TeacherCard teacher={teacher} t={t} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
