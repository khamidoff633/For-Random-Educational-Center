import { useState } from "react";
import { Award, Eye, BadgeCheck } from "lucide-react";
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
