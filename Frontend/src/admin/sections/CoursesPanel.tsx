import { useState } from "react";
import { Plus, Pencil, Trash2, Loader2, Sparkles, Save } from "lucide-react";
import { api } from "../../api/client";
import Modal from "../../components/ui/Modal";
import { Field, TextInput, TextArea, Select } from "../ui/AdminField";
import MediaUpload from "../ui/MediaUpload";
import type { Course, Teacher } from "../../types";
import { Card, CardContent, Badge } from "../ui/ShadcnComponents";

const EMPTY: Partial<Course> = {
  name: "",
  category: "English",
  description: "",
  duration: "3 oy",
  price: "",
  teacherId: "",
  days: "Dush - Chor - Jum",
  time: "15:00 - 17:00",
  capacity: 12,
  image: "",
};

export default function CoursesPanel({
  courses,
  teachers,
  onChanged,
}: {
  courses: Course[];
  teachers: Teacher[];
  onChanged: () => void;
}) {
  const [editing, setEditing] = useState<Partial<Course> | null>(null);
  const [saving, setSaving] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof Course>(key: K, value: Course[K]) =>
    setEditing((c) => (c ? { ...c, [key]: value } : c));

  const teacherName = (id: string) => teachers.find((t) => t.id === id)?.name ?? "—";

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    setError("");
    try {
      if (editing.id) await api.put(`/courses/${editing.id}`, editing, true);
      else await api.post("/courses", editing, true);
      setEditing(null);
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Saqlashda xatolik");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Ushbu kursni o'chirishni tasdiqlaysizmi?")) return;
    await api.del(`/courses/${id}`, true);
    onChanged();
  };

  const generateDescription = async () => {
    if (!editing?.name) return setError("Avval kurs nomini kiriting.");
    setAiBusy(true);
    setError("");
    try {
      const { text } = await api.post<{ text: string }>(
        "/ai/generate",
        { type: "course", name: editing.name, context: editing.category },
        true
      );
      set("description", text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI xatolik");
    } finally {
      setAiBusy(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-charcoal">Kurslar ({courses.length})</h3>
        <button onClick={() => setEditing({ ...EMPTY })} className="btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm">
          <Plus size={16} /> Yangi kurs
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden flex flex-col h-full hover:-translate-y-0.5 transition-transform duration-300">
            <CardContent className="flex gap-4 p-5 flex-1">
              <img
                src={course.image || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=200&auto=format&fit=crop"}
                alt=""
                className="h-16 w-16 shrink-0 rounded-xl object-cover border border-black/5"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-charcoal text-sm">{course.name}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <Badge variant="outline" className="text-[10px] font-bold py-0.5">
                    {course.category}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px] font-bold py-0.5">
                    {course.price}
                  </Badge>
                </div>
                <p className="mt-2 truncate text-xs text-charcoal-soft font-semibold">
                  Ustoz: <span className="text-charcoal font-bold">{teacherName(course.teacherId)}</span>
                </p>
              </div>
            </CardContent>
            <div className="flex border-t border-black/5 bg-cream-soft/10">
              <button onClick={() => setEditing(course)} className="flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-semibold text-charcoal-soft transition hover:bg-cream-soft/40 hover:text-caramel-deep border-r border-black/5">
                <Pencil size={13} /> Tahrirlash
              </button>
              <button onClick={() => remove(course.id)} className="flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-semibold text-charcoal-soft transition hover:bg-rose-50 hover:text-rose-600">
                <Trash2 size={13} /> O'chirish
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} maxWidth="max-w-2xl" tone="light">
        {editing && (
          <div className="space-y-4">
            <h3 className="font-display text-lg font-bold text-charcoal">{editing.id ? "Kursni tahrirlash" : "Yangi kurs"}</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Kurs nomi"><TextInput value={editing.name ?? ""} onChange={(e) => set("name", e.target.value)} /></Field>
              <Field label="Yo'nalish"><TextInput value={editing.category ?? ""} onChange={(e) => set("category", e.target.value)} /></Field>
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-charcoal-soft">Tavsif</span>
                <button onClick={generateDescription} disabled={aiBusy} className="inline-flex items-center gap-1 text-xs text-jade transition hover:text-jade-deep disabled:opacity-60">
                  {aiBusy ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} AI yozsin
                </button>
              </div>
              <TextArea rows={3} value={editing.description ?? ""} onChange={(e) => set("description", e.target.value)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="O'qituvchi">
                <Select value={editing.teacherId ?? ""} onChange={(e) => set("teacherId", e.target.value)}>
                  <option value="">Tanlanmagan</option>
                  {teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </Select>
              </Field>
              <Field label="Narxi"><TextInput value={editing.price ?? ""} onChange={(e) => set("price", e.target.value)} /></Field>
              <Field label="Davomiyligi"><TextInput value={editing.duration ?? ""} onChange={(e) => set("duration", e.target.value)} /></Field>
              <Field label="O'rinlar soni"><TextInput type="number" value={editing.capacity ?? 12} onChange={(e) => set("capacity", Number(e.target.value))} /></Field>
              <Field label="Kunlar"><TextInput value={editing.days ?? ""} onChange={(e) => set("days", e.target.value)} /></Field>
              <Field label="Vaqti"><TextInput value={editing.time ?? ""} onChange={(e) => set("time", e.target.value)} /></Field>
            </div>
            <MediaUpload label="Kurs rasmi" value={editing.image ?? ""} onChange={(v) => set("image", v)} />
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
