import type { ReactNode } from "react";

/** Renders inline **bold** segments within a line. */
function renderInline(text: string): ReactNode[] {
  return text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
  );
}

/**
 * Minimal, safe Markdown renderer for AI output: headings (#, ##, ###),
 * bullet lists (-, *) and bold text. No raw HTML is ever injected.
 */
export function renderMarkdown(text: string): ReactNode {
  if (!text) return null;
  return text.split("\n").map((raw, idx) => {
    const line = raw.trim();
    if (!line) return null;
    if (line.startsWith("### ")) return <h3 key={idx}>{renderInline(line.slice(4))}</h3>;
    if (line.startsWith("## ")) return <h2 key={idx}>{renderInline(line.slice(3))}</h2>;
    if (line.startsWith("# ")) return <h2 key={idx}>{renderInline(line.slice(2))}</h2>;
    if (line.startsWith("- ") || line.startsWith("* "))
      return <li key={idx}>{renderInline(line.slice(2))}</li>;
    return <p key={idx}>{renderInline(line)}</p>;
  });
}
