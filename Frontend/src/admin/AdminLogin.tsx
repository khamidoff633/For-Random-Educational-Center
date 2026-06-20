import type React from "react";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Loader2, Lock, Mail, ShieldCheck, ArrowLeft, KeyRound, Smartphone, Copy, Check } from "lucide-react";
import { api, setToken } from "../api/client";

type Step = "credentials" | "setup" | "code";

export default function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [ticket, setTicket] = useState("");
  const [otpauthUri, setOtpauthUri] = useState("");
  const [secret, setSecret] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post<{
        ticket: string;
        needsSetup: boolean;
        otpauthUri?: string;
        secret?: string;
      }>("/auth/login", { email, password });
      setTicket(res.ticket);
      if (res.needsSetup) {
        setOtpauthUri(res.otpauthUri ?? "");
        setSecret(res.secret ?? "");
        setStep("setup");
      } else {
        setStep("code");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kirishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const submitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post<{ token: string }>("/auth/verify", { ticket, code });
      setToken(res.token);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kod noto'g'ri");
    } finally {
      setLoading(false);
    }
  };

  const copySecret = async () => {
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const codeField = (
    <div className="relative">
      <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
      <input
        inputMode="numeric"
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
        placeholder="6 xonali kod"
        required
        autoFocus
        className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-center text-lg font-bold tracking-[0.4em] text-white outline-none focus:border-neon-cyan"
      />
    </div>
  );

  return (
    <div className="bg-aurora flex min-h-screen items-center justify-center p-4">
      <div className="glass-strong w-full max-w-md rounded-3xl p-8 shadow-2xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-cyan to-neon-violet text-[#050510] shadow-[0_0_22px_rgba(34,211,238,0.5)]">
            <ShieldCheck size={26} />
          </span>
          <h1 className="mt-4 text-2xl font-black text-white">Admin Panel</h1>
          <p className="mt-1 text-sm text-slate-400">
            {step === "credentials" && "Boshqaruv paneliga xavfsiz kirish"}
            {step === "setup" && "Authenticator ilovasini ulang"}
            {step === "code" && "Ilovadagi kodni kiriting"}
          </p>
        </div>

        {step === "credentials" && (
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
        )}

        {step === "setup" && (
          <form onSubmit={submitCode} className="flex flex-col gap-4">
            <ol className="space-y-1.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Smartphone size={13} className="text-neon-cyan" /> Google Authenticator ilovasini oching
              </li>
              <li>2. Quyidagi QR kodni skanerlang (yoki kalitni qo'lda kiriting)</li>
              <li>3. Ilovada chiqqan 6 xonali kodni pastga yozing</li>
            </ol>

            {otpauthUri && (
              <div className="mx-auto rounded-2xl bg-white p-3">
                <QRCodeSVG value={otpauthUri} size={168} level="M" />
              </div>
            )}

            <button
              type="button"
              onClick={copySecret}
              className="mx-auto inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs tracking-widest text-slate-200 transition hover:border-neon-cyan/50"
            >
              {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              {secret}
            </button>

            {codeField}
            {error && <p className="text-sm text-rose-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="btn-neon inline-flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm disabled:opacity-60"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
              Tasdiqlash va kirish
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

        {step === "code" && (
          <form onSubmit={submitCode} className="flex flex-col gap-4">
            <p className="rounded-xl bg-white/5 px-4 py-3 text-center text-sm text-slate-300">
              Authenticator ilovangizdagi joriy 6 xonali kodni kiriting
            </p>
            {codeField}
            {error && <p className="text-sm text-rose-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="btn-neon inline-flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm disabled:opacity-60"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
              Kirish
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
