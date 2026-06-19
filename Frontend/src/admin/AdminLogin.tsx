import type React from "react";
import { useState, useEffect } from "react";
import { Loader2, Lock, Mail, ShieldCheck, ArrowLeft, KeyRound, RotateCw } from "lucide-react";
import { api, setToken } from "../api/client";

type Step = "credentials" | "otp";

export default function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [resent, setResent] = useState(false);

  // Countdown for the "resend code" button.
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const submitCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post<{ maskedEmail: string }>("/auth/login", { email, password });
      setMaskedEmail(res.maskedEmail);
      setStep("otp");
      setCooldown(45);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kirishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  // Resend a fresh code (reuses the stored credentials).
  const resend = async () => {
    if (cooldown > 0 || loading) return;
    setError("");
    setResent(false);
    try {
      await api.post("/auth/login", { email, password });
      setCooldown(45);
      setResent(true);
      setTimeout(() => setResent(false), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Qayta yuborishda xatolik");
    }
  };

  const submitOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post<{ token: string }>("/auth/verify", { email, code });
      setToken(res.token);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kod noto'g'ri");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-aurora flex min-h-screen items-center justify-center p-4">
      <div className="glass-strong w-full max-w-md rounded-3xl p-8 shadow-2xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-cyan to-neon-violet text-[#050510] shadow-[0_0_22px_rgba(34,211,238,0.5)]">
            <ShieldCheck size={26} />
          </span>
          <h1 className="mt-4 text-2xl font-black text-white">Admin Panel</h1>
          <p className="mt-1 text-sm text-slate-400">
            {step === "credentials"
              ? "Boshqaruv paneliga xavfsiz kirish"
              : "Emailingizga yuborilgan kodni kiriting"}
          </p>
        </div>

        {step === "credentials" ? (
          <form onSubmit={submitCredentials} className="flex flex-col gap-4">
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-neon-cyan"
              />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Parol"
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-neon-cyan"
              />
            </div>
            {error && <p className="text-sm text-rose-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="btn-neon inline-flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm disabled:opacity-60"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
              Davom etish
            </button>
          </form>
        ) : (
          <form onSubmit={submitOtp} className="flex flex-col gap-4">
            <p className="rounded-xl bg-white/5 px-4 py-3 text-center text-sm text-slate-300">
              Kod <span className="font-bold text-neon-cyan">{maskedEmail}</span> manziliga yuborildi
            </p>
            <div className="relative">
              <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                inputMode="numeric"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="6 xonali kod"
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-center text-lg font-bold tracking-[0.4em] text-white outline-none focus:border-neon-cyan"
              />
            </div>
            {error && <p className="text-sm text-rose-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="btn-neon inline-flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm disabled:opacity-60"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
              Tasdiqlash va kirish
            </button>
            {resent && (
              <p className="text-center text-xs text-emerald-400">Yangi kod yuborildi.</p>
            )}
            <button
              type="button"
              onClick={resend}
              disabled={cooldown > 0}
              className={`inline-flex items-center justify-center gap-1.5 text-xs transition ${
                cooldown > 0
                  ? "cursor-not-allowed text-slate-600"
                  : "text-neon-cyan hover:text-white"
              }`}
            >
              <RotateCw size={13} />
              {cooldown > 0 ? `Qayta yuborish (${cooldown}s)` : "Kodni qayta yuborish"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("credentials");
                setCode("");
                setError("");
              }}
              className="inline-flex items-center justify-center gap-1.5 text-xs text-slate-400 transition hover:text-white"
            >
              <ArrowLeft size={13} /> Orqaga
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
