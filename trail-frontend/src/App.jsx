import { useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/hero/Hero";
import Section1Marquee from "./components/hero/Section1Marquee";
import Section2 from "./components/section2/Section2";
import Section3 from "./components/section3/Section3";
import Section4 from "./components/Section4/Section4";
import FAQ from "./components/Faq/FAQ"; 
import Footer from "./components/footer/Footer"; 
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

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

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

      <Section4 />

      <FAQ />

      <Footer/>
    </div>
  );
};

export default App;