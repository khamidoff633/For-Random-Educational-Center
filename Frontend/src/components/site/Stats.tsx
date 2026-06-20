import type React from "react";
import { Users, CalendarClock, Trophy, GraduationCap } from "lucide-react";
import { useCountUp } from "../../hooks/useCountUp";
import Reveal from "../ui/Reveal";
import type { UIKey } from "../../i18n";

interface StatItemProps {
  value: number;
  suffix?: string;
  label: string;
  icon: React.ReactNode;
  tone?: "caramel" | "jade" | "navy";
}

function StatItem({ value, suffix = "", label, icon, tone = "caramel" }: StatItemProps) {
  const { value: animated, ref } = useCountUp(value);
  const toneCls =
    tone === "jade"
      ? "bg-jade/12 text-jade-deep"
      : tone === "navy"
        ? "bg-navy/12 text-navy"
        : "bg-caramel/12 text-caramel-deep";
  return (
    <div className="card-soft flex flex-col items-center gap-2 rounded-2xl p-6 text-center">
      <span className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${toneCls}`}>
        {icon}
      </span>
      <span ref={ref} className="font-display text-3xl font-extrabold text-charcoal sm:text-4xl">
        {animated.toLocaleString()}
        {suffix}
      </span>
      <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-soft">{label}</span>
    </div>
  );
}

export default function Stats({
  teacherCount,
  t,
}: {
  teacherCount: number;
  t: (key: UIKey) => string;
}) {
  return (
    <section className="mx-auto -mt-4 w-[92%] max-w-6xl">
      <Reveal>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatItem value={5000} suffix="+" label={t("statStudents")} icon={<Users size={24} />} />
          <StatItem value={15} suffix="+" label={t("statYears")} icon={<CalendarClock size={24} />} tone="navy" />
          <StatItem value={98} suffix="%" label={t("statSuccess")} icon={<Trophy size={24} />} tone="jade" />
          <StatItem
            value={Math.max(teacherCount, 12)}
            suffix="+"
            label={t("statTeachers")}
            icon={<GraduationCap size={24} />}
          />
        </div>
      </Reveal>
    </section>
  );
}
