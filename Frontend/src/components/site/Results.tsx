import { useState, useRef } from "react";
import { Award, Eye, BadgeCheck, ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import Modal from "../ui/Modal";
import Avatar from "../ui/Avatar";
import { useLuxuryHover } from "../../hooks/useLuxuryHover";
import tornPaper from "../../assets/torn_paper.png";
import type { StudentResultItem } from "../../types";
import type { UIKey } from "../../i18n";

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
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  if (!results.length) return null;

  // Duplicate cards enough times so the strip is always wider than viewport
  // We use 4 copies so even with 1-2 cards there's always content visible
  const copies = Math.max(4, Math.ceil(16 / results.length));
  const allCards = Array.from({ length: copies }, (_, copyIdx) =>
    results.map((result, i) => (
      <DiplomaCard
        key={`copy${copyIdx}-${result.id}-${i}`}
        result={result}
        t={t}
        onOpen={setSelected}
      />
    ))
  ).flat();

  // Duration scales with number of cards so speed stays constant (~280px/s per card width)
  const cardWidthPx = 256 + 24; // w-64 + gap-6
  const singleSetWidth = results.length * cardWidthPx;
  // We animate exactly one copy's width (translateX(-1/copies * 100%))
  // Duration: singleSetWidth / 120px per second
  const durationSec = Math.max(8, singleSetWidth / 120);

  // CSS keyframe percent = 100 / copies  (translate exactly one set to the left)
  const endPercent = (100 / copies).toFixed(4);

  const animationStyle: React.CSSProperties = {
    display: "flex",
    gap: "24px",
    width: "max-content",
    willChange: "transform",
    animation: `results-scroll ${durationSec}s linear infinite`,
    animationPlayState: paused ? "paused" : "running",
  };

  const scroll = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -(cardWidthPx) : cardWidthPx, behavior: "smooth" });
  };

  return (
    <>
      {/* Inject keyframe dynamically so endPercent is always correct */}
      <style>{`
        @keyframes results-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-${endPercent}%); }
        }
      `}</style>

      <section id="results" className="py-24 overflow-hidden">
        <div className="mx-auto w-[92%] max-w-7xl">
          <SectionHeading eyebrow={t("resultsBadge")} title={t("resultsTitle")} description={t("resultsDesc")} />
        </div>

        {/* Marquee */}
        <div
          className="relative mt-14 group"
          onMouseMove={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
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

          {/* Animated track */}
          <div
            className="py-6 px-4 overflow-hidden"
            style={{ maskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)" }}
          >
            <div ref={trackRef} style={animationStyle}>
              {allCards}
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
    </>
  );
}
