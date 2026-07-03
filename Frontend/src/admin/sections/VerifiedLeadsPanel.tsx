import { useMemo } from "react";
import { Phone, Trash2, AlertTriangle, Clock, Inbox } from "lucide-react";
import { api } from "../../api/client";
import type { Course, Lead } from "../../types";

const TTL_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

function daysLeft(verifiedAt?: string | null): number {
  if (!verifiedAt) return TTL_DAYS;
  const elapsed = Date.now() - new Date(verifiedAt).getTime();
  return Math.max(0, TTL_DAYS - Math.floor(elapsed / DAY_MS));
}

function toneFor(days: number): string {
  if (days >= 5) return "bg-jade/10 text-jade-deep border-jade/30";
  if (days >= 3) return "bg-amber-500/12 text-amber-700 border-amber-500/30";
  return "bg-rose-500/12 text-rose-700 border-rose-500/30";
}

export default function VerifiedLeadsPanel({
  leads,
  courses,
  onChanged,
}: {
  leads: Lead[];
  courses: Course[];
  onChanged: () => void;
}) {
  const verified = useMemo(
    () =>
      leads
        .filter((l) => l.verified)
        .sort((a, b) => new Date(a.verifiedAt ?? 0).getTime() - new Date(b.verifiedAt ?? 0).getTime()),
    [leads]
  );

  const courseName = (id: string) => courses.find((c) => c.id === id)?.name;

  const remove = async (id: string) => {
    if (!confirm("Ushbu arizani butunlay o'chirishni tasdiqlaysizmi?")) return;
    await api.del(`/leads/${id}`, true);
    onChanged();
  };

  return (
    <div>
      <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
        <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-600" />
        <p className="text-sm text-amber-800">
          Bu arizalar <span className="font-bold">{TTL_DAYS} kun</span> saqlanadi, so'ngra ma'lumotlar
          bazasidan <span className="font-bold">avtomatik o'chiriladi</span>. Har bir arizada qancha kun
          qolgani ko'rsatilgan.
        </p>
      </div>

      {verified.length === 0 ? (
        <div className="card-soft flex flex-col items-center gap-3 rounded-2xl py-16 text-center text-stone-500">
          <Inbox size={36} />
          <p className="text-sm">Tekshirilgan arizalar yo'q.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {verified.map((lead) => {
            const left = daysLeft(lead.verifiedAt);
            return (
              <div key={lead.id} className="card-soft flex flex-col gap-3 rounded-2xl p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-charcoal">{lead.studentName}</p>
                    <a href={`tel:${lead.phone}`} className="mt-0.5 flex items-center gap-1.5 text-xs text-caramel-deep">
                      <Phone size={11} /> {lead.phone}
                    </a>
                  </div>
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${toneFor(left)}`}>
                    <Clock size={11} />
                    {left > 0 ? `${left} kun qoldi` : "Bugun o'chadi"}
                  </span>
                </div>

                {courseName(lead.courseId) && (
                  <p className="text-xs text-charcoal-soft">{courseName(lead.courseId)}</p>
                )}
                {lead.notes && <p className="line-clamp-2 text-xs text-stone-500">{lead.notes}</p>}

                <div className="mt-auto flex items-center justify-between border-t border-black/5 pt-3">
                  <span className="text-[11px] text-stone-500">
                    {lead.verifiedAt ? `Tekshirilgan: ${new Date(lead.verifiedAt).toLocaleDateString("uz")}` : ""}
                  </span>
                  <button
                    onClick={() => remove(lead.id)}
                    title="Hoziroq o'chirish"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/12 text-rose-600 transition hover:bg-rose-500/20"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
