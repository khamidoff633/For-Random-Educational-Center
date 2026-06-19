import { useEffect, useMemo, useState } from "react";
import { Phone, Trash2, Check, StickyNote, TrendingUp } from "lucide-react";
import { api } from "../../api/client";
import Modal from "../../components/ui/Modal";
import { Field, TextArea, Select } from "../ui/AdminField";
import type { Course, Lead, LeadStatus } from "../../types";

const STATUS_META: Record<LeadStatus, { label: string; dot: string; chip: string }> = {
  yangi: { label: "Yangi", dot: "bg-sky-400", chip: "bg-sky-500/15 text-sky-300" },
  boglanildi: { label: "Bog'lanildi", dot: "bg-amber-400", chip: "bg-amber-500/15 text-amber-300" },
  royxatga_otdi: {
    label: "Ro'yxatdan o'tdi",
    dot: "bg-emerald-400",
    chip: "bg-emerald-500/15 text-emerald-300",
  },
};

const FILTERS: { key: "all" | LeadStatus; label: string }[] = [
  { key: "all", label: "Hammasi" },
  { key: "yangi", label: "Yangi" },
  { key: "boglanildi", label: "Bog'lanildi" },
  { key: "royxatga_otdi", label: "Ro'yxatdan o'tdi" },
];

export default function LeadsPanel({
  leads,
  courses,
  onChanged,
}: {
  leads: Lead[];
  courses: Course[];
  onChanged: () => void;
}) {
  const [filter, setFilter] = useState<"all" | LeadStatus>("all");
  const [editing, setEditing] = useState<Lead | null>(null);
  const [notes, setNotes] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  // Active pipeline = leads that are not archived ("Tekshirilgan").
  const active = useMemo(() => leads.filter((l) => !l.verified), [leads]);

  // On open, clear the "new" badge by marking everything as seen.
  useEffect(() => {
    if (leads.some((l) => !l.seen && !l.verified)) {
      api.post("/leads/mark-seen", undefined, true).then(onChanged).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const courseName = (id: string) => courses.find((c) => c.id === id)?.name;

  const converted = active.filter((l) => l.status === "royxatga_otdi").length;
  const conversion = active.length ? Math.round((converted / active.length) * 100) : 0;

  const shown = filter === "all" ? active : active.filter((l) => l.status === filter);

  const setStatus = async (id: string, status: LeadStatus) => {
    setBusyId(id);
    try {
      await api.put(`/leads/${id}`, { status }, true);
      onChanged();
    } finally {
      setBusyId(null);
    }
  };

  const verify = async (id: string) => {
    setBusyId(id);
    try {
      await api.put(`/leads/${id}`, { verified: true }, true);
      onChanged();
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Ushbu arizani o'chirishni tasdiqlaysizmi?")) return;
    await api.del(`/leads/${id}`, true);
    onChanged();
  };

  const saveNotes = async () => {
    if (!editing) return;
    await api.put(`/leads/${editing.id}`, { notes }, true);
    setEditing(null);
    onChanged();
  };

  return (
    <div>
      {/* Summary */}
      <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="glass rounded-2xl p-4">
          <p className="text-2xl font-black text-white">{active.length}</p>
          <p className="text-xs text-slate-400">Faol arizalar</p>
        </div>
        <div className="glass rounded-2xl p-4">
          <p className="text-2xl font-black text-emerald-400">{converted}</p>
          <p className="text-xs text-slate-400">Ro'yxatdan o'tdi</p>
        </div>
        <div className="glass rounded-2xl p-4">
          <p className="flex items-center gap-1.5 text-2xl font-black text-white">
            <TrendingUp size={18} className="text-neon-cyan" />
            {conversion}%
          </p>
          <p className="text-xs text-slate-400">Konversiya</p>
        </div>
        <div className="glass rounded-2xl p-4">
          <p className="text-2xl font-black text-sky-400">
            {active.filter((l) => l.status === "yangi").length}
          </p>
          <p className="text-xs text-slate-400">Yangi</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              filter === f.key
                ? "bg-gradient-to-r from-neon-cyan to-neon-violet text-[#050510]"
                : "glass text-slate-300 hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass overflow-hidden rounded-2xl">
        <div className="hidden grid-cols-[1.4fr_1fr_1.2fr_1.2fr_auto] gap-3 border-b border-white/10 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400 lg:grid">
          <span>O'quvchi</span>
          <span>Telefon</span>
          <span>Kurs</span>
          <span>Status</span>
          <span className="text-right">Amallar</span>
        </div>

        {shown.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-slate-500">Ariza yo'q.</p>
        )}

        {shown.map((lead) => (
          <div
            key={lead.id}
            className="grid grid-cols-1 gap-3 border-b border-white/5 px-5 py-4 transition hover:bg-white/[0.03] lg:grid-cols-[1.4fr_1fr_1.2fr_1.2fr_auto] lg:items-center"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {!lead.seen && <span className="h-2 w-2 shrink-0 rounded-full bg-neon-cyan" />}
                <p className="truncate font-semibold text-white">{lead.studentName}</p>
              </div>
              <p className="text-xs text-slate-500">
                {new Date(lead.createdAt).toLocaleDateString("uz")}
              </p>
            </div>

            <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 text-sm text-neon-cyan">
              <Phone size={13} /> {lead.phone}
            </a>

            <p className="truncate text-sm text-slate-300">{courseName(lead.courseId) ?? "—"}</p>

            <div>
              <Select
                value={lead.status}
                onChange={(e) => setStatus(lead.id, e.target.value as LeadStatus)}
                disabled={busyId === lead.id}
                className="!py-2 text-xs"
              >
                <option value="yangi" className="bg-ink-800">Yangi</option>
                <option value="boglanildi" className="bg-ink-800">Bog'lanildi</option>
                <option value="royxatga_otdi" className="bg-ink-800">Ro'yxatdan o'tdi</option>
              </Select>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setEditing(lead);
                  setNotes(lead.notes);
                }}
                title="Izoh"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <StickyNote size={15} />
              </button>
              <button
                onClick={() => verify(lead.id)}
                disabled={busyId === lead.id}
                title="Tekshirildi (arxivga)"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 transition hover:bg-emerald-500/25 disabled:opacity-50"
              >
                <Check size={16} />
              </button>
              <button
                onClick={() => remove(lead.id)}
                title="O'chirish"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/15 text-rose-400 transition hover:bg-rose-500/25"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-slate-500">
        "Tekshirildi" tugmasi arizani <span className="text-slate-300">Tekshirilgan arizalar</span>{" "}
        bo'limiga o'tkazadi (7 kun saqlanadi, keyin avtomatik o'chadi).
      </p>

      <Modal open={!!editing} onClose={() => setEditing(null)}>
        {editing && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_META[editing.status].chip}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${STATUS_META[editing.status].dot}`} />
                {STATUS_META[editing.status].label}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">{editing.studentName}</h3>
            <p className="text-sm text-neon-cyan">{editing.phone}</p>
            <Field label="Izoh">
              <TextArea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </Field>
            <button onClick={saveNotes} className="btn-neon w-full rounded-xl py-3 text-sm">
              Saqlash
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
