import Reveal from "./Reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}

/** Consistent eyebrow + gradient title + description block for sections. */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  const alignment = align === "center" ? "items-center text-center mx-auto" : "items-start text-left";
  return (
    <Reveal className={`flex flex-col ${alignment} max-w-2xl gap-3`}>
      <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-neon-cyan">
        <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan animate-pulse" />
        {eyebrow}
      </span>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
        <span className="text-gradient">{title}</span>
      </h2>
      {description && <p className="text-sm sm:text-base text-slate-400 leading-relaxed">{description}</p>}
    </Reveal>
  );
}
