import { MapPin, Phone, ExternalLink } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import type { Branch } from "../../types";
import type { UIKey } from "../../i18n";

export default function Branches({ branches, t }: { branches: Branch[]; t: (key: UIKey) => string }) {
  if (!branches.length) return null;

  return (
    <section id="branches" className="bg-cream-soft py-24">
      <div className="mx-auto w-[92%] max-w-7xl">
        <SectionHeading eyebrow={t("branchesBadge")} title={t("branchesTitle")} description={t("branchesDesc")} />
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {branches.map((branch, i) => (
            <Reveal key={branch.id} delay={i * 0.08}>
              <div className="card-soft flex h-full flex-col gap-3 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-soft-lg">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-caramel/12 text-caramel-deep">
                  <MapPin size={20} />
                </span>
                <h3 className="font-display text-lg font-bold text-charcoal">{branch.name}</h3>
                <p className="text-sm text-charcoal-soft">{branch.address}</p>
                {branch.phone && (
                  <a href={`tel:${branch.phone}`} className="inline-flex items-center gap-2 text-sm font-semibold text-caramel-deep">
                    <Phone size={14} /> {branch.phone}
                  </a>
                )}
                {branch.mapsUrl && (
                  <a
                    href={branch.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-jade-deep transition hover:gap-2.5"
                  >
                    <ExternalLink size={13} /> Xaritada ko'rish
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
