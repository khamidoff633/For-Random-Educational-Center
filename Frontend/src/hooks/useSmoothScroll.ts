import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Enables Lenis momentum smooth-scrolling for the whole window, and routes
 * in-page anchor links (e.g. the navbar) through Lenis for a smooth glide.
 * Respects reduced-motion and cleans up on unmount.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      // easeOutCubic — smooth deceleration toward the edges.
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Smooth-scroll in-page anchor links (offset for the fixed navbar).
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement | null)?.closest('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.length < 2) return;
      // Route hashes (e.g. "#/galereya") are not in-page anchors — let the
      // browser update the hash so the router can swap pages.
      if (href.startsWith("#/")) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target as HTMLElement, { offset: -90 });
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
}
