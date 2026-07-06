import { useMemo, useState, useRef, useEffect } from "react";
import { Clock, CalendarDays, Users, BadgeDollarSign, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import Modal from "../ui/Modal";
import Avatar from "../ui/Avatar";
import CourseCard from "./CourseCard";
import type { Course, Teacher } from "../../types";
import type { UIKey } from "../../i18n";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=900&auto=format&fit=crop";

export default function Courses({
  courses,
  teachers,
  t,
  onEnroll,
}: {
  courses: Course[];
  teachers: Teacher[];
  t: (key: UIKey) => string;
  onEnroll: (courseId: string) => void;
}) {
  const [active, setActive] = useState<string>("all");
  const [detail, setDetail] = useState<Course | null>(null);

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(courses.map((c) => c.category)))],
    [courses]
  );

  const filtered = active === "all" ? courses : courses.filter((c) => c.category === active);
  const teacherById = useMemo(
    () => new Map(teachers.map((teacher) => [teacher.id, teacher])),
    [teachers]
  );

  const detailTeacher = detail ? teacherById.get(detail.teacherId) : undefined;

  // Auto-scroll loop for mobile Courses Carousel
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
  }, [filtered]);

  useEffect(() => {
    if (filtered.length <= 1) return;
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
    }, 3000); // 3.0s reading speed

    return () => clearInterval(timer);
  }, [filtered]);

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
    <section id="courses" className="mx-auto w-[92%] max-w-7xl py-24">
      <SectionHeading
        eyebrow={t("coursesSubtitle")}
        title={t("coursesTitle")}
        description={t("coursesDesc")}
      />

      <Reveal className="mt-10 flex flex-wrap justify-center gap-2.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              active === cat
                ? "btn-primary"
                : "border border-black/10 bg-white text-charcoal-soft hover:text-caramel-deep"
            }`}
          >
            {cat === "all" ? t("allCategories") : cat}
          </button>
        ))}
      </Reveal>

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
          {filtered.map((course) => (
            <div key={course.id} className="w-[85vw] shrink-0 snap-center">
              <CourseCard
                course={course}
                teacher={teacherById.get(course.teacherId)}
                t={t}
                onEnroll={onEnroll}
                onDetails={setDetail}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop view: 3-column Grid */}
      <div className="mt-12 hidden sm:grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((course, i) => (
          <Reveal key={course.id} delay={(i % 3) * 0.08}>
            <CourseCard
              course={course}
              teacher={teacherById.get(course.teacherId)}
              t={t}
              onEnroll={onEnroll}
              onDetails={setDetail}
            />
          </Reveal>
        ))}
      </div>

      {/* Course detail modal */}
      <Modal open={!!detail} onClose={() => setDetail(null)} maxWidth="max-w-2xl" tone="light">
        {detail && (
          <div>
            <div className="relative -mx-6 -mt-6 mb-5 h-52 overflow-hidden rounded-t-2xl">
              <img
                src={detail.image || FALLBACK_IMG}
                alt={detail.name}
                onError={(e) => ((e.target as HTMLImageElement).src = FALLBACK_IMG)}
                className="h-full w-full object-cover"
              />
              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-caramel-deep shadow-soft">
                {detail.category}
              </span>
            </div>

            <h3 className="font-display text-2xl font-bold text-charcoal">{detail.name}</h3>

            {detailTeacher && (
              <div className="mt-3 flex items-center gap-2.5">
                <Avatar
                  name={detailTeacher.name}
                  src={detailTeacher.image}
                  fontClass="text-sm"
                  className="h-9 w-9 rounded-full"
                />
                <div>
                  <p className="text-sm font-bold text-charcoal">{detailTeacher.name}</p>
                  <p className="text-xs text-caramel-deep">{detailTeacher.specialty}</p>
                </div>
              </div>
            )}

            <p className="mt-4 text-sm leading-relaxed text-charcoal-soft">{detail.description}</p>

            <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-charcoal-soft">
              <span className="flex items-center gap-2 rounded-xl bg-cream-soft px-3 py-2.5">
                <Clock size={15} className="text-caramel" /> {detail.duration}
              </span>
              <span className="flex items-center gap-2 rounded-xl bg-cream-soft px-3 py-2.5">
                <Users size={15} className="text-caramel" /> {detail.capacity} {t("seats")}
              </span>
              <span className="flex items-center gap-2 rounded-xl bg-cream-soft px-3 py-2.5">
                <CalendarDays size={15} className="text-caramel" /> {detail.days} · {detail.time}
              </span>
              <span className="flex items-center gap-2 rounded-xl bg-cream-soft px-3 py-2.5">
                <BadgeDollarSign size={15} className="text-caramel" /> {detail.price}
              </span>
            </div>

            <button
              onClick={() => {
                const id = detail.id;
                setDetail(null);
                onEnroll(id);
              }}
              className="btn-primary mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm"
            >
              {t("enroll")} <ArrowRight size={16} />
            </button>
          </div>
        )}
      </Modal>
    </section>
  );
}
