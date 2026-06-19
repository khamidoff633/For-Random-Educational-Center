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
    <section className="mx-auto w-[92%] max-w-7xl py-24">
      <SectionHeading eyebrow={t("whyUs")} title={t("featuresTitle")} description={t("featuresDesc")} />

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {settings.features?.slice(0, 4).map((feature, i) => (
          <Reveal key={feature.id} delay={i * 0.08}>
            <TiltCard className="h-full" max={6}>
              <div className="card-soft group flex h-full flex-col gap-4 rounded-2xl p-6 transition duration-300 hover:-translate-y-1">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-caramel/12 text-caramel-deep transition group-hover:scale-110">
                  <FeatureIcon name={feature.icon} />
                </span>
                <h3 className="font-display text-lg font-bold text-charcoal">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-charcoal-soft">{feature.desc}</p>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
