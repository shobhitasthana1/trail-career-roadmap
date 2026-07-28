import React, { useEffect } from "react";
import Lenis from "lenis";

const App = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <main className="bg-black text-white">
      <section className="h-screen flex items-center justify-center border-b border-zinc-800">
        <h1 className="text-8xl font-bold">TRAIL</h1>
      </section>

      <section className="h-screen flex items-center justify-center border-b border-zinc-800">
        <h2 className="text-7xl font-semibold">Scroll Down</h2>
      </section>

      <section className="h-screen flex items-center justify-center border-b border-zinc-800">
        <h2 className="text-7xl font-semibold">Lenis Smooth Scroll</h2>
      </section>

      <section className="h-screen flex items-center justify-center">
        <h2 className="text-7xl font-semibold">Working</h2>
      </section>
    </main>
  );
};

export default App;