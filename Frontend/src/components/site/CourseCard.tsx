import { Clock, CalendarDays, Users, ArrowRight } from "lucide-react";
import TiltCard from "../effects/TiltCard";
import type { Course, Teacher } from "../../types";
import type { UIKey } from "../../i18n";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop";

export default function CourseCard({
  course,
  teacher,
  t,
  onEnroll,
}: {
  course: Course;
  teacher?: Teacher;
  t: (key: UIKey) => string;
  onEnroll: (courseId: string) => void;
}) {
  return (
    <TiltCard className="h-full" max={7}>
      <div className="glass group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 transition duration-300 hover:border-neon-cyan/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.25)]">
        <div className="relative h-44 overflow-hidden">
          <img
            src={course.image || FALLBACK_IMG}
            alt={course.name}
            loading="lazy"
            onError={(e) => ((e.target as HTMLImageElement).src = FALLBACK_IMG)}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b1a] to-transparent" />
          <span className="absolute left-3 top-3 rounded-full bg-neon-violet/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
            {course.category}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-lg font-bold text-white">{course.name}</h3>
          {teacher && <p className="mt-1 text-xs text-neon-cyan">{teacher.name}</p>}
          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-400">
            {course.description}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <Clock size={13} className="text-neon-cyan" /> {course.duration}
            </span>
            <span className="flex items-center gap-1.5">
              <Users size={13} className="text-neon-cyan" /> {course.capacity} {t("seats")}
            </span>
            <span className="col-span-2 flex items-center gap-1.5">
              <CalendarDays size={13} className="text-neon-cyan" /> {course.days} · {course.time}
            </span>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-slate-500">
                {t("price")}
              </span>
              <span className="text-sm font-bold text-white">{course.price}</span>
            </div>
            <button
              onClick={() => onEnroll(course.id)}
              className="btn-neon inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs"
            >
              {t("enroll")}
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </TiltCard>
  );
}
