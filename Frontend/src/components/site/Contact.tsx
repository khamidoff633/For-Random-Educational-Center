import type React from "react";
import { useState } from "react";
import { Phone, Mail, MapPin, Send, Loader2, CheckCircle2, Clock } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import { api } from "../../api/client";
import type { SchoolSettings } from "../../types";
import type { UIKey } from "../../i18n";

const inputCls =
  "w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-charcoal outline-none transition focus:border-caramel";

export default function Contact({
  settings,
  t,
}: {
  settings: SchoolSettings;
  t: (key: UIKey) => string;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+998 ");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || phone.replace(/\D/g, "").length < 9) {
      setError(t("formPhone"));
      return;
    }
    setLoading(true);
    try {
      await api.post("/leads", {
        studentName: name.trim(),
        phone: phone.trim(),
        courseId: "",
        notes: "Aloqa bo'limidan",
      });
      setSuccess(true);
      setName("");
      setPhone("+998 ");
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xatolik");
    } finally {
      setLoading(false);
    }
  };

  const info = [
    { icon: <Phone size={18} />, label: settings.phone, href: `tel:${settings.phone}` },
    { icon: <Mail size={18} />, label: settings.email, href: `mailto:${settings.email}` },
    { icon: <MapPin size={18} />, label: settings.address, href: settings.mapsUrl || "#" },
  ];

  return (
    <section className="mx-auto w-[92%] max-w-7xl py-24">
      <SectionHeading eyebrow={t("contactBadge")} title={t("contactTitle")} />

      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Info card (espresso) */}
        <Reveal>
          <div className="flex h-full flex-col justify-between rounded-3xl bg-navy p-8 text-cream shadow-soft-lg">
            <div className="space-y-5">
              {info.map((row, i) => (
                <a key={i} href={row.href} className="flex items-center gap-4 transition hover:text-caramel">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-caramel">
                    {row.icon}
                  </span>
                  <span className="text-sm text-cream/90">{row.label}</span>
                </a>
              ))}
            </div>
            <div className="mt-8 flex items-center gap-2 border-t border-white/10 pt-6 text-sm text-cream/70">
              <Clock size={16} className="text-caramel" /> Dush–Shan: 09:00 – 20:00
            </div>
          </div>
        </Reveal>

        {/* Quick form */}
        <Reveal delay={0.1}>
          <form onSubmit={submit} className="card-soft flex h-full flex-col justify-center gap-4 rounded-3xl p-8">
            {success ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <CheckCircle2 size={48} className="text-emerald-500" />
                <p className="font-display text-lg font-bold text-charcoal">{t("formSuccess")}</p>
              </div>
            ) : (
              <>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("formName")} className={inputCls} />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t("formPhone")}
                  inputMode="tel"
                  className={inputCls}
                />
                {error && <p className="text-sm text-rose-600">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary inline-flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm disabled:opacity-60"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  {loading ? t("formSending") : t("formSubmit")}
                </button>
              </>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
