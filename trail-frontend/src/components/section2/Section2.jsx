import { useEffect, useRef } from "react";
import { motion } from "motion/react";
// import Section2Marquee from "./Section2Marquee";
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

const Section2 = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".s2-reveal",
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".s2-cylinder-stage",
        { opacity: 0, scale: 0.95, x: 20 },
        {
          opacity: 1,
          scale: 1,
          x: 0,
          duration: 1.2,
          ease: "power3.out",
          delay: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".s2-reveal-late",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.15,
          delay: 0.4,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
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
      className="relative flex min-h-svh w-full flex-col overflow-hidden rounded-t-[2.5rem] bg-[#FAFAFA] pt-8"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background:radial-gradient(circle_at_10%_20%,#6D3DF5_0,transparent_50%),radial-gradient(circle_at_90%_80%,#A855F7_0,transparent_50%)]" />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(#6D3DF5 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          opacity: 0.2,
          maskImage:
            "radial-gradient(ellipse 60% 50% at 50% 50%, black 0%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 50% at 50% 50%, black 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto flex w-[90%] max-w-[1300px] flex-1 flex-col justify-center">
        <div className="grid w-full grid-cols-1 items-center gap-12 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8 lg:py-6">
          <div className="flex flex-col items-start gap-5 lg:max-w-[500px] lg:gap-6">
            <span className="s2-reveal flex items-center gap-3 rounded-full border border-[#6D3DF5]/20 bg-[#6D3DF5]/[0.03] px-4 py-1.5 font-exo text-[11px] font-bold uppercase tracking-[0.3em] text-[#6D3DF5] shadow-sm md:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#6D3DF5]" />
              Explore Your Path
            </span>

            <h2 className="s2-reveal font-satoshi text-[clamp(2.5rem,4.5vw,4.2rem)] font-black leading-[1.05] tracking-tight text-[#111827]">
              FIND YOUR
              <br />
              <span className="bg-gradient-to-r from-[#6D3DF5] to-[#A855F7] bg-clip-text text-transparent">
                PERFECT PATH.
              </span>
            </h2>

            <p className="s2-reveal max-w-[460px] font-inter text-[15px] leading-relaxed text-[#475569] md:text-[17px]">
              Explore career paths, uncover the skills that matter, and follow a roadmap built entirely around your goals.
            </p>

            <div className="s2-reveal grid w-full grid-cols-3 gap-3 pt-3 md:gap-5">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="group flex flex-col gap-1.5 rounded-2xl border border-white/60 bg-white/40 px-4 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.03)] backdrop-blur-md transition-all duration-400 ease-out hover:-translate-y-1.5 hover:bg-white/80 hover:shadow-[0_20px_40px_-15px_rgba(109,61,245,0.15)] md:px-5"
                >
                  <span className="h-1 w-8 rounded-full bg-gradient-to-r from-[#6D3DF5] to-[#A855F7] opacity-60 transition-all duration-300 group-hover:w-10 group-hover:opacity-100" />
                  <span className="mt-1 font-satoshi text-2xl font-black text-[#111827] transition-colors duration-300 group-hover:text-[#6D3DF5] md:text-3xl">
                    {stat.value}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B] md:text-xs">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="s2-reveal flex flex-row flex-wrap items-center gap-4 pt-4 md:gap-5">
              <ButtonThree text="START EXPLORING" />
              <ButtonFour text="SEE HOW IT WORKS" />
            </div>
          </div>

          <div className="flex h-full w-full flex-col items-center justify-center px-4 py-10 md:px-8 lg:translate-x-12 lg:py-0 xl:translate-x-20">
            <div className="s2-cylinder-stage relative aspect-square w-full max-w-[650px] h-[min(55vh,650px)] sm:h-[min(60vh,650px)] lg:h-[min(65vh,650px)]">
              <div className="animate-glow-pulse pointer-events-none absolute inset-0 scale-125 [background:radial-gradient(circle,rgba(109,61,245,0.12),transparent_60%)]" />

              <div className="pointer-events-none absolute -inset-8 rounded-full border border-dashed border-[#6D3DF5]/20 animate-[spin_80s_linear_infinite] md:-inset-12" />
              <div className="pointer-events-none absolute -inset-3 rounded-full border border-[#A855F7]/15 md:-inset-4" />

              <motion.div
                className="relative flex h-full w-full items-center justify-center"
                animate={{
                  y: [-15, 15, -15],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <motion.img
                  src="/images/section2-images/Section2-right.png"
                  alt="Trail Career Roadmap Illustration"
                  className="z-10 h-[95%] w-[95%] object-contain drop-shadow-[0_24px_48px_rgba(109,61,245,0.18)]"
                  initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{
                    duration: 1.4,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.1,
                  }}
                  whileHover={{ scale: 1.04, rotate: 1.5 }}
                />
              </motion.div>
            </div>
          </div>
        </div>

        <div className="s2-reveal-late flex items-center justify-center gap-4 pb-4 pt-8">
          <span className="h-px w-20 bg-gradient-to-r from-transparent to-[#6D3DF5]/30 md:w-32" />
          <span className="text-xs text-[#6D3DF5]/50">✦</span>
          <span className="h-px w-20 bg-gradient-to-l from-transparent to-[#6D3DF5]/30 md:w-32" />
        </div>
      </div>

      <div className="s2-reveal-late mt-8 shrink-0 md:mt-10">
        {/* <Section2Marquee /> */}
      </div>
    </section>
  );
};

export default Section2;