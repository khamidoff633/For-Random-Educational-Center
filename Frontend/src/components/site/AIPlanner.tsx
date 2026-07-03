import type React from "react";
import { useState } from "react";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import { api } from "../../api/client";
import { renderMarkdown } from "../../lib/markdown";
import type { UIKey } from "../../i18n";

const LEVELS = ["Beginner (A1)", "Elementary (A2)", "Intermediate (B1)", "Upper-Intermediate (B2)", "Advanced (C1)"];
const GOALS = ["IELTS 6.5", "IELTS 7.5", "IELTS 8.0+", "CEFR C1", "SAT", "Speaking fluency"];

const inputCls =
  "w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-charcoal outline-none transition focus:border-caramel";

export default function AIPlanner({ t }: { t: (key: UIKey) => string }) {
  const [name, setName] = useState("");
  const [level, setLevel] = useState(LEVELS[2]);
  const [goal, setGoal] = useState(GOALS[1]);
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPlan("");
    try {
      const { text } = await api.post<{ text: string }>("/ai/study-plan", {
        name,
        currentLevel: level,
        targetGoal: goal,
      });
      setPlan(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="planner" className="mx-auto w-[92%] max-w-5xl py-24">
      <SectionHeading eyebrow={t("plannerBadge")} title={t("plannerTitle")} description={t("plannerDesc")} />

      <Reveal className="mt-12">
        <div className="card-soft grid gap-8 rounded-3xl p-6 sm:p-8 lg:grid-cols-2">
          <form onSubmit={submit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal-soft">
                {t("plannerName")}
              </label>
              <input value={name} onChange={(e) => setName(e.target.value)} required className={inputCls} placeholder="Ism" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal-soft">
                {t("plannerLevel")}
              </label>
              <select value={level} onChange={(e) => setLevel(e.target.value)} className={inputCls}>
                {LEVELS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal-soft">
                {t("plannerGoal")}
              </label>
              <select value={goal} onChange={(e) => setGoal(e.target.value)} className={inputCls}>
                {GOALS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary mt-2 inline-flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm disabled:opacity-60"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {loading ? t("plannerGenerating") : t("plannerGenerate")}
            </button>
          </form>

          <div className="min-h-[16rem] rounded-2xl border border-black/10 bg-cream p-5">
            {error && (
              <div className="flex items-start gap-2 text-sm text-rose-600">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                {error}
              </div>
            )}
            {!error && !plan && !loading && (
              <div className="flex h-full flex-col items-center justify-center text-center text-charcoal-soft">
                <Sparkles size={36} className="mb-3 text-caramel/50" />
                <p className="text-sm">{t("plannerDesc")}</p>
              </div>
            )}
            {loading && (
              <div className="flex h-full items-center justify-center text-charcoal-soft">
                <Loader2 size={28} className="animate-spin text-caramel" />
              </div>
            )}
            {plan && <div className="markdown max-h-[28rem] overflow-y-auto pr-2">{renderMarkdown(plan)}</div>}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
