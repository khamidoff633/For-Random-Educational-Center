import { AnimatePresence, motion } from "motion/react";
import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import tornPaper from "../../assets/torn_paper.png";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Max-width utility class, e.g. "max-w-lg". */
  maxWidth?: string;
  /** "dark" for the admin glass theme, "light" for the public premium theme. */
  tone?: "dark" | "light";
}

/** Accessible, animated modal dialog. */
export default function Modal({ open, onClose, children, maxWidth = "max-w-lg", tone = "dark" }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const surface =
    tone === "light"
      ? "text-charcoal"
      : "glass-strong text-slate-100";
  const closeBtn =
    tone === "light"
      ? "text-caramel-deep hover:bg-caramel/10"
      : "text-slate-400 hover:bg-white/10 hover:text-white";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            className={`relative w-full ${maxWidth} max-h-[90vh] overflow-y-auto shadow-2xl ${surface} ${
              tone === "light" ? "p-10 pb-12" : "rounded-3xl p-6"
            }`}
            style={
              tone === "light"
                ? {
                    backgroundImage: `url(${tornPaper})`,
                    backgroundSize: "100% 100%",
                    backgroundRepeat: "no-repeat",
                    backgroundColor: "transparent",
                  }
                : undefined
            }
            initial={{ scale: 0.92, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            role="dialog"
            aria-modal="true"
          >
            <button
              onClick={onClose}
              className={`absolute rounded-full p-2 transition ${closeBtn} ${
                tone === "light" ? "right-9 top-9" : "right-4 top-4"
              }`}
              aria-label="Yopish"
            >
              <X size={18} />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
