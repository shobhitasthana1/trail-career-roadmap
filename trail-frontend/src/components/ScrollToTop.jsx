import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const ScrollToTop = ({ lenisRef }) => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    // 1. Immediately reset browser scroll before paint
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // 2. Immediately reset Lenis smooth scroll instance safely
    try {
      const lenis = lenisRef?.current || window.__lenis;
      if (lenis && typeof lenis.scrollTo === "function") {
        lenis.scrollTo(0, { immediate: true, force: true });
      }
    } catch (_err) {
      // safe fallback
    }

    // 3. Clear stale ScrollTrigger memory from previous route
    try {
      ScrollTrigger.clearScrollMemory();
    } catch (_err) {
      // safe fallback
    }

    // 4. Re-verify on next animation frames and short timeout to handle dynamic DOM paints
    const rafId = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      try {
        const l = lenisRef?.current || window.__lenis;
        if (l && typeof l.scrollTo === "function") {
          l.scrollTo(0, { immediate: true, force: true });
        }
        ScrollTrigger.refresh();
      } catch (_err) {
        // safe fallback
      }
    });

    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
      try {
        const l = lenisRef?.current || window.__lenis;
        if (l && typeof l.scrollTo === "function") {
          l.scrollTo(0, { immediate: true, force: true });
        }
        ScrollTrigger.refresh();
      } catch (_err) {
        // safe fallback
      }
    }, 50);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
    };
  }, [pathname, lenisRef]);

  return null;
};

export default ScrollToTop;
