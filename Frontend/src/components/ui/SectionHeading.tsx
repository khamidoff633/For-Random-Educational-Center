import Reveal from "./Reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}

/** Eyebrow + bold display title + description block (warm premium light). */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  const alignment =
    align === "center" ? "items-center text-center mx-auto" : "items-start text-left";
  return (
    <Reveal className={`flex flex-col ${alignment} max-w-2xl gap-4`}>
      <span className="inline-flex items-center gap-2 rounded-full border border-caramel/20 bg-caramel/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-caramel-deep">
        <span className="h-1.5 w-1.5 rounded-full bg-caramel" />
        {eyebrow}
      </span>
      <h2 className="font-display text-3xl font-extrabold leading-[1.1] text-charcoal sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="text-base leading-relaxed text-charcoal-soft">{description}</p>
      )}
    </Reveal>
  );
}
