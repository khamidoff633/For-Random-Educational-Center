import { MessageCircle, Send } from "lucide-react";
import type { SchoolSettings } from "../../types";

/** Fixed bottom-right quick-contact buttons (WhatsApp + Telegram). */
export default function FloatingContact({ settings }: { settings: SchoolSettings }) {
  const whatsapp = (settings.whatsapp ?? "").replace(/\D/g, "");
  const telegram = settings.telegram ?? "";

  if (!whatsapp && !telegram) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
      {whatsapp && (
        <a
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noreferrer"
          aria-label="WhatsApp"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-jade text-white shadow-soft-lg transition hover:-translate-y-0.5 hover:brightness-110"
        >
          <MessageCircle size={22} />
        </a>
      )}
      {telegram && (
        <a
          href={telegram}
          target="_blank"
          rel="noreferrer"
          aria-label="Telegram"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-caramel text-white shadow-soft-lg transition hover:-translate-y-0.5 hover:brightness-110"
        >
          <Send size={20} />
        </a>
      )}
    </div>
  );
}
