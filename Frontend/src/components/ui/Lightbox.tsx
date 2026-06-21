import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface LightboxProps {
  images: string[];
  /** Active image index, or null when closed. */
  index: number | null;
  onClose: () => void;
  onChange: (index: number) => void;
}

/**
 * Full-screen image viewer with keyboard (Esc / ← / →) and on-screen
 * navigation. Wraps around at both ends. Locks body scroll while open.
 */
export default function Lightbox({ images, index, onClose, onChange }: LightboxProps) {
  const open = index !== null;
  const total = images.length;

  const go = useCallback(
    (dir: 1 | -1) => {
      if (index === null) return;
      onChange((index + dir + total) % total);
    },
    [index, total, onChange]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, go]);

  return (
    <AnimatePresence>
      {open && index !== null && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Espresso-tinted backdrop */}
          <div
            className="absolute inset-0 bg-[#1a120c]/90 backdrop-blur-md"
            onClick={onClose}
            aria-hidden
          />

          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Yopish"
            className="absolute right-5 top-5 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
          >
            <X size={20} />
          </button>

          {/* Counter */}
          <span className="absolute top-7 left-1/2 z-10 -translate-x-1/2 text-sm font-semibold tracking-widest text-white/70">
            {index + 1} / {total}
          </span>

          {/* Prev / Next */}
          {total > 1 && (
            <>
              <button
                onClick={() => go(-1)}
                aria-label="Oldingi"
                className="absolute left-3 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 sm:left-6"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => go(1)}
                aria-label="Keyingi"
                className="absolute right-3 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 sm:right-6"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Image */}
          <motion.img
            key={index}
            src={images[index]}
            alt=""
            className="relative z-[1] max-h-[85vh] max-w-[92vw] rounded-2xl object-contain shadow-2xl ring-1 ring-white/10"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
