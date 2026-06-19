import type { ReactNode } from "react";

/**
 * Infinite horizontal ticker. The content is duplicated so the CSS marquee
 * animation (translateX -50%) loops seamlessly. Pauses on hover.
 */
export default function Marquee({ items }: { items: ReactNode[] }) {
  const row = (
    <div className="flex shrink-0 items-center gap-12 px-6">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-3 text-sm font-semibold text-charcoal-soft">
          {item}
        </span>
      ))}
    </div>
  );

  return (
    <div className="marquee-paused relative overflow-hidden border-y border-black/5 bg-cream-soft py-4">
      <div className="flex w-max animate-marquee">
        {row}
        {row}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-cream-soft to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-cream-soft to-transparent" />
    </div>
  );
}
