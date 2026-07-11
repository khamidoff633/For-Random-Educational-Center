import { useMemo } from "react";
import { Phone, Trash2, AlertTriangle, Clock, Inbox } from "lucide-react";
import { api } from "../../api/client";
import type { Course, Lead } from "../../types";
import { Card, CardContent, Badge } from "../ui/ShadcnComponents";

const TTL_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

function daysLeft(verifiedAt?: string | null): number {
  if (!verifiedAt) return TTL_DAYS;
  const elapsed = Date.now() - new Date(verifiedAt).getTime();
  return Math.max(0, TTL_DAYS - Math.floor(elapsed / DAY_MS));
}

function toneFor(days: number): { style: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" } {
  if (days >= 5) return { style: "bg-jade/12 text-jade-deep border-jade/10", variant: "success" };
  if (days >= 3) return { style: "bg-amber-500/12 text-amber-700 border-amber-500/10", variant: "secondary" };
  return { style: "bg-rose-500/12 text-rose-700 border-rose-500/10", variant: "destructive" };
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
      {/* Alert Banner styled like Shadcn Alert */}
      <div className="mb-6 flex items-start gap-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 shadow-sm">
        <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-600" />
        <div>
          <h5 className="text-xs font-bold text-amber-800 uppercase tracking-wider">CRM Arxiv xabarnomasi</h5>
          <p className="text-xs text-amber-800/90 mt-1 font-semibold leading-relaxed">
            Bu arizalar <span className="underline decoration-amber-500/40 decoration-2">7 kun</span> davomida arxivda saqlanadi, so'ngra ma'lumotlar
            bazasidan <span className="font-bold">avtomatik o'chiriladi</span>. Har bir arizada qancha kun qolgani ko'rsatilgan.
          </p>
        </div>
      </div>

      {verified.length === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-3 py-16 text-center text-stone-400">
          <Inbox size={36} className="text-stone-300" />
          <p className="text-sm font-semibold">Tekshirilgan arizalar yo'q.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {verified.map((lead) => {
            const left = daysLeft(lead.verifiedAt);
            const { variant } = toneFor(left);
            return (
              <Card key={lead.id} className="flex flex-col h-full hover:-translate-y-0.5 transition-transform duration-300">
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="flex items-start justify-between gap-2.5 mb-3">
                    <div className="min-w-0">
                      <p className="truncate font-bold text-charcoal text-sm">{lead.studentName}</p>
                      <a href={`tel:${lead.phone}`} className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-caramel-deep hover:underline">
                        <Phone size={11} /> {lead.phone}
                      </a>
                    </div>
                    <Badge variant={variant} className="shrink-0 text-[10px] font-bold py-1">
                      <Clock size={11} />
                      {left > 0 ? `${left} kun qoldi` : "Bugun o'chadi"}
                    </Badge>
                  </div>

                  {courseName(lead.courseId) && (
                    <p className="text-xs text-charcoal-soft font-bold mb-2">{courseName(lead.courseId)}</p>
                  )}
                  {lead.notes && <p className="line-clamp-2 text-xs text-stone-500 mb-4 italic">"{lead.notes}"</p>}

                  <div className="mt-auto flex items-center justify-between border-t border-black/5 pt-3">
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">
                      {lead.verifiedAt ? `${new Date(lead.verifiedAt).toLocaleDateString("uz")}` : ""}
                    </span>
                    <button
                      onClick={() => remove(lead.id)}
                      title="Hoziroq o'chirish"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 transition hover:bg-rose-500/20"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
