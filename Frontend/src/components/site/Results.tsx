import { useState } from "react";
import { Award, Eye, BadgeCheck } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import Modal from "../ui/Modal";
import type { StudentResultItem } from "../../types";
import type { UIKey } from "../../i18n";

const FALLBACK =
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop";

/** A single diploma-style result card. */
function DiplomaCard({
  result,
  t,
  onOpen,
}: {
  result: StudentResultItem;
  t: (key: UIKey) => string;
  onOpen: (r: StudentResultItem) => void;
}) {
  const cover = result.image || result.certificateImage || FALLBACK;
  const hasCertificate = Boolean(result.certificateImage);
  return (
    <div
      onClick={() => hasCertificate && onOpen(result)}
      className={`cert-frame group w-72 shrink-0 overflow-hidden rounded-[14px] bg-white ${
        hasCertificate ? "cursor-pointer" : ""
      }`}
    >
      <div className="relative">
        <img
          src={cover}
          alt={result.studentName}
          loading="lazy"
          onError={(e) => ((e.target as HTMLImageElement).src = FALLBACK)}
          className="h-40 w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-caramel-deep shadow-soft">
          {result.examType}
        </span>
        {/* Gold wax-seal style score medallion */}
        <span className="absolute -bottom-6 right-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-caramel to-caramel-deep text-white shadow-soft ring-4 ring-white">
          <span className="font-display text-sm font-extrabold leading-none">{result.score}</span>
        </span>
      </div>

      <div className="px-5 pb-5 pt-8">
        <h3 className="font-display font-bold text-charcoal">{result.studentName}</h3>
        {result.courseName && <p className="mt-0.5 text-xs text-charcoal-soft">{result.courseName}</p>}
        <div className="mt-3 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-jade/12 px-2.5 py-1 text-[10px] font-semibold text-jade-deep">
            <BadgeCheck size={11} /> Tasdiqlangan
          </span>
          {hasCertificate && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-caramel-deep">
              <Eye size={12} /> {t("viewCertificate")}
            </span>
          )}
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

  if (!results.length) return null;

  const cards = results.map((result, i) => (
    <DiplomaCard key={`${result.id}-${i}`} result={result} t={t} onOpen={setSelected} />
  ));

  return (
    <section id="results" className="py-24">
      <div className="mx-auto w-[92%] max-w-7xl">
        <SectionHeading eyebrow={t("resultsBadge")} title={t("resultsTitle")} description={t("resultsDesc")} />
      </div>

      {/* Auto-scrolling diploma marquee (pauses on hover) */}
      <div className="marquee-paused relative mt-14 overflow-hidden py-6">
        <div className="flex w-max animate-marquee">
          <div className="flex shrink-0 gap-6 px-3">{cards}</div>
          <div className="flex shrink-0 gap-6 px-3" aria-hidden>
            {cards}
          </div>
        </div>
        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-cream to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-cream to-transparent" />
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
