import { useState } from "react";
import { Plus, Pencil, Trash2, Loader2, Sparkles, Save } from "lucide-react";
import { api } from "../../api/client";
import Modal from "../../components/ui/Modal";
import { Field, TextInput, TextArea, Select } from "../ui/AdminField";
import MediaUpload from "../ui/MediaUpload";
import type { Teacher } from "../../types";

const EMPTY: Partial<Teacher> = {
  name: "",
  specialty: "",
  bio: "",
  experience: "",
  phone: "",
  gender: "erkak",
  image: "",
};

export default function TeachersPanel({
  teachers,
  onChanged,
}: {
  teachers: Teacher[];
  onChanged: () => void;
}) {
  const [editing, setEditing] = useState<Partial<Teacher> | null>(null);
  const [saving, setSaving] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof Teacher>(key: K, value: Teacher[K]) =>
    setEditing((t) => (t ? { ...t, [key]: value } : t));

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    setError("");
    try {
      if (editing.id) await api.put(`/teachers/${editing.id}`, editing, true);
      else await api.post("/teachers", editing, true);
      setEditing(null);
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Saqlashda xatolik");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Ushbu o'qituvchini o'chirishni tasdiqlaysizmi?")) return;
    await api.del(`/teachers/${id}`, true);
    onChanged();
  };

  const generateBio = async () => {
    if (!editing?.name) return setError("Avval o'qituvchi ismini kiriting.");
    setAiBusy(true);
    setError("");
    try {
      const { text } = await api.post<{ text: string }>(
        "/ai/generate",
        { type: "teacher", name: editing.name, context: editing.specialty },
        true
      );
      set("bio", text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI xatolik");
    } finally {
      setAiBusy(false);
    }
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-charcoal">O'qituvchilar ({teachers.length})</h3>
        <button onClick={() => setEditing({ ...EMPTY })} className="btn-primary inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm">
          <Plus size={16} /> Yangi o'qituvchi
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {teachers.map((teacher) => (
          <div key={teacher.id} className="card-soft overflow-hidden rounded-2xl">
            <div className="flex gap-3 p-4">
              <img
                src={teacher.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"}
                alt=""
                className="h-16 w-16 shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-charcoal">{teacher.name}</p>
                <p className="truncate text-xs font-semibold text-caramel-deep">{teacher.specialty}</p>
                <p className="mt-0.5 text-xs text-charcoal-soft">{teacher.experience}</p>
              </div>
            </div>
            <div className="flex border-t border-black/5">
              <button onClick={() => setEditing(teacher)} className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs text-charcoal-soft transition hover:bg-cream-soft hover:text-caramel-deep">
                <Pencil size={13} /> Tahrirlash
              </button>
              <button onClick={() => remove(teacher.id)} className="flex flex-1 items-center justify-center gap-1.5 border-l border-black/5 py-2.5 text-xs text-charcoal-soft transition hover:bg-rose-50 hover:text-rose-600">
                <Trash2 size={13} /> O'chirish
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} maxWidth="max-w-2xl" tone="light">
        {editing && (
          <div className="space-y-4">
            <h3 className="font-display text-lg font-bold text-charcoal">{editing.id ? "O'qituvchini tahrirlash" : "Yangi o'qituvchi"}</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Ism familiya"><TextInput value={editing.name ?? ""} onChange={(e) => set("name", e.target.value)} /></Field>
              <Field label="Mutaxassisligi"><TextInput value={editing.specialty ?? ""} onChange={(e) => set("specialty", e.target.value)} /></Field>
              <Field label="Tajriba"><TextInput value={editing.experience ?? ""} onChange={(e) => set("experience", e.target.value)} placeholder="masalan: 5 yil" /></Field>
              <Field label="Telefon"><TextInput value={editing.phone ?? ""} onChange={(e) => set("phone", e.target.value)} /></Field>
              <Field label="Jinsi">
                <Select value={editing.gender ?? "erkak"} onChange={(e) => set("gender", e.target.value as "erkak" | "ayol")}>
                  <option value="erkak">Erkak</option>
                  <option value="ayol">Ayol</option>
                </Select>
              </Field>
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-charcoal-soft">Tarjimai hol (bio)</span>
                <button onClick={generateBio} disabled={aiBusy} className="inline-flex items-center gap-1 text-xs text-jade transition hover:text-jade-deep disabled:opacity-60">
                  {aiBusy ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} AI yozsin
                </button>
              </div>
              <TextArea rows={3} value={editing.bio ?? ""} onChange={(e) => set("bio", e.target.value)} />
            </div>
            <MediaUpload label="O'qituvchi rasmi" value={editing.image ?? ""} onChange={(v) => set("image", v)} />
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
