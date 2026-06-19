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
  royxatga_otdi: "bg-emerald-500",
};

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-violet/20 text-neon-cyan">
          {icon}
        </span>
      </div>
      <p className="mt-4 text-3xl font-black text-white">{value}</p>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
    </div>
  );
}

export default function Dashboard({ stats }: { stats: DashboardStats | null }) {
  if (!stats) {
    return <p className="text-slate-400">Ma'lumotlar yuklanmoqda...</p>;
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
        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <div className="mb-5 flex items-center gap-2">
            <TrendingUp size={18} className="text-neon-cyan" />
            <h3 className="font-bold text-white">Arizalar dinamikasi (14 kun)</h3>
          </div>
          <div className="flex h-40 items-end gap-1.5">
            {stats.leadsTrend.map((d) => (
              <div key={d.date} className="group flex flex-1 flex-col items-center justify-end gap-1">
                <span className="text-[10px] text-slate-400 opacity-0 transition group-hover:opacity-100">
                  {d.count}
                </span>
                <div
                  className="w-full rounded-t bg-gradient-to-t from-neon-violet to-neon-cyan transition-all"
                  style={{ height: `${(d.count / maxTrend) * 100}%`, minHeight: d.count ? 4 : 0 }}
                />
                <span className="text-[8px] text-slate-500">{d.date.slice(8)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status breakdown */}
        <div className="glass rounded-2xl p-6">
          <h3 className="mb-5 font-bold text-white">Holatlar bo'yicha</h3>
          <div className="space-y-3">
            {(Object.keys(STATUS_LABELS) as LeadStatus[]).map((status) => {
              const count = stats.leadsByStatus[status] ?? 0;
              const pct = stats.totalLeads ? (count / stats.totalLeads) * 100 : 0;
              return (
                <div key={status}>
                  <div className="mb-1 flex justify-between text-xs text-slate-300">
                    <span>{STATUS_LABELS[status]}</span>
                    <span className="font-bold">{count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div className={`h-full rounded-full ${STATUS_COLORS[status]}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent leads */}
      <div className="glass rounded-2xl p-6">
        <h3 className="mb-4 font-bold text-white">So'nggi arizalar</h3>
        <div className="space-y-2">
          {stats.recentLeads.length === 0 && <p className="text-sm text-slate-500">Hozircha ariza yo'q.</p>}
          {stats.recentLeads.map((lead) => (
            <div
              key={lead.id}
              className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 text-sm"
            >
              <div>
                <p className="font-semibold text-white">{lead.studentName}</p>
                <p className="text-xs text-slate-400">{lead.phone}</p>
              </div>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-slate-300">
                {STATUS_LABELS[lead.status]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
