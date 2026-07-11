import type React from "react";
import { Users, GraduationCap, BookOpen, UserCheck, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import type { DashboardStats, LeadStatus } from "../../types";
import { Card, CardContent } from "../ui/ShadcnComponents";

const STATUS_LABELS: Record<LeadStatus, string> = {
  yangi: "Yangi",
  boglanildi: "Bog'lanildi",
  royxatga_otdi: "Ro'yxatdan o'tdi",
};

const STATUS_COLORS: Record<LeadStatus, string> = {
  yangi: "bg-sky-500",
  boglanildi: "bg-amber-500",
  royxatga_otdi: "bg-jade",
};

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <Card className="hover:-translate-y-0.5 transition-transform duration-300">
      <CardContent className="p-5">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-caramel/12 text-caramel-deep">
          {icon}
        </span>
        <p className="font-display mt-4 text-3xl font-extrabold text-charcoal">{value}</p>
        <p className="text-[10px] font-bold uppercase tracking-wide text-charcoal-soft/80 mt-1">{label}</p>
      </CardContent>
    </Card>
  );
}

export default function Dashboard({ stats }: { stats: DashboardStats | null }) {
  if (!stats) {
    return <p className="text-charcoal-soft font-semibold">Ma'lumotlar yuklanmoqda...</p>;
  }

  const maxTrend = Math.max(1, ...stats.leadsTrend.map((d) => d.count));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={<Users size={20} />} label="Jami arizalar" value={stats.totalLeads} />
        <StatCard icon={<UserCheck size={20} />} label="O'qiyotganlar" value={stats.activeStudents} />
        <StatCard icon={<BookOpen size={20} />} label="Kurslar" value={stats.totalCourses} />
        <StatCard icon={<GraduationCap size={20} />} label="O'qituvchilar" value={stats.totalTeachers} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Trend chart */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="mb-5 flex items-center gap-2">
              <TrendingUp size={18} className="text-caramel" />
              <h3 className="font-display font-bold text-charcoal text-sm uppercase tracking-wide">Arizalar dinamikasi (14 kun)</h3>
            </div>
            <div className="flex h-40 items-end gap-1.5 pt-2">
              {stats.leadsTrend.map((d, i) => {
                const pct = (d.count / maxTrend) * 100;
                return (
                  <div
                    key={d.date}
                    className="group flex h-full flex-1 flex-col items-center justify-end gap-1"
                  >
                    <span className="text-[10px] font-bold text-charcoal-soft opacity-0 transition group-hover:opacity-100">
                      {d.count}
                    </span>
                    {/* Track keeps a consistent column; bar grows up from the bottom */}
                    <div className="flex w-full flex-1 items-end">
                      <motion.div
                        className="w-full origin-bottom rounded-t bg-gradient-to-t from-caramel to-jade"
                        style={{ height: `${pct}%`, minHeight: d.count ? 4 : 0 }}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.7, delay: i * 0.04, ease: [0.2, 0.7, 0.2, 1] }}
                      />
                    </div>
                    <span className="text-[8px] font-bold text-stone-400 mt-1">{d.date.slice(8)}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Status breakdown */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-display mb-5 font-bold text-charcoal text-sm uppercase tracking-wide">Holatlar bo'yicha</h3>
            <div className="space-y-4">
              {(Object.keys(STATUS_LABELS) as LeadStatus[]).map((status) => {
                const count = stats.leadsByStatus[status] ?? 0;
                const pct = stats.totalLeads ? (count / stats.totalLeads) * 100 : 0;
                return (
                  <div key={status}>
                    <div className="mb-1.5 flex justify-between text-xs font-semibold text-charcoal">
                      <span>{STATUS_LABELS[status]}</span>
                      <span className="font-bold">{count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-black/5">
                      <div className={`h-full rounded-full ${STATUS_COLORS[status]}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent leads */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-display mb-4 font-bold text-charcoal text-sm uppercase tracking-wide">So'nggi arizalar</h3>
          <div className="space-y-2">
            {stats.recentLeads.length === 0 && <p className="text-sm text-stone-500 font-semibold">Hozircha ariza yo'q.</p>}
            {stats.recentLeads.map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between rounded-xl bg-cream-soft/60 hover:bg-cream-soft border border-black/[0.02] px-4 py-3 text-sm transition-colors duration-200"
              >
                <div>
                  <p className="font-bold text-charcoal text-sm">{lead.studentName}</p>
                  <p className="text-xs text-charcoal-soft font-semibold mt-0.5">{lead.phone}</p>
                </div>
                <span className="rounded-full bg-black/[0.04] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-charcoal-soft">
                  {STATUS_LABELS[lead.status]}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
