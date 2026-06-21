import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/** Appears after scrolling down; links to #top (smoothed by Lenis). */
export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <a
      href="#top"
      aria-label="Yuqoriga"
      className="fixed bottom-5 left-5 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-charcoal shadow-soft transition hover:-translate-y-0.5 hover:text-caramel-deep"
    >
      <ArrowUp size={18} />
    </a>
  );
}
