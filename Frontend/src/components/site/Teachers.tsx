import { Phone, BadgeCheck } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import TiltCard from "../effects/TiltCard";
import type { Teacher } from "../../types";
import type { UIKey } from "../../i18n";

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop";

function TeacherCard({ teacher, t }: { teacher: Teacher; t: (key: UIKey) => string }) {
  return (
    <TiltCard className="h-full" max={6}>
      <div className="glass group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 transition hover:border-neon-violet/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.25)]">
        <div className="relative h-56 overflow-hidden">
          <img
            src={teacher.image || FALLBACK_AVATAR}
            alt={teacher.name}
            loading="lazy"
            onError={(e) => ((e.target as HTMLImageElement).src = FALLBACK_AVATAR)}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b1a] via-transparent to-transparent" />
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-neon-cyan/90 px-2.5 py-1 text-[10px] font-bold text-[#050510]">
            <BadgeCheck size={12} /> {teacher.experience} {t("experience")}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-lg font-bold text-white">{teacher.name}</h3>
          <p className="mt-0.5 text-xs font-semibold text-neon-violet">{teacher.specialty}</p>
          <p className="mt-3 line-clamp-4 flex-1 text-sm leading-relaxed text-slate-400">{teacher.bio}</p>
          {teacher.phone && (
            <a
              href={`tel:${teacher.phone}`}
              className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-300 transition hover:text-neon-cyan"
            >
              <Phone size={13} /> {teacher.phone}
            </a>
          )}
        </div>
      </div>
    </TiltCard>
  );
}

export default function Teachers({
  teachers,
  t,
}: {
  teachers: Teacher[];
  t: (key: UIKey) => string;
}) {
  return (
    <section id="teachers" className="relative py-24">
      <div className="mx-auto w-[92%] max-w-7xl">
        <SectionHeading
          eyebrow={t("teachersSubtitle")}
          title={t("teachersTitle")}
          description={t("teachersDesc")}
        />
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teachers.map((teacher, i) => (
            <Reveal key={teacher.id} delay={(i % 3) * 0.08}>
              <TeacherCard teacher={teacher} t={t} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
