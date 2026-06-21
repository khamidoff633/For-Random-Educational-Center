import type { UIKey } from "../../i18n";

/**
 * A subtle trust strip of partner / certification logos.
 * Logos render muted (grayscale + low opacity) and brighten on hover so they
 * never fight the warm palette.
 */
export default function PartnersStrip({ logos, t }: { logos: string[]; t: (key: UIKey) => string }) {
  if (!logos.length) return null;

  return (
    <section className="border-y border-black/5 bg-cream-soft/60 py-12">
      <div className="mx-auto w-[92%] max-w-7xl">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-charcoal-soft">
          {t("partnersTitle")}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {logos.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              loading="lazy"
              className="h-10 w-auto max-w-[140px] object-contain opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 sm:h-12"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
