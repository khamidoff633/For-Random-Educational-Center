import { useState, useRef, useEffect } from "react";
import { Award, Eye, BadgeCheck, ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import Modal from "../ui/Modal";
import Avatar from "../ui/Avatar";
import type { StudentResultItem } from "../../types";
import type { UIKey } from "../../i18n";

/** A framed certificate card — espresso frame + gold inner line, portrait. */
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
  return (
    <div
      onClick={() => hasCertificate && onOpen(result)}
      className={`group w-64 shrink-0 transition-transform duration-300 hover:-translate-y-1.5 ${
        hasCertificate ? "cursor-pointer" : ""
      }`}
    >
      {/* Espresso ornate frame */}
      <div className="rounded-xl bg-espresso p-2.5 shadow-soft-lg">
        {/* Gold inner line + cream "paper" */}
        <div className="flex h-[23rem] flex-col items-center rounded-lg border-2 border-caramel/45 bg-gradient-to-b from-white to-cream px-5 py-6 text-center">
          {/* Header */}
          <div className="flex items-center gap-2 text-caramel-deep">
            <Award size={15} />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em]">{result.examType}</span>
          </div>
          <div className="mt-2 h-px w-16 bg-caramel/40" />

          {/* Student photo (or initials) in a gold frame */}
          <div className="mt-5 h-24 w-24 overflow-hidden rounded-full border-2 border-caramel/50 ring-4 ring-white">
            <Avatar
              name={result.studentName}
              src={result.image}
              fontClass="text-2xl"
              className="h-full w-full rounded-full transition duration-500 group-hover:scale-105"
            />
          </div>

          {/* Name + score */}
          <h3 className="font-display mt-4 text-base font-bold text-charcoal">{result.studentName}</h3>
          <p className="font-display mt-1 text-4xl font-extrabold text-caramel-deep">{result.score}</p>
          {result.courseName && (
            <p className="mt-1 line-clamp-2 text-[11px] text-charcoal-soft">{result.courseName}</p>
          )}

          {/* Seal */}
          <div className="mt-auto flex flex-col items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-jade/12 px-2.5 py-1 text-[10px] font-semibold text-jade-deep">
              <BadgeCheck size={11} /> Tasdiqlangan
            </span>
            {hasCertificate && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-caramel-deep opacity-0 transition group-hover:opacity-100">
                <Eye size={12} /> {t("viewCertificate")}
              </span>
            )}
          </div>
        </div>
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
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isPausedRef = useRef(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !results.length) return;

    // Set initial scroll to the middle set of cards
    const setWidth = el.scrollWidth / 3;
    el.scrollLeft = setWidth;

    let frameId: number;
    const speed = 0.65; // speed of auto scroll

    const step = () => {
      if (!isPausedRef.current) {
        el.scrollLeft += speed;
        // Wrap around right
        const setW = el.scrollWidth / 3;
        if (el.scrollLeft >= setW * 2) {
          el.scrollLeft -= setW;
        }
      }
      frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [results]);

  if (!results.length) return null;

  const duplicatedCards = [
    ...results.map((result, i) => (
      <DiplomaCard key={`${result.id}-set1-${i}`} result={result} t={t} onOpen={setSelected} />
    )),
    ...results.map((result, i) => (
      <DiplomaCard key={`${result.id}-set2-${i}`} result={result} t={t} onOpen={setSelected} />
    )),
    ...results.map((result, i) => (
      <DiplomaCard key={`${result.id}-set3-${i}`} result={result} t={t} onOpen={setSelected} />
    )),
  ];

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const setWidth = el.scrollWidth / 3;
    if (el.scrollLeft >= setWidth * 2) {
      el.scrollLeft -= setWidth;
    } else if (el.scrollLeft <= setWidth - 100) {
      el.scrollLeft += setWidth;
    }
  };

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    // Avtomatik aylanishni vaqtincha to'xtatamiz
    isPausedRef.current = true;
    const cardWidth = 256 + 24; // w-64 is 256px, gap-6 is 24px
    el.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
    // 700ms dan keyin avtomatik aylanish davom etadi
    setTimeout(() => {
      isPausedRef.current = false;
    }, 700);
  };

  return (
    <section id="results" className="py-24">
      <div className="mx-auto w-[92%] max-w-7xl">
        <SectionHeading eyebrow={t("resultsBadge")} title={t("resultsTitle")} description={t("resultsDesc")} />
      </div>

      {/* Auto-scrolling diploma marquee with manual navigation */}
      <div className="relative mt-14 group">
        {/* Navigation Buttons */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 hidden md:flex h-11 w-11 items-center justify-center rounded-full border border-caramel/20 bg-white/85 text-caramel-deep shadow-md backdrop-blur-sm transition duration-300 hover:bg-caramel hover:text-white hover:shadow-lg focus:outline-none opacity-100 md:opacity-0 md:group-hover:opacity-100 sm:left-6"
          aria-label="Oldingi"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 hidden md:flex h-11 w-11 items-center justify-center rounded-full border border-caramel/20 bg-white/85 text-caramel-deep shadow-md backdrop-blur-sm transition duration-300 hover:bg-caramel hover:text-white hover:shadow-lg focus:outline-none opacity-100 md:opacity-0 md:group-hover:opacity-100 sm:right-6"
          aria-label="Keyingi"
        >
          <ChevronRight size={20} />
        </button>

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onMouseEnter={() => { isPausedRef.current = true; }}
          onMouseLeave={() => { isPausedRef.current = false; }}
          onTouchStart={() => { isPausedRef.current = true; }}
          onTouchEnd={() => { isPausedRef.current = false; }}
          className="flex overflow-x-auto scroll-smooth py-6 px-4 [&::-webkit-scrollbar]:hidden"
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
            <div className="mb-4 flex items-center gap-3">
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
