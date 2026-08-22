import React, { useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/hero/Hero";
import Section1Marquee from "./components/hero/Section1Marquee";
import Section2 from "./components/section2/Section2";
import Section3 from "./components/section3/Section3";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.2,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const rafCallback = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    // IMPORTANT: All child components (Hero, Section3, etc.) create their
    // ScrollTriggers inside their own useEffect hooks. Effects in child
    // components run BEFORE effects in their parent (React fires effects
    // bottom-up through the tree), so by the time this effect body runs,
    // Hero has already created its pinning ScrollTrigger and inserted its
    // pin-spacer into the DOM, and Section3 has already measured its
    // "top top" start against that final, correct layout.
    //
    // We still force an explicit refresh here as a safety net: it
    // re-measures every ScrollTrigger's start/end against the CURRENT
    // DOM after everything above has mounted, so any accumulated
    // rounding/layout drift (fonts loading, images loading, browser
    // reflow) gets corrected immediately rather than waiting for the
    // full page "load" event.
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    // A second, later refresh remains useful because Hero loads 300
    // canvas-sequence images and Section3 loads its own image
    // asynchronously; once everything (including fonts/images) has
    // fully loaded, dimensions can shift slightly, so we refresh again
    // on window "load" to lock in final, accurate trigger positions.
    const finalRefresh = () => ScrollTrigger.refresh();

    if (document.readyState === "complete") {
      setTimeout(finalRefresh, 500);
    } else {
      window.addEventListener("load", finalRefresh);
    }

    return () => {
      window.removeEventListener("load", finalRefresh);
      gsap.ticker.remove(rafCallback);
      lenis.destroy();
    };
  }, []);

  return (
    <div
      ref={scrollRef}
      className="w-full min-h-screen overflow-x-hidden bg-[#ffffff]"
    >
      <Navbar />

      <Hero />

      <Section1Marquee />

      <Section2 />

      <Section3 />
    </div>
  );
};

export default App;