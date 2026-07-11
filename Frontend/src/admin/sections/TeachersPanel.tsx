import { useState } from "react";
import { Plus, Pencil, Trash2, Loader2, Sparkles, Save } from "lucide-react";
import { api } from "../../api/client";
import Modal from "../../components/ui/Modal";
import { Field, TextInput, TextArea, Select } from "../ui/AdminField";
import MediaUpload from "../ui/MediaUpload";
import Avatar from "../../components/ui/Avatar";
import type { Teacher } from "../../types";
import { Card, CardContent, Badge } from "../ui/ShadcnComponents";

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
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-charcoal">O'qituvchilar ({teachers.length})</h3>
        <button onClick={() => setEditing({ ...EMPTY })} className="btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm">
          <Plus size={16} /> Yangi o'qituvchi
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {teachers.map((teacher) => (
          <Card key={teacher.id} className="overflow-hidden flex flex-col h-full hover:-translate-y-0.5 transition-transform duration-300">
            <CardContent className="flex gap-4 p-5 flex-1">
              <Avatar
                name={teacher.name}
                src={teacher.image}
                fontClass="text-lg"
                className="h-16 w-16 shrink-0 rounded-xl border border-black/5"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-charcoal text-sm">{teacher.name}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <Badge variant="outline" className="text-[10px] font-bold py-0.5">
                    {teacher.specialty}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px] font-bold py-0.5">
                    {teacher.experience}
                  </Badge>
                </div>
              </div>
            </CardContent>
            <div className="flex border-t border-black/5 bg-cream-soft/10">
              <button onClick={() => setEditing(teacher)} className="flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-semibold text-charcoal-soft transition hover:bg-cream-soft/40 hover:text-caramel-deep border-r border-black/5">
                <Pencil size={13} /> Tahrirlash
              </button>
              <button onClick={() => remove(teacher.id)} className="flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-semibold text-charcoal-soft transition hover:bg-rose-50 hover:text-rose-600">
                <Trash2 size={13} /> O'chirish
              </button>
            </div>
          </Card>
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
