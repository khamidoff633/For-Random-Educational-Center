import { useState } from "react";
import { Plus, Pencil, Trash2, Loader2, Save, Award } from "lucide-react";
import { api } from "../../api/client";
import Modal from "../../components/ui/Modal";
import { Field, TextInput, TextArea, Select } from "../ui/AdminField";
import MediaUpload from "../ui/MediaUpload";
import Avatar from "../../components/ui/Avatar";
import type { ExamType, StudentResultItem } from "../../types";
import { Card, CardContent, Badge } from "../ui/ShadcnComponents";

const EXAM_TYPES: ExamType[] = ["IELTS", "CEFR", "SAT", "Dasturlash"];
const DESC_MAX = 150;

const EMPTY: Partial<StudentResultItem> = {
  studentName: "",
  examType: "IELTS",
  score: "",
  courseName: "",
  achievementDate: new Date().toISOString().slice(0, 10),
  image: "",
  certificateImage: "",
  description: "",
};

export default function ResultsPanel({
  results,
  onChanged,
}: {
  results: StudentResultItem[];
  onChanged: () => void;
}) {
  const [editing, setEditing] = useState<Partial<StudentResultItem> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof StudentResultItem>(key: K, value: StudentResultItem[K]) =>
    setEditing((r) => (r ? { ...r, [key]: value } : r));

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    setError("");
    try {
      if (editing.id) await api.put(`/results/${editing.id}`, editing, true);
      else await api.post("/results", editing, true);
      setEditing(null);
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Saqlashda xatolik");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Ushbu natijani o'chirishni tasdiqlaysizmi?")) return;
    await api.del(`/results/${id}`, true);
    onChanged();
  };

  const descLength = (editing?.description ?? "").length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-charcoal">O'quvchilar natijalari ({results.length})</h3>
        <button onClick={() => setEditing({ ...EMPTY })} className="btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm">
          <Plus size={16} /> Yangi natija
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {results.map((result) => (
          <Card key={result.id} className="overflow-hidden flex flex-col h-full hover:-translate-y-0.5 transition-transform duration-300">
            <CardContent className="flex gap-4 p-5 flex-1">
              <Avatar
                name={result.studentName}
                src={result.certificateImage || result.image}
                fontClass="text-lg"
                className="h-16 w-16 shrink-0 rounded-xl border border-black/5"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-charcoal text-sm">{result.studentName}</p>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <Badge variant="outline" className="text-[10px] font-bold py-0.5">
                    {result.examType}
                  </Badge>
                  <Badge variant="success" className="text-[10px] font-bold py-0.5">
                    {result.score}
                  </Badge>
                </div>
                {result.certificateImage && (
                  <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-jade-deep">
                    <Award size={11} /> Sertifikat yuklangan
                  </span>
                )}
              </div>
            </CardContent>
            <div className="flex border-t border-black/5 bg-cream-soft/10">
              <button onClick={() => setEditing(result)} className="flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-semibold text-charcoal-soft transition hover:bg-cream-soft/40 hover:text-caramel-deep border-r border-black/5">
                <Pencil size={13} /> Tahrirlash
              </button>
              <button onClick={() => remove(result.id)} className="flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-semibold text-charcoal-soft transition hover:bg-rose-50 hover:text-rose-600">
                <Trash2 size={13} /> O'chirish
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} maxWidth="max-w-2xl" tone="light">
        {editing && (
          <div className="space-y-4">
            <h3 className="font-display text-lg font-bold text-charcoal">{editing.id ? "Natijani tahrirlash" : "Yangi natija"}</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="O'quvchi ismi"><TextInput value={editing.studentName ?? ""} onChange={(e) => set("studentName", e.target.value)} /></Field>
              <Field label="Imtihon turi">
                <Select value={editing.examType ?? "IELTS"} onChange={(e) => set("examType", e.target.value as ExamType)}>
                  {EXAM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </Select>
              </Field>
              <Field label="Natija (ball)"><TextInput value={editing.score ?? ""} onChange={(e) => set("score", e.target.value)} placeholder="masalan: 8.5" /></Field>
              <Field label="Kurs nomi"><TextInput value={editing.courseName ?? ""} onChange={(e) => set("courseName", e.target.value)} /></Field>
              <Field label="Sana"><TextInput type="date" value={editing.achievementDate ?? ""} onChange={(e) => set("achievementDate", e.target.value)} /></Field>
            </div>

            <MediaUpload label="Ko'rgazma rasmi (o'quvchi fotosi)" value={editing.image ?? ""} onChange={(v) => set("image", v)} />
            <MediaUpload label="Sertifikat rasmi" value={editing.certificateImage ?? ""} onChange={(v) => set("certificateImage", v)} />

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-charcoal-soft">Tasnif (ixtiyoriy)</span>
                <span className={`text-[11px] ${descLength > DESC_MAX ? "text-rose-600" : "text-stone-500"}`}>
                  {descLength}/{DESC_MAX}
                </span>
              </div>
              <TextArea
                rows={2}
                maxLength={DESC_MAX}
                value={editing.description ?? ""}
                onChange={(e) => set("description", e.target.value.slice(0, DESC_MAX))}
                placeholder="Xohlasangiz, qisqa izoh yozing (majburiy emas)"
              />
            </div>

            {error && <p className="text-sm text-rose-600">{error}</p>}
            <button onClick={save} disabled={saving} className="btn-primary inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm disabled:opacity-60">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Saqlash
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
