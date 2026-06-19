import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import TiltCard from "../effects/TiltCard";
import { FeatureIcon } from "./featureIcon";
import type { SchoolSettings } from "../../types";
import type { UIKey } from "../../i18n";

export default function Features({
  settings,
  t,
}: {
  settings: SchoolSettings;
  t: (key: UIKey) => string;
}) {
  return (
    <section id="about" className="mx-auto w-[92%] max-w-7xl py-24">
      <SectionHeading eyebrow={t("whyUs")} title={t("featuresTitle")} description={t("featuresDesc")} />

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {settings.features?.map((feature, i) => (
          <Reveal key={feature.id} delay={i * 0.08}>
            <TiltCard className="h-full">
              <div className="glass hover-glow group flex h-full flex-col gap-4 rounded-2xl p-6">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-violet/20 text-neon-cyan transition group-hover:scale-110">
                  <FeatureIcon name={feature.icon} />
                </span>
                <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{feature.desc}</p>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>

      {settings.aboutText && (
        <Reveal className="mt-12">
          <div className="glass rounded-2xl p-8 text-center">
            <p className="mx-auto max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
              {settings.aboutText}
            </p>
          </div>
        </Reveal>
      )}
    </section>
  );
}
