import { useState, useRef, useEffect } from "react";
import { Award, Eye, BadgeCheck, ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import Modal from "../ui/Modal";
import Avatar from "../ui/Avatar";
import { useLuxuryHover } from "../../hooks/useLuxuryHover";
import tornPaper from "../../assets/torn_paper.png";
import type { StudentResultItem } from "../../types";
import type { UIKey } from "../../i18n";
import gsap from "gsap";

/** A premium certificate card using torn paper background with GSAP lift, glare sweep, and click feedback. */
function DiplomaCard({
  result,
  t,
  onOpen,
}: {
  result: StudentResultItem;
  t: (key: UIKey) => string;
  onOpen: (r: StudentResultItem) => void;
}) {
  const hasCertificate = Boolean(result.certificateImage);
  const cardRef = useLuxuryHover();

  return (
    <div
      ref={cardRef}
      onClick={() => hasCertificate && onOpen(result)}
      className={`group relative w-64 h-[23rem] shrink-0 transition-all duration-300 ${
        hasCertificate ? "cursor-pointer" : ""
      }`}
      style={{
        transformStyle: "preserve-3d",
        backgroundImage: `url(${tornPaper})`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Glare reflection sweep overlay */}
      <div
        className="card-glare absolute inset-0 rounded-2xl pointer-events-none z-20 opacity-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/40 mix-blend-overlay overflow-hidden"
      />

      {/* Card Content - aligned inside the gold border of the torn paper */}
      <div className="flex flex-col h-full px-6 py-7 text-center">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-full bg-caramel/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-caramel-deep">
            <Award size={10} /> {result.examType}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-jade/10 px-2 py-0.5 text-[9px] font-semibold text-jade-deep">
            <BadgeCheck size={10} /> Tasdiqlangan
          </span>
        </div>

        {/* Student photo */}
        <div className="mx-auto mt-6 h-20 w-20 overflow-hidden rounded-full border border-caramel/20 shadow-sm">
          <Avatar
            name={result.studentName}
            src={result.image}
            fontClass="text-xl"
            className="h-full w-full rounded-full transition duration-500 group-hover:scale-105"
          />
        </div>

        {/* Name + course */}
        <h3 className="font-display mt-4 text-sm font-bold text-charcoal line-clamp-1">{result.studentName}</h3>
        {result.courseName ? (
          <p className="mt-0.5 text-[10px] font-medium text-charcoal-soft/80 line-clamp-1">{result.courseName}</p>
        ) : (
          <div className="h-3" />
        )}

        {/* Score with luxury gold gradient */}
        <div className="mt-auto mb-2 text-center">
          <span className="font-display bg-gradient-to-r from-caramel-deep to-caramel bg-clip-text text-transparent text-3xl font-black tracking-tight">
            {result.score}
          </span>
        </div>

        {/* View certificate link */}
        {hasCertificate ? (
          <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-caramel-deep opacity-0 transition duration-300 group-hover:opacity-100">
            <Eye size={12} /> {t("viewCertificate")}
          </div>
        ) : (
          <div className="h-[15px]" />
        )}
      </div>
    </div>
  );
}

export default function Results({
  results,
  t,
}: {
  results: StudentResultItem[];
  t: (key: UIKey) => string;
}) {
  const [selected, setSelected] = useState<StudentResultItem | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollTweenRef = useRef<gsap.core.Tween | null>(null);
  const pauseTimeoutRef = useRef<number | null>(null);

  if (!results.length) return null;

  // Duplicate cards exactly 3 times for seamless wrapping
  const duplicatedCards = [
    ...results.map((result, i) => (
      <DiplomaCard key={`set1-${result.id}-${i}`} result={result} t={t} onOpen={setSelected} />
    )),
    ...results.map((result, i) => (
      <DiplomaCard key={`set2-${result.id}-${i}`} result={result} t={t} onOpen={setSelected} />
    )),
    ...results.map((result, i) => (
      <DiplomaCard key={`set3-${result.id}-${i}`} result={result} t={t} onOpen={setSelected} />
    )),
  ];

  const cardWidthPx = 256 + 24; // w-64 + gap-6
  const singleSetWidth = results.length * cardWidthPx;

  // Setup GSAP AutoScroll
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    // Start in the middle set
    el.scrollLeft = singleSetWidth;

    const runMarquee = () => {
      const currentScroll = el.scrollLeft;
      const targetScroll = singleSetWidth * 2;
      const remainingDistance = targetScroll - currentScroll;
      const speed = 55; // pixels per second
      const duration = remainingDistance / speed;

      autoScrollTweenRef.current = gsap.to(el, {
        scrollLeft: targetScroll,
        duration: duration,
        ease: "none",
        onComplete: () => {
          el.scrollLeft = singleSetWidth;
          runMarquee();
        },
      });
    };

    if (!isPaused) {
      runMarquee();
    }

    return () => {
      autoScrollTweenRef.current?.kill();
    };
  }, [results, isPaused, singleSetWidth]);

  // Handle scroll wrapping for manual drags/swipes
  const handleScrollWrap = () => {
    const el = scrollContainerRef.current;
    if (!el) return;

    if (el.scrollLeft >= singleSetWidth * 2) {
      el.scrollLeft = singleSetWidth;
    } else if (el.scrollLeft <= 50) {
      el.scrollLeft = singleSetWidth + el.scrollLeft;
    }
  };

  // Button manual scroll chevrons
  const scroll = (dir: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;

    // Pause auto-scroll
    setIsPaused(true);
    if (autoScrollTweenRef.current) {
      autoScrollTweenRef.current.kill();
    }

    // Clear any pending resume timeout
    if (pauseTimeoutRef.current) {
      window.clearTimeout(pauseTimeoutRef.current);
    }

    const targetX = el.scrollLeft + (dir === "left" ? -cardWidthPx : cardWidthPx);

    // Smoothly step scrollLeft using GSAP
    gsap.to(el, {
      scrollLeft: targetX,
      duration: 0.5,
      ease: "power2.out",
      onComplete: () => {
        handleScrollWrap();
        // Resume auto-scroll after 2.5 seconds of button inactivity
        pauseTimeoutRef.current = window.setTimeout(() => {
          setIsPaused(false);
        }, 2500);
      },
    });
  };

  return (
    <section id="results" className="py-24 overflow-hidden">
      <div className="mx-auto w-[92%] max-w-7xl">
        <SectionHeading eyebrow={t("resultsBadge")} title={t("resultsTitle")} description={t("resultsDesc")} />
      </div>

      {/* Marquee Wrapper */}
      <div
        className="relative mt-14 group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Navigation buttons */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 hidden md:flex h-11 w-11 items-center justify-center rounded-full border border-caramel/20 bg-white/85 text-caramel-deep shadow-md backdrop-blur-sm transition duration-300 hover:bg-caramel hover:text-white hover:shadow-lg focus:outline-none opacity-0 group-hover:opacity-100 sm:left-6"
          aria-label="Oldingi"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 hidden md:flex h-11 w-11 items-center justify-center rounded-full border border-caramel/20 bg-white/85 text-caramel-deep shadow-md backdrop-blur-sm transition duration-300 hover:bg-caramel hover:text-white hover:shadow-lg focus:outline-none opacity-0 group-hover:opacity-100 sm:right-6"
          aria-label="Keyingi"
        >
          <ChevronRight size={20} />
        </button>

        {/* Scroll Container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScrollWrap}
          className="flex overflow-x-auto scroll-smooth py-6 px-4 [&::-webkit-scrollbar]:hidden select-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="flex shrink-0 gap-6">
            {duplicatedCards}
          </div>
        </div>

        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-cream to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-cream to-transparent z-10" />
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} maxWidth="max-w-2xl" tone="light">
        {selected && (
          <div>
            <div className="mb-4 flex items-center gap-3 pr-10">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-caramel/15 text-caramel-deep">
                <Award size={22} />
              </span>
              <div>
                <h3 className="font-display text-lg font-bold text-charcoal">{selected.studentName}</h3>
                <p className="text-xs font-semibold text-caramel-deep">
                  {selected.examType} · {selected.score}
                </p>
              </div>
              <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-jade/12 px-3 py-1 text-[11px] font-semibold text-jade-deep">
                <BadgeCheck size={13} /> Tasdiqlangan
              </span>
            </div>
            {selected.certificateImage && (
              <img src={selected.certificateImage} alt="Sertifikat" className="cert-frame mt-2 w-full" />
            )}
            {selected.description && (
              <p className="mt-4 text-sm leading-relaxed text-charcoal-soft">{selected.description}</p>
            )}
          </div>
        )}
      </Modal>
    </section>
  );
}
