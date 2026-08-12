import { useEffect, useRef } from "react";
import { Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Section2Cylinder from "./Section2Cylinder";
import { EffectComposer, Bloom, ToneMapping } from "@react-three/postprocessing";
import Marquee from "./Marquee";
import CareerSelector from "./CareerSelector";
import ButtonOne from "./ButtonOne";
import ButtonTwo from "./ButtonTwo";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: "20+", label: "Career Paths" },
  { value: "100+", label: "Roadmaps" },
  { value: "50K+", label: "Active Learners" },
];

const Section2 = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".s2-reveal",
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".s2-cylinder-stage",
        { opacity: 0, scale: 0.9, y: 24 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          delay: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".s2-reveal-late",
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
          delay: 0.35,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-white"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background:radial-gradient(circle_at_15%_20%,#6D3DF5_0,transparent_45%),radial-gradient(circle_at_85%_75%,#A855F7_0,transparent_40%)]" />

      <div className="relative mx-auto flex w-[92%] max-w-[1440px] flex-1 flex-col">
        <div className="grid w-full flex-1 grid-cols-1 items-center gap-4 pt-5 lg:grid-cols-[0.85fr_1.15fr] lg:gap-4 lg:pt-4">
          <div className="flex flex-col items-start gap-3 lg:max-w-[440px] lg:gap-4">
            <span className="s2-reveal flex items-center gap-2 font-exo text-[11px] font-bold uppercase tracking-[0.3em] text-[#6D3DF5] md:text-xs">
              Explore Your Path <span className="text-sm">✦</span>
            </span>

            <h2 className="s2-reveal font-satoshi text-[clamp(2.1rem,4vw,3.6rem)] font-black leading-[0.95] tracking-tight text-[#111827]">
              FIND YOUR
              <br />
              <span className="bg-gradient-to-r from-[#6D3DF5] to-[#A855F7] bg-clip-text text-transparent">
                PERFECT PATH.
              </span>
            </h2>

            <p className="s2-reveal max-w-[440px] font-inter text-sm leading-relaxed text-[#64748B] md:text-base">
              Explore career paths, discover the skills that matter, and find
              a roadmap built around your goals.
            </p>

            <div className="s2-reveal flex items-center gap-6 py-1 md:gap-8">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="group flex flex-col gap-0.5 transition-transform duration-300 ease-out hover:-translate-y-1"
                >
                  <span className="font-satoshi text-xl font-black text-[#6D3DF5] transition-colors duration-300 group-hover:text-[#A855F7] md:text-2xl">
                    {stat.value}
                  </span>
                  <span className="text-[10px] font-medium text-[#64748B] md:text-[11px]">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="s2-reveal flex flex-row flex-nowrap items-center gap-3 pt-1">
              <ButtonOne text="START EXPLORING →" />
              <ButtonTwo text="SEE HOW IT WORKS" />
            </div>
          </div>

          <div className="flex h-full w-full flex-col items-center justify-center py-4 lg:py-0">
            <div className="s2-cylinder-stage animate-float-slow relative aspect-square w-full max-w-[620px] h-[min(56vh,620px)] sm:h-[min(60vh,620px)] lg:h-[min(64vh,620px)]">
              <div className="animate-glow-pulse pointer-events-none absolute inset-0 [background:radial-gradient(circle,rgba(109,61,245,0.10),transparent_65%)]" />

              <Canvas
                camera={{ fov: 42, position: [0, 0, 10.5] }}
                dpr={[1, 2]}
                gl={{ alpha: true }}
              >
                <ambientLight intensity={0.6} />
                <directionalLight position={[4, 6, 5]} intensity={1.2} />
                <pointLight position={[-5, -2, -5]} intensity={0.35} color="#9577F4" />

                <Section2Cylinder />

                <Environment preset="studio" />

                <EffectComposer>
                  <Bloom
                    mipmapBlur
                    intensity={0.6}
                    luminanceThreshold={0.4}
                    luminanceSmoothing={0.4}
                  />
                  <ToneMapping adaptive />
                </EffectComposer>
              </Canvas>
            </div>
          </div>
        </div>

        <div className="s2-reveal-late flex w-full shrink-0 justify-center py-3">
          <CareerSelector />
        </div>
      </div>

      <div className="s2-reveal-late shrink-0">
        <Marquee />
      </div>
    </section>
  );
};

export default Section2;