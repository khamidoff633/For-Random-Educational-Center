import { useMemo, useState } from "react";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import CourseCard from "./CourseCard";
import type { Course, Teacher } from "../../types";
import type { UIKey } from "../../i18n";

export default function Courses({
  courses,
  teachers,
  t,
  onEnroll,
}: {
  courses: Course[];
  teachers: Teacher[];
  t: (key: UIKey) => string;
  onEnroll: (courseId: string) => void;
}) {
  const [active, setActive] = useState<string>("all");

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(courses.map((c) => c.category)))],
    [courses]
  );

  const filtered = active === "all" ? courses : courses.filter((c) => c.category === active);
  const teacherById = useMemo(
    () => new Map(teachers.map((teacher) => [teacher.id, teacher])),
    [teachers]
  );

  return (
    <section id="courses" className="mx-auto w-[92%] max-w-7xl py-24">
      <SectionHeading
        eyebrow={t("coursesSubtitle")}
        title={t("coursesTitle")}
        description={t("coursesDesc")}
      />

      <Reveal className="mt-10 flex flex-wrap justify-center gap-2.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              active === cat
                ? "btn-neon"
                : "glass text-slate-300 hover:text-neon-cyan"
            }`}
          >
            {cat === "all" ? t("allCategories") : cat}
          </button>
        ))}
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((course, i) => (
          <Reveal key={course.id} delay={(i % 3) * 0.08}>
            <CourseCard
              course={course}
              teacher={teacherById.get(course.teacherId)}
              t={t}
              onEnroll={onEnroll}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
