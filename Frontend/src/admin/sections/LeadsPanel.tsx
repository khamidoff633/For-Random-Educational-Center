import { useEffect, useMemo, useState } from "react";
import { Phone, Trash2, Check, StickyNote, TrendingUp, Download } from "lucide-react";
import { api } from "../../api/client";
import Modal from "../../components/ui/Modal";
import { Field, TextArea, Select } from "../ui/AdminField";
import type { Course, Lead, LeadStatus } from "../../types";
import { Card, CardContent, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge, TabsList, TabsTrigger } from "../ui/ShadcnComponents";

const STATUS_META: Record<LeadStatus, { label: string; dot: string; chip: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" }> = {
  yangi: { label: "Yangi", dot: "bg-sky-500", chip: "bg-sky-500/12 text-sky-700", variant: "default" },
  boglanildi: { label: "Bog'lanildi", dot: "bg-amber-500", chip: "bg-amber-500/12 text-amber-700", variant: "secondary" },
  royxatga_otdi: { label: "Ro'yxatdan o'tdi", dot: "bg-jade", chip: "bg-jade/12 text-jade-deep", variant: "success" },
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
      {/* Summary with Shadcn Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <p className="font-display text-2xl font-extrabold text-charcoal">{active.length}</p>
            <p className="text-xs font-semibold text-charcoal-soft/80 mt-1">Faol arizalar</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="font-display text-2xl font-extrabold text-jade-deep">{converted}</p>
            <p className="text-xs font-semibold text-charcoal-soft/80 mt-1">Ro'yxatdan o'tdi</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="font-display flex items-center gap-1.5 text-2xl font-extrabold text-charcoal">
              <TrendingUp size={18} className="text-caramel" />
              {conversion}%
            </p>
            <p className="text-xs font-semibold text-charcoal-soft/80 mt-1">Konversiya</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="font-display text-2xl font-extrabold text-sky-600">
              {active.filter((l) => l.status === "yangi").length}
            </p>
            <p className="text-xs font-semibold text-charcoal-soft/80 mt-1">Yangi</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters with Shadcn Tabs Trigger and CSV export */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <TabsList>
          {FILTERS.map((f) => (
            <TabsTrigger
              key={f.key}
              isActive={filter === f.key}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <button
          onClick={exportCsv}
          disabled={shown.length === 0}
          title="Joriy ro'yxatni CSV (Excel) ga yuklab olish"
          className="inline-flex items-center gap-1.5 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-charcoal-soft transition hover:text-caramel-deep hover:border-caramel/30 shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download size={15} /> CSV eksport
        </button>
      </div>

      {/* Table with Shadcn Table components */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30%]">O'quvchi</TableHead>
            <TableHead className="w-[20%]">Telefon</TableHead>
            <TableHead className="w-[25%]">Kurs</TableHead>
            <TableHead className="w-[15%]">Status</TableHead>
            <TableHead className="w-[10%] text-right">Amallar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shown.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="py-10 text-center text-sm text-stone-500">
                Ariza yo'q.
              </TableCell>
            </TableRow>
          )}

          {shown.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell className="min-w-0">
                <div className="flex items-center gap-2">
                  {!lead.seen && <span className="h-2 w-2 shrink-0 rounded-full bg-caramel animate-pulse" />}
                  <div>
                    <p className="truncate font-bold text-charcoal text-sm">{lead.studentName}</p>
                    <p className="text-[10px] text-stone-500 mt-0.5">{new Date(lead.createdAt).toLocaleDateString("uz")}</p>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <a href={`tel:${lead.phone}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-caramel-deep hover:underline">
                  <Phone size={13} /> {lead.phone}
                </a>
              </TableCell>

              <TableCell>
                <span className="truncate text-sm text-charcoal-soft font-semibold">{courseName(lead.courseId) ?? "—"}</span>
              </TableCell>

              <TableCell>
                <div className="w-[140px]">
                  <Select
                    value={lead.status}
                    onChange={(e) => setStatus(lead.id, e.target.value as LeadStatus)}
                    disabled={busyId === lead.id}
                    className="!py-1.5 text-xs font-semibold"
                  >
                    <option value="yangi">Yangi</option>
                    <option value="boglanildi">Bog'lanildi</option>
                    <option value="royxatga_otdi">Ro'yxatdan o'tdi</option>
                  </Select>
                </div>
              </TableCell>

              <TableCell className="lg:text-right flex items-center gap-2 justify-end">
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
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-jade/12 text-jade-deep transition hover:bg-jade/20 disabled:opacity-50"
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
