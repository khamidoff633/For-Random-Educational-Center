import { Clock, CalendarDays, Users, ArrowRight } from "lucide-react";
import type { Course, Teacher } from "../../types";
import type { UIKey } from "../../i18n";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop";

export default function CourseCard({
  course,
  teacher,
  t,
  onEnroll,
  onDetails,
}: {
  course: Course;
  teacher?: Teacher;
  t: (key: UIKey) => string;
  onEnroll: (courseId: string) => void;
  onDetails?: (course: Course) => void;
}) {
  return (
    <div className="card-soft group flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-soft-lg">
      <div className="relative h-44 cursor-pointer overflow-hidden" onClick={() => onDetails?.(course)}>
        <img
          src={course.image || FALLBACK_IMG}
          alt={course.name}
          loading="lazy"
          onError={(e) => ((e.target as HTMLImageElement).src = FALLBACK_IMG)}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-caramel-deep shadow-soft">
          {course.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold text-charcoal">{course.name}</h3>
        {teacher && <p className="mt-1 text-xs font-semibold text-caramel-deep">{teacher.name}</p>}
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-charcoal-soft">
          {course.description}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-charcoal-soft">
          <span className="flex items-center gap-1.5">
            <Clock size={13} className="text-caramel" /> {course.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={13} className="text-caramel" /> {course.capacity} {t("seats")}
          </span>
          <span className="col-span-2 flex items-center gap-1.5">
            <CalendarDays size={13} className="text-caramel" /> {course.days} · {course.time}
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-4">
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-charcoal-soft">
              {t("price")}
            </span>
            <span className="font-display text-sm font-bold text-charcoal">{course.price}</span>
          </div>
          <button
            onClick={() => onEnroll(course.id)}
            className="btn-primary inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs"
          >
            {t("enroll")}
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
