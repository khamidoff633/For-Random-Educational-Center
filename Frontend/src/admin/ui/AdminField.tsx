import type React from "react";
import type { ReactNode } from "react";

/** Labelled form field wrapper used across admin forms (light theme). */
export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal-soft">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-stone-500">{hint}</span>}
    </label>
  );
}

const baseInput =
  "w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm text-charcoal outline-none transition focus:border-caramel placeholder:text-stone-400";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${baseInput} ${props.className ?? ""}`} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${baseInput} resize-none ${props.className ?? ""}`} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const { children, className, ...rest } = props;
  return (
    <select {...rest} className={`${baseInput} ${className ?? ""}`}>
      {children}
    </select>
  );
}
