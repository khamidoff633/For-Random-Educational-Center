import type React from "react";
import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import Modal from "../ui/Modal";
import { api } from "../../api/client";
import type { Course } from "../../types";
import type { UIKey } from "../../i18n";

export default function AdmissionForm({
  open,
  onClose,
  courses,
  initialCourseId,
  t,
}: {
  open: boolean;
  onClose: () => void;
  courses: Course[];
  initialCourseId?: string;
  t: (key: UIKey) => string;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+998 ");
  const [courseId, setCourseId] = useState(initialCourseId ?? "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setCourseId(initialCourseId ?? "");
      setSuccess(false);
      setError("");
    }
  }, [open, initialCourseId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError(t("formName"));
    if (phone.replace(/\D/g, "").length < 9) return setError(t("formPhone"));

    setLoading(true);
    try {
      const course = courses.find((c) => c.id === courseId);
      await api.post("/leads", {
        studentName: name.trim(),
        phone: phone.trim(),
        courseId,
        notes: course ? `Tanlangan kurs: ${course.name}` : "Sayt formasidan",
      });
      setSuccess(true);
      setName("");
      setPhone("+998 ");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      {success ? (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <CheckCircle2 size={56} className="text-emerald-400" />
          <h3 className="text-xl font-bold text-white">{t("formSuccess")}</h3>
          <button onClick={onClose} className="btn-ghost rounded-full px-6 py-2.5 text-sm">
            {t("close")}
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div>
            <h3 className="text-xl font-bold text-white">{t("admissionTitle")}</h3>
            <p className="mt-1 text-sm text-slate-400">{t("admissionDesc")}</p>
          </div>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("formName")}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-neon-cyan"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t("formPhone")}
            inputMode="tel"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-neon-cyan"
          />
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-neon-cyan"
          >
            <option value="" className="bg-ink-800">
              {t("formCourse")}
            </option>
            {courses.map((c) => (
              <option key={c.id} value={c.id} className="bg-ink-800">
                {c.name}
              </option>
            ))}
          </select>

          {error && <p className="text-sm text-rose-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-neon inline-flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm disabled:opacity-60"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            {loading ? t("formSending") : t("formSubmit")}
          </button>
        </form>
      )}
    </Modal>
  );
}
