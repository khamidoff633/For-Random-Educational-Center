import { Phone, BadgeCheck } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import Avatar from "../ui/Avatar";
import type { Teacher } from "../../types";
import type { UIKey } from "../../i18n";

function TeacherCard({ teacher, t }: { teacher: Teacher; t: (key: UIKey) => string }) {
  return (
    <div className="card-soft group flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-soft-lg">
      <div className="relative h-60 overflow-hidden">
        <Avatar
          name={teacher.name}
          src={teacher.image}
          className="h-60 w-full transition duration-500 group-hover:scale-105"
          fontClass="text-6xl"
        />
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-caramel-deep shadow-soft">
          <BadgeCheck size={12} /> {teacher.experience} {t("experience")}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold text-charcoal">{teacher.name}</h3>
        <p className="mt-0.5 text-xs font-semibold text-caramel-deep">{teacher.specialty}</p>
        <p className="mt-3 line-clamp-4 flex-1 text-sm leading-relaxed text-charcoal-soft">{teacher.bio}</p>
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
