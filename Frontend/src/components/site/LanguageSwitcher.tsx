import { useState } from "react";
import { Languages, Check } from "lucide-react";
import type { Language } from "../../types";

const LANGS: { code: Language; label: string }[] = [
  { code: "uz", label: "O'zbekcha" },
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" },
];

export default function LanguageSwitcher({
  lang,
  onChange,
}: {
  lang: Language;
  onChange: (lang: Language) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="flex items-center gap-1.5 rounded-full glass px-3 py-2 text-xs font-bold uppercase text-slate-200 transition hover:text-neon-cyan"
        aria-label="Tilni o'zgartirish"
      >
        <Languages size={15} />
        {lang}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 overflow-hidden rounded-xl glass-strong p-1 shadow-2xl">
          {LANGS.map((item) => (
            <button
              key={item.code}
              onClick={() => {
                onChange(item.code);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10"
            >
              {item.label}
              {lang === item.code && <Check size={14} className="text-neon-cyan" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
