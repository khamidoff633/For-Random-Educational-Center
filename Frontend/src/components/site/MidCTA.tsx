import { ArrowRight } from "lucide-react";
import Reveal from "../ui/Reveal";
import type { UIKey } from "../../i18n";

export default function MidCTA({ t, onEnroll }: { t: (key: UIKey) => string; onEnroll: () => void }) {
  return (
    <section className="mx-auto w-[92%] max-w-7xl py-12">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-espresso px-6 py-12 text-center shadow-soft-lg sm:px-12 sm:py-16">
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(30rem 14rem at 50% 0%, rgba(200,118,26,0.5), transparent 70%)",
            }}
          />
          <div className="relative">
            <h2 className="font-display mx-auto max-w-2xl text-3xl font-extrabold leading-tight text-cream sm:text-4xl">
              {t("ctaTitle")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-cream/70">{t("ctaSubtitle")}</p>
            <button
              onClick={onEnroll}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-caramel px-8 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:brightness-105"
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
