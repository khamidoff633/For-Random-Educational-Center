import type React from "react";
import { Users, GraduationCap, BookOpen, UserCheck, TrendingUp } from "lucide-react";
import type { DashboardStats, LeadStatus } from "../../types";

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
    <div className="card-soft rounded-2xl p-5">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-caramel/12 text-caramel-deep">
        {icon}
      </span>
      <p className="font-display mt-4 text-3xl font-extrabold text-charcoal">{value}</p>
      <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-soft">{label}</p>
    </div>
  );
}

export default function Dashboard({ stats }: { stats: DashboardStats | null }) {
  if (!stats) {
    return <p className="text-charcoal-soft">Ma'lumotlar yuklanmoqda...</p>;
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
        <div className="card-soft rounded-2xl p-6 lg:col-span-2">
          <div className="mb-5 flex items-center gap-2">
            <TrendingUp size={18} className="text-caramel" />
            <h3 className="font-display font-bold text-charcoal">Arizalar dinamikasi (14 kun)</h3>
          </div>
          <div className="flex h-40 items-end gap-1.5">
            {stats.leadsTrend.map((d) => (
              <div key={d.date} className="group flex flex-1 flex-col items-center justify-end gap-1">
                <span className="text-[10px] text-charcoal-soft opacity-0 transition group-hover:opacity-100">
                  {d.count}
                </span>
                <div
                  className="w-full rounded-t bg-gradient-to-t from-caramel to-jade transition-all"
                  style={{ height: `${(d.count / maxTrend) * 100}%`, minHeight: d.count ? 4 : 0 }}
                />
                <span className="text-[8px] text-stone-400">{d.date.slice(8)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status breakdown */}
        <div className="card-soft rounded-2xl p-6">
          <h3 className="font-display mb-5 font-bold text-charcoal">Holatlar bo'yicha</h3>
          <div className="space-y-3">
            {(Object.keys(STATUS_LABELS) as LeadStatus[]).map((status) => {
              const count = stats.leadsByStatus[status] ?? 0;
              const pct = stats.totalLeads ? (count / stats.totalLeads) * 100 : 0;
              return (
                <div key={status}>
                  <div className="mb-1 flex justify-between text-xs text-charcoal">
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
        </div>
      </div>

      {/* Recent leads */}
      <div className="card-soft rounded-2xl p-6">
        <h3 className="font-display mb-4 font-bold text-charcoal">So'nggi arizalar</h3>
        <div className="space-y-2">
          {stats.recentLeads.length === 0 && <p className="text-sm text-stone-500">Hozircha ariza yo'q.</p>}
          {stats.recentLeads.map((lead) => (
            <div
              key={lead.id}
              className="flex items-center justify-between rounded-xl bg-cream-soft px-4 py-3 text-sm"
            >
              <div>
                <p className="font-semibold text-charcoal">{lead.studentName}</p>
                <p className="text-xs text-charcoal-soft">{lead.phone}</p>
              </div>
              <span className="rounded-full bg-black/5 px-2.5 py-1 text-[11px] text-charcoal-soft">
                {STATUS_LABELS[lead.status]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
