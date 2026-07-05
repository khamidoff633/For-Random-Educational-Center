import { Send } from "lucide-react";
import type { SchoolSettings } from "../../types";

/** Fixed bottom-right quick-contact button (Telegram only, directed to user's account). */
export default function FloatingContact({ settings }: { settings?: SchoolSettings }) {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
      <a
        href="https://t.me/bakhridd1n_dev"
        target="_blank"
        rel="noreferrer"
        aria-label="Telegram"
        className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-caramel text-white shadow-soft-lg transition hover:-translate-y-0.5 hover:brightness-110"
      >
        <Send size={20} />
      </a>
    </div>
  );
}
