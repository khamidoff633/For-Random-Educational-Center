import { useState } from "react";

interface AvatarProps {
  name: string;
  src?: string;
  /** Sizing + shape utilities, e.g. "h-16 w-16 rounded-full". */
  className?: string;
  /** Initials font-size utility, e.g. "text-2xl". */
  fontClass?: string;
}

/** Derives up to two uppercase initials from a name. */
function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return parts
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Shows the provided image, or a clean initials avatar (gradient + initials)
 * when there is no image or it fails to load — never a random stranger photo.
 */
export default function Avatar({ name, src, className = "", fontClass = "text-xl" }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;

  if (showImage) {
    return (
      <img
        src={src}
        alt={name}
        loading="lazy"
        onError={() => setFailed(true)}
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-caramel to-caramel-deep ${className}`}
      aria-label={name}
    >
      <span className={`font-display font-extrabold text-white ${fontClass}`}>{initialsOf(name)}</span>
    </div>
  );
}
