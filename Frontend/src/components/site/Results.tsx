import { useState } from "react";
import { Award, Eye, Star, BadgeCheck } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import Modal from "../ui/Modal";
import type { StudentResultItem } from "../../types";
import type { UIKey } from "../../i18n";

const FALLBACK =
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop";

export default function Results({
  results,
  t,
}: {
  results: StudentResultItem[];
  t: (key: UIKey) => string;
}) {
  const [selected, setSelected] = useState<StudentResultItem | null>(null);

  if (!results.length) return null;

  return (
    <section id="results" className="mx-auto w-[92%] max-w-7xl py-24">
      <SectionHeading eyebrow={t("resultsBadge")} title={t("resultsTitle")} description={t("resultsDesc")} />

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {results.map((result, i) => {
          const cover = result.image || result.certificateImage || FALLBACK;
          const hasCertificate = Boolean(result.certificateImage);
          return (
            <Reveal key={result.id} delay={(i % 4) * 0.07}>
              <div className="card-soft group relative h-full overflow-hidden rounded-2xl transition duration-300 hover:-translate-y-1">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={cover}
                    alt={result.studentName}
                    loading="lazy"
                    onError={(e) => ((e.target as HTMLImageElement).src = FALLBACK)}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-caramel-deep shadow-soft">
                    <Star size={11} /> {result.examType}
                  </span>
                  <span className="absolute bottom-3 right-3 rounded-lg bg-espresso/85 px-3 py-1 font-display text-lg font-extrabold text-white">
                    {result.score}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-display text-sm font-bold text-charcoal">{result.studentName}</h3>
                  {result.courseName && (
                    <p className="mt-0.5 text-xs text-charcoal-soft">{result.courseName}</p>
                  )}
                  {hasCertificate && (
                    <button
                      onClick={() => setSelected(result)}
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-caramel-deep transition hover:gap-2.5"
                    >
                      <Eye size={13} /> {t("viewCertificate")}
                    </button>
                  )}
                </div>
              </div>
            </Reveal>
          );
        })}
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
              <img
                src={selected.certificateImage}
                alt="Sertifikat"
                className="cert-frame mt-2 w-full"
              />
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
