import { useRef, useState } from "react";
import { UploadCloud, Loader2, X } from "lucide-react";
import { uploadFile } from "../../api/client";

interface MediaUploadProps {
  value: string;
  onChange: (url: string) => void;
  /** "image" or "media" (image + video). */
  kind?: "image" | "media";
  label?: string;
}

/** Drag-or-click uploader that stores the file on the server and returns its URL. */
export default function MediaUpload({ value, onChange, kind = "image", label }: MediaUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const accept = kind === "media" ? "image/*,video/*" : "image/*";
  const isVideo = /\.(mp4|webm|mov)(\?|$)/i.test(value);

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const url = await uploadFile(file);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yuklashda xatolik");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      {label && (
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal-soft">
          {label}
        </span>
      )}
      <div className="flex items-center gap-3">
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border border-black/10 bg-cream-soft">
          {value ? (
            isVideo ? (
              <video src={value} className="h-full w-full object-cover" muted />
            ) : (
              <img src={value} alt="" className="h-full w-full object-cover" />
            )
          ) : (
            <div className="flex h-full w-full items-center justify-center text-stone-400">
              <UploadCloud size={20} />
            </div>
          )}
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white hover:bg-rose-500"
              aria-label="O'chirish"
            >
              <X size={12} />
            </button>
          )}
        </div>

        <div className="flex-1">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="btn-outline inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs disabled:opacity-60"
          >
            {busy ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
            {busy ? "Yuklanmoqda..." : "Fayl yuklash"}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="yoki URL kiriting"
            className="mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-xs text-charcoal outline-none focus:border-caramel placeholder:text-stone-400"
          />
          {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
