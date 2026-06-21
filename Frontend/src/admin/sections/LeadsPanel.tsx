import { useEffect, useMemo, useState } from "react";
import { Phone, Trash2, Check, StickyNote, TrendingUp, Download } from "lucide-react";
import { api } from "../../api/client";
import Modal from "../../components/ui/Modal";
import { Field, TextArea, Select } from "../ui/AdminField";
import type { Course, Lead, LeadStatus } from "../../types";

const STATUS_META: Record<LeadStatus, { label: string; dot: string; chip: string }> = {
  yangi: { label: "Yangi", dot: "bg-sky-500", chip: "bg-sky-500/12 text-sky-700" },
  boglanildi: { label: "Bog'lanildi", dot: "bg-amber-500", chip: "bg-amber-500/12 text-amber-700" },
  royxatga_otdi: { label: "Ro'yxatdan o'tdi", dot: "bg-jade", chip: "bg-jade/12 text-jade-deep" },
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

  const active = useMemo(() => leads.filter((l) => !l.verified), [leads]);

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

  // Client-side CSV export (no dependency). Escapes quotes + wraps every field.
  const exportCsv = () => {
    const rows = shown;
    if (rows.length === 0) return;
    const headers = ["Ism", "Telefon", "Kurs", "Status", "Izoh", "Sana"];
    const esc = (v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const lines = rows.map((l) =>
      [
        l.studentName,
        l.phone,
        courseName(l.courseId) ?? "",
        STATUS_META[l.status].label,
        l.notes ?? "",
        new Date(l.createdAt).toLocaleString("uz"),
      ]
        .map(esc)
        .join(",")
    );
    // BOM so Excel reads UTF-8 (cyrillic / o' etc.) correctly.
    const csv = "\uFEFF" + [headers.map(esc).join(","), ...lines].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `arizalar_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Summary */}
      <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="card-soft rounded-2xl p-4">
          <p className="font-display text-2xl font-extrabold text-charcoal">{active.length}</p>
          <p className="text-xs text-charcoal-soft">Faol arizalar</p>
        </div>
        <div className="card-soft rounded-2xl p-4">
          <p className="font-display text-2xl font-extrabold text-jade">{converted}</p>
          <p className="text-xs text-charcoal-soft">Ro'yxatdan o'tdi</p>
        </div>
        <div className="card-soft rounded-2xl p-4">
          <p className="font-display flex items-center gap-1.5 text-2xl font-extrabold text-charcoal">
            <TrendingUp size={18} className="text-caramel" />
            {conversion}%
          </p>
          <p className="text-xs text-charcoal-soft">Konversiya</p>
        </div>
        <div className="card-soft rounded-2xl p-4">
          <p className="font-display text-2xl font-extrabold text-sky-600">
            {active.filter((l) => l.status === "yangi").length}
          </p>
          <p className="text-xs text-charcoal-soft">Yangi</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              filter === f.key ? "btn-primary" : "border border-black/10 bg-white text-charcoal-soft hover:text-charcoal"
            }`}
          >
            {f.label}
          </button>
        ))}
        <button
          onClick={exportCsv}
          disabled={shown.length === 0}
          title="Joriy ro'yxatni CSV (Excel) ga yuklab olish"
          className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-charcoal-soft transition hover:text-caramel-deep disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download size={15} /> CSV eksport
        </button>
      </div>

      {/* Table */}
      <div className="card-soft overflow-hidden rounded-2xl">
        <div className="hidden grid-cols-[1.4fr_1fr_1.2fr_1.2fr_auto] gap-3 border-b border-black/5 bg-cream-soft px-5 py-3 text-xs font-semibold uppercase tracking-wide text-charcoal-soft lg:grid">
          <span>O'quvchi</span>
          <span>Telefon</span>
          <span>Kurs</span>
          <span>Status</span>
          <span className="text-right">Amallar</span>
        </div>

        {shown.length === 0 && <p className="px-5 py-10 text-center text-sm text-stone-500">Ariza yo'q.</p>}

        {shown.map((lead) => (
          <div
            key={lead.id}
            className="grid grid-cols-1 gap-3 border-b border-black/5 px-5 py-4 transition hover:bg-cream-soft lg:grid-cols-[1.4fr_1fr_1.2fr_1.2fr_auto] lg:items-center"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {!lead.seen && <span className="h-2 w-2 shrink-0 rounded-full bg-caramel" />}
                <p className="truncate font-semibold text-charcoal">{lead.studentName}</p>
              </div>
              <p className="text-xs text-stone-500">{new Date(lead.createdAt).toLocaleDateString("uz")}</p>
            </div>

            <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 text-sm text-caramel-deep">
              <Phone size={13} /> {lead.phone}
            </a>

            <p className="truncate text-sm text-charcoal-soft">{courseName(lead.courseId) ?? "—"}</p>

            <div>
              <Select
                value={lead.status}
                onChange={(e) => setStatus(lead.id, e.target.value as LeadStatus)}
                disabled={busyId === lead.id}
                className="!py-2 text-xs"
              >
                <option value="yangi">Yangi</option>
                <option value="boglanildi">Bog'lanildi</option>
                <option value="royxatga_otdi">Ro'yxatdan o'tdi</option>
              </Select>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setEditing(lead);
                  setNotes(lead.notes);
                }}
                title="Izoh"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-black/[0.04] text-charcoal-soft transition hover:bg-black/[0.08] hover:text-charcoal"
              >
                <StickyNote size={15} />
              </button>
              <button
                onClick={() => verify(lead.id)}
                disabled={busyId === lead.id}
                title="Tekshirildi (arxivga)"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-jade/12 text-jade transition hover:bg-jade/20 disabled:opacity-50"
              >
                <Check size={16} />
              </button>
              <button
                onClick={() => remove(lead.id)}
                title="O'chirish"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/12 text-rose-600 transition hover:bg-rose-500/20"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-stone-500">
        "Tekshirildi" tugmasi arizani <span className="text-charcoal">Tekshirilgan arizalar</span> bo'limiga
        o'tkazadi (7 kun saqlanadi, keyin avtomatik o'chadi).
      </p>

      <Modal open={!!editing} onClose={() => setEditing(null)} tone="light">
        {editing && (
          <div className="space-y-4">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_META[editing.status].chip}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${STATUS_META[editing.status].dot}`} />
              {STATUS_META[editing.status].label}
            </span>
            <h3 className="font-display text-lg font-bold text-charcoal">{editing.studentName}</h3>
            <p className="text-sm text-caramel-deep">{editing.phone}</p>
            <Field label="Izoh">
              <TextArea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </Field>
            <button onClick={saveNotes} className="btn-primary w-full rounded-xl py-3 text-sm">
              Saqlash
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
