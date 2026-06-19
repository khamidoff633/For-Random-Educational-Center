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
}

function StatItem({ value, suffix = "", label, icon }: StatItemProps) {
  const { value: animated, ref } = useCountUp(value);
  return (
    <div className="glass hover-glow flex flex-col items-center gap-2 rounded-2xl p-6 text-center">
      <span className="text-neon-cyan">{icon}</span>
      <span ref={ref} className="text-3xl font-black text-white sm:text-4xl">
        {animated.toLocaleString()}
        {suffix}
      </span>
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</span>
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
    <section className="mx-auto -mt-12 w-[92%] max-w-6xl">
      <Reveal>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatItem value={5000} suffix="+" label={t("statStudents")} icon={<Users size={26} />} />
          <StatItem value={15} suffix="+" label={t("statYears")} icon={<CalendarClock size={26} />} />
          <StatItem value={98} suffix="%" label={t("statSuccess")} icon={<Trophy size={26} />} />
          <StatItem
            value={Math.max(teacherCount, 12)}
            suffix="+"
            label={t("statTeachers")}
            icon={<GraduationCap size={26} />}
          />
        </div>
      </Reveal>
    </section>
  );
}
