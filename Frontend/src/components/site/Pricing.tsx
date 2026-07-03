import { Check, Star } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import type { PricingPlan } from "../../types";
import type { UIKey } from "../../i18n";

export default function Pricing({
  plans,
  t,
  onEnroll,
}: {
  plans: PricingPlan[];
  t: (key: UIKey) => string;
  onEnroll: () => void;
}) {
  if (!plans.length) return null;

  return (
    <section id="pricing" className="mx-auto w-[92%] max-w-7xl py-24">
      <SectionHeading eyebrow={t("pricingBadge")} title={t("pricingTitle")} description={t("pricingDesc")} />

      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
        {plans.map((plan, i) => (
          <Reveal key={plan.id} delay={i * 0.08}>
            <div
              className={`relative flex h-full flex-col rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1.5 ${
                plan.highlighted
                  ? "bg-espresso text-cream shadow-soft-lg ring-2 ring-caramel"
                  : "card-soft"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-caramel px-3 py-1 text-[11px] font-bold text-white">
                  <Star size={11} /> {t("pricingPopular")}
                </span>
              )}
              <h3 className={`font-display text-lg font-bold ${plan.highlighted ? "text-cream" : "text-charcoal"}`}>
                {plan.name}
              </h3>
              <div className="mt-3 flex items-end gap-1">
                <span className={`font-display text-4xl font-extrabold ${plan.highlighted ? "text-white" : "text-charcoal"}`}>
                  {plan.price}
                </span>
                <span className={`mb-1 text-sm ${plan.highlighted ? "text-cream/70" : "text-charcoal-soft"}`}>
                  so'm / {plan.period}
                </span>
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f, idx) => (
                  <li key={idx} className={`flex items-center gap-2.5 text-sm ${plan.highlighted ? "text-cream/90" : "text-charcoal-soft"}`}>
                    <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${plan.highlighted ? "bg-caramel/30 text-caramel" : "bg-jade/12 text-jade-deep"}`}>
                      <Check size={12} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={onEnroll}
                className={`mt-7 rounded-full py-3 text-sm font-bold transition ${
                  plan.highlighted
                    ? "bg-caramel text-white hover:brightness-105"
                    : "btn-outline"
                }`}
              >
                {t("pricingChoose")}
              </button>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
