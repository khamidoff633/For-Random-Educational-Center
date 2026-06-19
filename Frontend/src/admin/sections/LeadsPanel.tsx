import { useState } from "react";
import { Phone, Trash2, GripVertical, StickyNote } from "lucide-react";
import { api } from "../../api/client";
import Modal from "../../components/ui/Modal";
import { Field, TextArea } from "../ui/AdminField";
import type { Course, Lead, LeadStatus } from "../../types";

const COLUMNS: { status: LeadStatus; label: string; accent: string }[] = [
  { status: "yangi", label: "Yangi", accent: "border-sky-500/50" },
  { status: "suhbatda", label: "Suhbatda", accent: "border-amber-500/50" },
  { status: "oqiyapti", label: "O'qiyapti", accent: "border-emerald-500/50" },
  { status: "rad-etildi", label: "Rad etildi", accent: "border-rose-500/50" },
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
  const [dragId, setDragId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Lead | null>(null);
  const [notes, setNotes] = useState("");

  const courseName = (id: string) => courses.find((c) => c.id === id)?.name;

  const move = async (id: string, status: LeadStatus) => {
    const lead = leads.find((l) => l.id === id);
    if (!lead || lead.status === status) return;
    await api.put(`/leads/${id}`, { status }, true);
    onChanged();
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
      <h3 className="mb-5 text-lg font-bold text-white">Arizalar (CRM) — {leads.length}</h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {COLUMNS.map((col) => {
          const items = leads.filter((l) => l.status === col.status);
          return (
            <div
              key={col.status}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => dragId && move(dragId, col.status)}
              className={`rounded-2xl border-t-2 ${col.accent} glass p-3`}
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <span className="text-sm font-bold text-white">{col.label}</span>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-300">{items.length}</span>
              </div>
              <div className="space-y-2.5">
                {items.map((lead) => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={() => setDragId(lead.id)}
                    onDragEnd={() => setDragId(null)}
                    className="group cursor-grab rounded-xl border border-white/10 bg-white/5 p-3 active:cursor-grabbing"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-white">{lead.studentName}</p>
                      <GripVertical size={14} className="mt-0.5 shrink-0 text-slate-500" />
                    </div>
                    <a href={`tel:${lead.phone}`} className="mt-1 flex items-center gap-1.5 text-xs text-neon-cyan">
                      <Phone size={11} /> {lead.phone}
                    </a>
                    {courseName(lead.courseId) && (
                      <p className="mt-1 text-[11px] text-slate-400">{courseName(lead.courseId)}</p>
                    )}
                    {lead.notes && <p className="mt-2 line-clamp-2 text-[11px] text-slate-500">{lead.notes}</p>}
                    <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-2">
                      <button
                        onClick={() => {
                          setEditing(lead);
                          setNotes(lead.notes);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] text-slate-400 transition hover:text-neon-cyan"
                      >
                        <StickyNote size={12} /> Izoh
                      </button>
                      <button
                        onClick={() => remove(lead.id)}
                        className="text-slate-400 transition hover:text-rose-400"
                        aria-label="O'chirish"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
                {items.length === 0 && (
                  <p className="px-1 py-6 text-center text-xs text-slate-600">Bo'sh</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)}>
        {editing && (
          <div className="space-y-4">
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
