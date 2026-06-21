import { useState } from "react";
import { Save, Loader2, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { api } from "../../api/client";
import { Field, TextInput, TextArea, Select } from "../ui/AdminField";
import MediaUpload from "../ui/MediaUpload";
import type { Branch, FeatureItem, PricingPlan, ReviewItem, SchoolSettings } from "../../types";

const ICON_OPTIONS = ["GraduationCap", "Laptop", "Users", "TrendingUp", "BookOpen", "Award", "Globe", "Sparkles"];
const MAX_FEATURES = 4;

export default function SettingsPanel({
  settings,
  onSaved,
}: {
  settings: SchoolSettings;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<SchoolSettings>(settings);
  const [baseline, setBaseline] = useState(() => JSON.stringify(settings));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof SchoolSettings>(key: K, value: SchoolSettings[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const setFeature = (id: string, patch: Partial<FeatureItem>) =>
    set("features", form.features.map((f) => (f.id === id ? { ...f, ...patch } : f)));

  const addFeature = () =>
    set("features", [
      ...form.features,
      { id: `feat_${Date.now()}`, title: "Yangi afzallik", desc: "", icon: "Sparkles" },
    ]);

  const removeFeature = (id: string) => set("features", form.features.filter((f) => f.id !== id));

  // ---- String-list helpers (gallery, partners) ----
  const addStr = (key: "gallery" | "partners") => set(key, [...(form[key] ?? []), ""]);
  const setStr = (key: "gallery" | "partners", idx: number, val: string) =>
    set(key, (form[key] ?? []).map((x, i) => (i === idx ? val : x)));
  const delStr = (key: "gallery" | "partners", idx: number) =>
    set(key, (form[key] ?? []).filter((_, i) => i !== idx));

  // ---- Branches ----
  const branches = form.branches ?? [];
  const addBranch = () =>
    set("branches", [...branches, { id: `br_${Date.now()}`, name: "", address: "", phone: "", mapsUrl: "" }]);
  const setBranch = (id: string, patch: Partial<Branch>) =>
    set("branches", branches.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  const delBranch = (id: string) => set("branches", branches.filter((b) => b.id !== id));

  // ---- Pricing ----
  const pricing = form.pricing ?? [];
  const addPlan = () =>
    set("pricing", [
      ...pricing,
      { id: `p_${Date.now()}`, name: "", price: "", period: "oy", features: [], highlighted: false },
    ]);
  const setPlan = (id: string, patch: Partial<PricingPlan>) =>
    set("pricing", pricing.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const delPlan = (id: string) => set("pricing", pricing.filter((p) => p.id !== id));

  // ---- Reviews ----
  const reviews = form.reviews ?? [];
  const addReview = () =>
    set("reviews", [...reviews, { id: `rv_${Date.now()}`, name: "", role: "", text: "", rating: 5, avatar: "" }]);
  const setReview = (id: string, patch: Partial<ReviewItem>) =>
    set("reviews", reviews.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const delReview = (id: string) => set("reviews", reviews.filter((r) => r.id !== id));

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      await api.put("/settings", form, true);
      setBaseline(JSON.stringify(form));
      setSaved(true);
      onSaved();
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Saqlashda xatolik");
    } finally {
      setSaving(false);
    }
  };

  const isDirty = JSON.stringify(form) !== baseline;
  const featuresFull = form.features.length >= MAX_FEATURES;

  return (
    <div className="space-y-6">
      {/* Brand */}
      <section className="card-soft rounded-2xl p-6">
        <h3 className="font-display mb-4 font-bold text-charcoal">Brend ma'lumotlari</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Markaz nomi">
            <TextInput value={form.name} onChange={(e) => set("name", e.target.value)} />
          </Field>
          <Field label="Logo matni">
            <TextInput value={form.logoText} onChange={(e) => set("logoText", e.target.value)} />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Biz haqimizda matni">
            <TextArea rows={3} value={form.aboutText} onChange={(e) => set("aboutText", e.target.value)} />
          </Field>
        </div>
        <div className="mt-4">
          <MediaUpload label="Logo rasmi (ixtiyoriy — bo'sh bo'lsa nom+ikonka chiqadi)" value={form.logoImage ?? ""} onChange={(v) => set("logoImage", v)} />
        </div>
      </section>

      {/* Hero */}
      <section className="card-soft rounded-2xl p-6">
        <h3 className="font-display mb-4 font-bold text-charcoal">Bosh sahifa (Hero)</h3>
        <div className="grid gap-4">
          <Field label="Sarlavha">
            <TextInput value={form.heroTitle} onChange={(e) => set("heroTitle", e.target.value)} />
          </Field>
          <Field label="Tagsarlavha">
            <TextArea rows={2} value={form.heroSubtitle} onChange={(e) => set("heroSubtitle", e.target.value)} />
          </Field>
          <Field label="Fon turi" hint="Video tanlansa va to'g'ri video fayl yuklansa, hero'da video chiqadi.">
            <Select
              value={form.heroMediaType ?? "image"}
              onChange={(e) => set("heroMediaType", e.target.value as "image" | "video")}
            >
              <option value="image">Rasm</option>
              <option value="video">Video</option>
            </Select>
          </Field>
          <MediaUpload label="Fon rasmi" value={form.heroBgImage} onChange={(v) => set("heroBgImage", v)} />
          <MediaUpload
            label="Fon videosi (mp4 / webm)"
            kind="media"
            value={form.heroVideoUrl ?? ""}
            onChange={(v) => set("heroVideoUrl", v)}
          />
          <MediaUpload
            label="«Biz haqimizda» bo'limi rasmi"
            value={form.aboutImage ?? ""}
            onChange={(v) => set("aboutImage", v)}
          />
        </div>
      </section>

      {/* Contact & social */}
      <section className="card-soft rounded-2xl p-6">
        <h3 className="font-display mb-4 font-bold text-charcoal">Aloqa va ijtimoiy tarmoqlar</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Telefon"><TextInput value={form.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
          <Field label="Email"><TextInput value={form.email} onChange={(e) => set("email", e.target.value)} /></Field>
          <Field label="Manzil"><TextInput value={form.address} onChange={(e) => set("address", e.target.value)} /></Field>
          <Field label="Google Maps havolasi"><TextInput value={form.mapsUrl} onChange={(e) => set("mapsUrl", e.target.value)} /></Field>
          <Field label="Telegram"><TextInput value={form.telegram} onChange={(e) => set("telegram", e.target.value)} /></Field>
          <Field label="Instagram"><TextInput value={form.instagram} onChange={(e) => set("instagram", e.target.value)} /></Field>
          <Field label="Facebook"><TextInput value={form.facebook} onChange={(e) => set("facebook", e.target.value)} /></Field>
          <Field label="YouTube"><TextInput value={form.youtube} onChange={(e) => set("youtube", e.target.value)} /></Field>
          <Field label="WhatsApp raqami" hint="Faqat raqamlar, masalan: 998901234567">
            <TextInput value={form.whatsapp ?? ""} onChange={(e) => set("whatsapp", e.target.value)} />
          </Field>
        </div>
      </section>

      {/* Features */}
      <section className="card-soft rounded-2xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display font-bold text-charcoal">
            Afzalliklar <span className="text-xs font-normal text-stone-500">({form.features.length}/{MAX_FEATURES})</span>
          </h3>
          <button
            onClick={addFeature}
            disabled={featuresFull}
            title={featuresFull ? `Maksimal ${MAX_FEATURES} ta afzallik` : "Afzallik qo'shish"}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition ${
              featuresFull ? "cursor-not-allowed border border-black/5 text-stone-400" : "btn-outline"
            }`}
          >
            <Plus size={14} /> Qo'shish
          </button>
        </div>
        <div className="space-y-4">
          {form.features.map((feature) => (
            <div key={feature.id} className="rounded-xl border border-black/10 bg-cream-soft p-4">
              <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <Field label="Sarlavha">
                  <TextInput value={feature.title} onChange={(e) => setFeature(feature.id, { title: e.target.value })} />
                </Field>
                <Field label="Ikonka">
                  <Select value={feature.icon} onChange={(e) => setFeature(feature.id, { icon: e.target.value })}>
                    {ICON_OPTIONS.map((icon) => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </Select>
                </Field>
                <div className="flex items-end">
                  <button
                    onClick={() => removeFeature(feature.id)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/12 text-rose-600 transition hover:bg-rose-500/20"
                    aria-label="O'chirish"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="mt-3">
                <Field label="Tavsif">
                  <TextArea rows={2} value={feature.desc} onChange={(e) => setFeature(feature.id, { desc: e.target.value })} />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="card-soft rounded-2xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display font-bold text-charcoal">Galereya rasmlari</h3>
          <button onClick={() => addStr("gallery")} className="btn-outline inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs">
            <Plus size={14} /> Qo'shish
          </button>
        </div>
        <div className="space-y-3">
          {(form.gallery ?? []).map((img, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex-1">
                <MediaUpload value={img} onChange={(v) => setStr("gallery", i, v)} />
              </div>
              <button onClick={() => delStr("gallery", i)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/12 text-rose-600 transition hover:bg-rose-500/20">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {(form.gallery ?? []).length === 0 && <p className="text-sm text-stone-500">Hozircha rasm yo'q.</p>}
        </div>
      </section>

      {/* Partner logos */}
      <section className="card-soft rounded-2xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display font-bold text-charcoal">Hamkor / sertifikat logolari</h3>
          <button onClick={() => addStr("partners")} className="btn-outline inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs">
            <Plus size={14} /> Qo'shish
          </button>
        </div>
        <div className="space-y-3">
          {(form.partners ?? []).map((img, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex-1">
                <MediaUpload value={img} onChange={(v) => setStr("partners", i, v)} />
              </div>
              <button onClick={() => delStr("partners", i)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/12 text-rose-600 transition hover:bg-rose-500/20">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {(form.partners ?? []).length === 0 && <p className="text-sm text-stone-500">Hozircha logo yo'q.</p>}
        </div>
      </section>

      {/* Branches */}
      <section className="card-soft rounded-2xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display font-bold text-charcoal">Filiallar</h3>
          <button onClick={addBranch} className="btn-outline inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs">
            <Plus size={14} /> Qo'shish
          </button>
        </div>
        <div className="space-y-4">
          {branches.map((b) => (
            <div key={b.id} className="rounded-xl border border-black/10 bg-cream-soft p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Filial nomi"><TextInput value={b.name} onChange={(e) => setBranch(b.id, { name: e.target.value })} /></Field>
                <Field label="Telefon"><TextInput value={b.phone} onChange={(e) => setBranch(b.id, { phone: e.target.value })} /></Field>
                <Field label="Manzil"><TextInput value={b.address} onChange={(e) => setBranch(b.id, { address: e.target.value })} /></Field>
                <Field label="Google Maps havolasi"><TextInput value={b.mapsUrl} onChange={(e) => setBranch(b.id, { mapsUrl: e.target.value })} /></Field>
              </div>
              <button onClick={() => delBranch(b.id)} className="mt-3 inline-flex items-center gap-1.5 text-xs text-rose-600 hover:underline">
                <Trash2 size={13} /> O'chirish
              </button>
            </div>
          ))}
          {branches.length === 0 && <p className="text-sm text-stone-500">Hozircha filial yo'q.</p>}
        </div>
      </section>

      {/* Pricing */}
      <section className="card-soft rounded-2xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display font-bold text-charcoal">Narxlar / paketlar</h3>
          <button onClick={addPlan} className="btn-outline inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs">
            <Plus size={14} /> Qo'shish
          </button>
        </div>
        <div className="space-y-4">
          {pricing.map((p) => (
            <div key={p.id} className="rounded-xl border border-black/10 bg-cream-soft p-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="Paket nomi"><TextInput value={p.name} onChange={(e) => setPlan(p.id, { name: e.target.value })} /></Field>
                <Field label="Narxi"><TextInput value={p.price} onChange={(e) => setPlan(p.id, { price: e.target.value })} /></Field>
                <Field label="Davri"><TextInput value={p.period} onChange={(e) => setPlan(p.id, { period: e.target.value })} placeholder="oy" /></Field>
              </div>
              <div className="mt-3">
                <Field label="Imkoniyatlar (har qatorga bittadan)">
                  <TextArea
                    rows={3}
                    value={p.features.join("\n")}
                    onChange={(e) => setPlan(p.id, { features: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
                  />
                </Field>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-charcoal">
                  <input
                    type="checkbox"
                    checked={!!p.highlighted}
                    onChange={(e) => setPlan(p.id, { highlighted: e.target.checked })}
                    className="h-4 w-4 accent-caramel"
                  />
                  Ommabop (ajratib ko'rsatish)
                </label>
                <button onClick={() => delPlan(p.id)} className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:underline">
                  <Trash2 size={13} /> O'chirish
                </button>
              </div>
            </div>
          ))}
          {pricing.length === 0 && <p className="text-sm text-stone-500">Hozircha paket yo'q.</p>}
        </div>
      </section>

      {/* Reviews */}
      <section className="card-soft rounded-2xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display font-bold text-charcoal">Mijozlar fikri (sharhlar)</h3>
          <button onClick={addReview} className="btn-outline inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs">
            <Plus size={14} /> Qo'shish
          </button>
        </div>
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-xl border border-black/10 bg-cream-soft p-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="Ism"><TextInput value={r.name} onChange={(e) => setReview(r.id, { name: e.target.value })} /></Field>
                <Field label="Mavqe / kurs"><TextInput value={r.role} onChange={(e) => setReview(r.id, { role: e.target.value })} /></Field>
                <Field label="Reyting (1-5)">
                  <TextInput type="number" min={1} max={5} value={r.rating} onChange={(e) => setReview(r.id, { rating: Math.max(1, Math.min(5, Number(e.target.value) || 5)) })} />
                </Field>
              </div>
              <div className="mt-3">
                <Field label="Fikr matni">
                  <TextArea rows={2} value={r.text} onChange={(e) => setReview(r.id, { text: e.target.value })} />
                </Field>
              </div>
              <div className="mt-3">
                <MediaUpload label="Foto (ixtiyoriy)" value={r.avatar ?? ""} onChange={(v) => setReview(r.id, { avatar: v })} />
              </div>
              <button onClick={() => delReview(r.id)} className="mt-3 inline-flex items-center gap-1.5 text-xs text-rose-600 hover:underline">
                <Trash2 size={13} /> O'chirish
              </button>
            </div>
          ))}
          {reviews.length === 0 && <p className="text-sm text-stone-500">Hozircha sharh yo'q.</p>}
        </div>
      </section>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <div className="sticky bottom-4 flex items-center justify-end gap-3">
        {!isDirty && !saved && <span className="text-xs text-stone-500">O'zgarish kiritilmagan</span>}
        <button
          onClick={save}
          disabled={saving || !isDirty}
          className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition ${
            isDirty ? "btn-primary shadow-soft" : "cursor-not-allowed bg-black/5 text-stone-400"
          }`}
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
          {saved ? "Saqlandi" : "O'zgarishlarni saqlash"}
        </button>
      </div>
    </div>
  );
}
