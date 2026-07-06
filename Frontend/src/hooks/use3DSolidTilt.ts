import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Custom hook to add a clean, solid 3D tilt and gloss/glare effect on hover.
 * The card behaves as a solid laminated/glass object with shifting shadows and glare.
 */
export function use3DSolidTilt() {
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Limit rotation to 8 degrees for a subtle, high-end feel
      const rotateX = -(y / (rect.height / 2)) * 8;
      const rotateY = (x / (rect.width / 2)) * 8;

      // Rotate card and shift dynamic shadow in the opposite direction
      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        transformPerspective: 1000,
        scale: 1.02,
        boxShadow: `${-rotateY * 1.5}px ${rotateX * 1.5}px 25px rgba(0, 0, 0, 0.16)`,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });

      // Update the glare shine position dynamically
      const glare = card.querySelector(".card-glare");
      if (glare) {
        const pctX = ((e.clientX - rect.left) / rect.width) * 100;
        const pctY = ((e.clientY - rect.top) / rect.height) * 100;
        gsap.to(glare, {
          background: `radial-gradient(circle at ${pctX}% ${pctY}%, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0) 70%)`,
          duration: 0.25,
          overwrite: "auto",
        });
      }
    };

    const handleMouseLeave = () => {
      // Smoothly reset tilt and shadow back to base state
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.08)",
        duration: 0.6,
        ease: "elastic.out(1, 0.4)",
        overwrite: "auto",
      });

      const glare = card.querySelector(".card-glare");
      if (glare) {
        gsap.to(glare, {
          background: "none",
          duration: 0.4,
          overwrite: "auto",
        });
      }
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return cardRef;
}
