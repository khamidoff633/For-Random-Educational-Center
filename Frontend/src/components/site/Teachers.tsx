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
    <TiltCard className="h-full" max={5}>
      <div className="card-soft group flex h-full flex-col overflow-hidden rounded-2xl transition duration-300 hover:-translate-y-1">
        <div className="relative h-60 overflow-hidden">
          <img
            src={teacher.image || FALLBACK_AVATAR}
            alt={teacher.name}
            loading="lazy"
            onError={(e) => ((e.target as HTMLImageElement).src = FALLBACK_AVATAR)}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-caramel-deep shadow-soft">
            <BadgeCheck size={12} /> {teacher.experience} {t("experience")}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-lg font-bold text-charcoal">{teacher.name}</h3>
          <p className="mt-0.5 text-xs font-semibold text-caramel-deep">{teacher.specialty}</p>
          <p className="mt-3 line-clamp-4 flex-1 text-sm leading-relaxed text-charcoal-soft">
            {teacher.bio}
          </p>
          {teacher.phone && (
            <a
              href={`tel:${teacher.phone}`}
              className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-charcoal-soft transition hover:text-caramel-deep"
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
    <section id="teachers" className="bg-cream-soft py-24">
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
