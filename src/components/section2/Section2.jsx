import { useEffect, useRef, useState } from "react";
import { Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Section2Cylinder from "./Section2Cylinder";
import { EffectComposer, Bloom, ToneMapping } from "@react-three/postprocessing";
import { motion, AnimatePresence } from "motion/react";
import Section2Marquee from "./Section2Marquee";
import CareerSelector from "./CareerSelector";
import ButtonThree from "../buttons/ButtonThree";
import ButtonFour from "../buttons/ButtonFour";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: "20+", label: "Career Paths" },
  { value: "100+", label: "Roadmaps" },
  { value: "50K+", label: "Active Learners" },
];

const CAREER_COPY = {
  FRONTEND:
    "Explore career paths, discover the skills that matter, and find a roadmap built around your goals.",
  "FULL STACK":
    "Master both sides of the stack, from interfaces to infrastructure, with a roadmap that ties it all together.",
  "AI / ML":
    "Dive into machine learning and applied AI, guided by a roadmap built around real-world models.",
  "UI / UX":
    "Design experiences people love, with a roadmap focused on research, systems, and craft.",
  BACKEND:
    "Build the systems that power everything else, with a roadmap centered on architecture and scale.",
};

const Section2 = () => {
  const sectionRef = useRef(null);
  const [activeCareer, setActiveCareer] = useState("FRONTEND");

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
      className="relative flex min-h-svh w-full flex-col overflow-hidden rounded-t-3xl"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background:radial-gradient(circle_at_15%_20%,#6D3DF5_0,transparent_45%),radial-gradient(circle_at_85%_75%,#A855F7_0,transparent_40%)]" />

      <div className="relative mx-auto flex w-[92%] max-w-360 flex-1 flex-col">
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

            <div className="s2-reveal max-w-[440px]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={activeCareer}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="font-inter text-sm leading-relaxed text-[#64748B] md:text-base"
                >
                  {CAREER_COPY[activeCareer]}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="s2-reveal flex items-stretch divide-x divide-[#E5E7EB] py-1">
              {STATS.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`group flex flex-col gap-0.5 px-5 transition-transform duration-300 ease-out hover:-translate-y-1 ${
                    i === 0 ? "pl-0" : ""
                  }`}
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

            <div className="s2-reveal flex flex-row flex-wrap items-center gap-4 pt-1 md:gap-5">
              <ButtonThree text="START EXPLORING" />
              <ButtonFour text="SEE HOW IT WORKS" />
            </div>
          </div>

          <div className="flex h-full w-full flex-col items-center justify-center px-4 py-4 md:px-8 lg:py-0">
            <div className="s2-cylinder-stage relative aspect-square w-full max-w-[520px] h-[min(46vh,520px)] sm:h-[min(50vh,520px)] lg:h-[min(53vh,520px)]">
              <div className="animate-glow-pulse pointer-events-none absolute inset-0 [background:radial-gradient(circle,rgba(109,61,245,0.10),transparent_65%)]" />

              <motion.div
                className="relative h-full w-full"
                animate={{ y: [0, -10, 0], rotate: [0, 0.5, 0, -0.5, 0] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              >
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
              </motion.div>
            </div>
          </div>
        </div>

        <div className="s2-reveal-late flex w-full shrink-0 flex-col items-center gap-3 pb-2 pt-6">
          <span className="font-exo text-[10px] font-bold uppercase tracking-[0.3em] text-[#94A3B8] md:text-[11px]">
            Explore By Specialization
          </span>
          <CareerSelector active={activeCareer} onSelect={setActiveCareer} />
        </div>
      </div>

      <div className="s2-reveal-late mt-8 shrink-0 md:mt-12">
        <Section2Marquee />
      </div>
    </section>
  );
};

export default Section2;