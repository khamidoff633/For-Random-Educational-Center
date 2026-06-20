import type React from "react";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Loader2, Lock, Mail, ShieldCheck, ArrowLeft, KeyRound, Smartphone, Copy, Check } from "lucide-react";
import { api, setToken } from "../api/client";

type Step = "credentials" | "setup" | "code";

const fieldCls =
  "w-full rounded-xl border border-black/10 bg-white py-3 pl-10 pr-4 text-sm text-charcoal outline-none focus:border-caramel placeholder:text-stone-400";

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
      <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
      <input
        inputMode="numeric"
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
        placeholder="6 xonali kod"
        required
        autoFocus
        className="w-full rounded-xl border border-black/10 bg-white py-3 pl-10 pr-4 text-center text-lg font-bold tracking-[0.4em] text-charcoal outline-none focus:border-caramel"
      />
    </div>
  );

  return (
    <div className="bg-warm flex min-h-screen items-center justify-center p-4">
      <div className="card-soft w-full max-w-md rounded-3xl p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-caramel to-caramel-deep text-white shadow-soft">
            <ShieldCheck size={26} />
          </span>
          <h1 className="font-display mt-4 text-2xl font-extrabold text-charcoal">Admin Panel</h1>
          <p className="mt-1 text-sm text-charcoal-soft">
            {step === "credentials" && "Boshqaruv paneliga xavfsiz kirish"}
            {step === "setup" && "Authenticator ilovasini ulang"}
            {step === "code" && "Ilovadagi kodni kiriting"}
          </p>
        </div>

        {step === "credentials" && (
          <form onSubmit={submitCredentials} className="flex flex-col gap-4">
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className={fieldCls}
              />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Parol"
                required
                className={fieldCls}
              />
            </div>
            {error && <p className="text-sm text-rose-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary inline-flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm disabled:opacity-60"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
              Davom etish
            </button>
          </form>
        )}

        {step === "setup" && (
          <form onSubmit={submitCode} className="flex flex-col gap-4">
            <ol className="space-y-1.5 text-xs text-charcoal-soft">
              <li className="flex items-center gap-2">
                <Smartphone size={13} className="text-caramel" /> Google Authenticator ilovasini oching
              </li>
              <li>2. Quyidagi QR kodni skanerlang (yoki kalitni qo'lda kiriting)</li>
              <li>3. Ilovada chiqqan 6 xonali kodni pastga yozing</li>
            </ol>

            {otpauthUri && (
              <div className="mx-auto rounded-2xl border border-black/10 bg-white p-3">
                <QRCodeSVG value={otpauthUri} size={168} level="M" fgColor="#1c1a17" />
              </div>
            )}

            <button
              type="button"
              onClick={copySecret}
              className="mx-auto inline-flex items-center gap-2 rounded-lg border border-black/10 bg-cream-soft px-3 py-2 font-mono text-xs tracking-widest text-charcoal transition hover:border-caramel/50"
            >
              {copied ? <Check size={13} className="text-jade" /> : <Copy size={13} />}
              {secret}
            </button>

            {codeField}
            {error && <p className="text-sm text-rose-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary inline-flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm disabled:opacity-60"
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
              className="inline-flex items-center justify-center gap-1.5 text-xs text-charcoal-soft transition hover:text-charcoal"
            >
              <ArrowLeft size={13} /> Orqaga
            </button>
          </form>
        )}

        {step === "code" && (
          <form onSubmit={submitCode} className="flex flex-col gap-4">
            <p className="rounded-xl bg-cream-soft px-4 py-3 text-center text-sm text-charcoal-soft">
              Authenticator ilovangizdagi joriy 6 xonali kodni kiriting
            </p>
            {codeField}
            {error && <p className="text-sm text-rose-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary inline-flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm disabled:opacity-60"
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
              className="inline-flex items-center justify-center gap-1.5 text-xs text-charcoal-soft transition hover:text-charcoal"
            >
              <ArrowLeft size={13} /> Orqaga
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
