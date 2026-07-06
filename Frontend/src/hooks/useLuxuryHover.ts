import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Custom hook to add a high-end luxury hover and click feedback loop.
 * On Hover: lifts the card slightly, expands a warm golden ambient glow, 
 * and sweeps a diagonal reflection sheen across the surface.
 * On Click: dynamically presses the card down with elastic recoil.
 */
export function useLuxuryHover() {
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Set initial custom golden ambient shadow and borders
    gsap.set(card, {
      scale: 1,
      y: 0,
      boxShadow: "0px 8px 24px rgba(220, 166, 75, 0.08)",
    });

    const handleMouseEnter = () => {
      // Lift the card and expand the golden ambient glow
      gsap.to(card, {
        y: -6,
        scale: 1.025,
        boxShadow: "0px 16px 36px rgba(220, 166, 75, 0.20)",
        duration: 0.4,
        ease: "power2.out",
      });

      // Sweep the glossy reflection sheet once across the card
      const glare = card.querySelector(".card-glare");
      if (glare) {
        gsap.fromTo(
          glare,
          { x: "-100%", opacity: 0 },
          { x: "100%", opacity: 0.15, duration: 0.8, ease: "power2.out" }
        );
      }
    };

    const handleMouseLeave = () => {
      // Softly return back to original state
      gsap.to(card, {
        y: 0,
        scale: 1,
        boxShadow: "0px 8px 24px rgba(220, 166, 75, 0.08)",
        duration: 0.5,
        ease: "power2.out",
      });
    };

    const handleMouseDown = () => {
      // Tactile physical press
      gsap.to(card, {
        scale: 0.97,
        boxShadow: "0px 4px 12px rgba(220, 166, 75, 0.04)",
        duration: 0.15,
        ease: "power2.out",
      });
    };

    const handleMouseUp = () => {
      // Elastic rebound bounce
      gsap.to(card, {
        scale: 1.025,
        boxShadow: "0px 16px 36px rgba(220, 166, 75, 0.20)",
        duration: 0.4,
        ease: "elastic.out(1, 0.4)",
      });
    };

    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);
    card.addEventListener("mousedown", handleMouseDown);
    card.addEventListener("mouseup", handleMouseUp);

    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
      card.removeEventListener("mousedown", handleMouseDown);
      card.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return cardRef;
}
