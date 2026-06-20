import { useRef, useState, useEffect } from "react";
import { Send, Loader2, Sparkles, Bot, User } from "lucide-react";
import { api } from "../../api/client";

interface Message {
  role: "user" | "ai";
  text: string;
  actions?: number;
}

const SUGGESTIONS = [
  "Admin panel qanday ishlaydi?",
  "Yangi IELTS kursi qo'sh, narxi 600 000 so'm",
  "Eng so'nggi arizalarni qanday ko'raman?",
  "Markaz telefon raqamini yangila",
];

export default function CopilotPanel({ onChanged }: { onChanged: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text:
        "Salom! Men Apex Academy AI yordamchisiman. Sizga panel qanday ishlashini tushuntiraman, " +
        "shuningdek kurs/o'qituvchi qo'shish, arizalarni boshqarish kabi amallarni bajara olaman. Nima qilamiz?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    const message = text.trim();
    if (!message || loading) return;
    setMessages((m) => [...m, { role: "user", text: message }]);
    setInput("");
    setLoading(true);
    try {
      const res = await api.post<{ reply: string; actions: unknown[]; dbModified: boolean }>(
        "/ai/copilot",
        { message },
        true
      );
      setMessages((m) => [...m, { role: "ai", text: res.reply, actions: res.actions?.length ?? 0 }]);
      if (res.dbModified) onChanged();
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "ai", text: err instanceof Error ? err.message : "Xatolik yuz berdi." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles size={18} className="text-jade" />
        <h3 className="font-display text-lg font-bold text-charcoal">AI Copilot</h3>
      </div>

      <div className="card-soft flex-1 space-y-4 overflow-y-auto rounded-2xl p-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <span
              className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                msg.role === "ai" ? "bg-caramel/15 text-caramel-deep" : "bg-black/5 text-charcoal-soft"
              }`}
            >
              {msg.role === "ai" ? <Bot size={16} /> : <User size={16} />}
            </span>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "ai" ? "bg-cream-soft text-charcoal" : "bg-caramel/12 text-charcoal"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
              {!!msg.actions && msg.actions > 0 && (
                <p className="mt-2 text-[11px] font-semibold text-jade">
                  {msg.actions} ta amal bajarildi
                </p>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-sm text-charcoal-soft">
            <Loader2 size={15} className="animate-spin" /> Yozmoqda...
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            disabled={loading}
            className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs text-charcoal-soft transition hover:text-caramel-deep disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="mt-3 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Buyruq yoki savol yozing..."
          className="flex-1 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-charcoal outline-none focus:border-caramel placeholder:text-stone-400"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="btn-primary inline-flex items-center justify-center rounded-xl px-5 disabled:opacity-50"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
