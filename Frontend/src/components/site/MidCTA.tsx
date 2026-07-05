import { ArrowRight } from "lucide-react";
import Reveal from "../ui/Reveal";
import type { UIKey } from "../../i18n";

export default function MidCTA({ t, onEnroll }: { t: (key: UIKey) => string; onEnroll: () => void }) {
  return (
    <section className="mx-auto w-[92%] max-w-7xl py-12">
      <Reveal>
        <div 
          className="relative overflow-hidden rounded-3xl px-6 py-12 text-center shadow-soft-lg sm:px-12 sm:py-16 border border-caramel/10"
          style={{
            background: "linear-gradient(to bottom, rgba(200, 118, 26, 0.15) 0%, rgba(200, 118, 26, 0.08) 50%, rgba(200, 118, 26, 0.02) 80%, transparent 100%)",
          }}
        >
          <div className="relative">
            <h2 className="font-display mx-auto max-w-2xl text-3xl font-extrabold leading-tight text-charcoal sm:text-4xl">
              {t("ctaTitle")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-charcoal-soft">{t("ctaSubtitle")}</p>
            <button
              onClick={onEnroll}
              className="btn-primary mt-8 inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm"
            >
              {t("ctaButton")}
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
