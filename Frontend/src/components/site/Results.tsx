import { useState } from "react";
import { Award, Eye, Star } from "lucide-react";
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
              <div className="glass group relative h-full overflow-hidden rounded-2xl border border-white/10 transition hover:border-neon-cyan/50 hover:shadow-[0_0_28px_rgba(34,211,238,0.25)]">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={cover}
                    alt={result.studentName}
                    loading="lazy"
                    onError={(e) => ((e.target as HTMLImageElement).src = FALLBACK)}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b1a] to-transparent" />
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-neon-violet/90 px-3 py-1 text-[11px] font-bold text-white">
                    <Star size={11} /> {result.examType}
                  </span>
                  <span className="absolute bottom-3 right-3 rounded-lg bg-black/60 px-3 py-1 text-lg font-black text-neon-cyan neon-text">
                    {result.score}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold text-white">{result.studentName}</h3>
                  {result.courseName && (
                    <p className="mt-0.5 text-xs text-slate-400">{result.courseName}</p>
                  )}
                  {hasCertificate && (
                    <button
                      onClick={() => setSelected(result)}
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-neon-cyan transition hover:gap-2.5"
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

      <Modal open={!!selected} onClose={() => setSelected(null)} maxWidth="max-w-2xl">
        {selected && (
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-violet/20 text-neon-cyan">
                <Award size={22} />
              </span>
              <div>
                <h3 className="text-lg font-bold text-white">{selected.studentName}</h3>
                <p className="text-xs text-neon-cyan">
                  {selected.examType} · {selected.score}
                </p>
              </div>
            </div>
            {selected.certificateImage && (
              <img
                src={selected.certificateImage}
                alt="Sertifikat"
                className="w-full rounded-xl border border-white/10"
              />
            )}
            {selected.description && (
              <p className="mt-4 text-sm leading-relaxed text-slate-300">{selected.description}</p>
            )}
          </div>
        )}
      </Modal>
    </section>
  );
}
