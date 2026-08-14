import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ButtonTwo from "./ButtonTwo";
import HeroRight from "./HeroRight";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroSectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: heroSectionRef.current,
        start: "top top",
        end: "+=15%", 
        pin: true,
        pinSpacing: false,
      });
    }, heroSectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroSectionRef} className="w-full min-h-screen lg:h-screen px-6 pt-32 pb-10 md:px-10 lg:pt-[140px] lg:pb-12 font-inter bg-white flex flex-col justify-center">
      <div className="flex flex-col w-full lg:flex-row lg:justify-between lg:items-center">
        
        <div className="flex flex-col w-full max-w-[650px] lg:max-w-none mt-4 md:mt-8 lg:w-[45%] relative z-10">
          <img className="w-[25vw] sm:w-[18vw] md:w-[15vw] lg:w-[10vw] mb-4 lg:mb-2" src="/images/hero-images/trail-build-your-path-sticker.png" alt="" />

          <div className="flex flex-col gap-0">
            <h1 className="w-fit font-satoshi text-[12vw] sm:text-[9vw] md:text-7xl font-black leading-[0.9] tracking-tighter text-[#111827] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:font-exo hover:italic hover:text-transparent hover:[-webkit-text-stroke:2px_#111827] hover:translate-x-4 cursor-default">
              YOUR JOURNEY.
            </h1>
            <h1 className="w-fit font-satoshi text-[12vw] sm:text-[9vw] md:text-7xl font-black leading-[0.9] tracking-tighter text-[#9577F4] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:font-exo hover:italic hover:text-transparent hover:[-webkit-text-stroke:2px_#9577F4] hover:translate-x-4 cursor-default">
              YOUR ROADMAP.
            </h1>
            <h1 className="w-fit font-satoshi text-[12vw] sm:text-[9vw] md:text-7xl font-black leading-[0.9] tracking-tighter text-[#111827] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:font-exo hover:italic hover:text-transparent hover:[-webkit-text-stroke:2px_#111827] hover:translate-x-4 cursor-default">
              YOUR FUTURE.
            </h1>
          </div>

          <p className="w-full mt-6 text-sm leading-relaxed text-gray-600 sm:text-base md:w-4/5 font-inter">
            TRAIL helps you discover the right career path, learn the skills that
            matter, follow a structured roadmap and track your progress — all in
            one place.
          </p>

          <div className="mt-8 w-fit">
            <ButtonTwo text="EXPLORE YOUR ROADMAP" />
          </div>
        </div>

        <div className="flex items-center justify-center w-full mt-10 sm:mt-12 lg:w-[55%] lg:mt-0 relative z-0">
          <HeroRight />
        </div>
      </div>

      <hr className="my-8 sm:my-10 lg:my-10 border-t-[1px] border-stone-200" />

      <div className="grid w-full grid-cols-1 gap-8 sm:gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12 pb-4">
        
        <div className="flex flex-col gap-2 group cursor-default">
          <h4 className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-stone-400 uppercase font-exo transition-colors duration-300 group-hover:text-[#9577F4]">
            01 — DISCOVER
          </h4>
          <h5 className="text-base sm:text-lg font-semibold text-[#111827] transition-transform duration-300 font-satoshi group-hover:-translate-y-0.5">
            Find the right career path.
          </h5>
        </div>

        <div className="flex flex-col gap-2 group cursor-default">
          <h4 className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-stone-400 uppercase font-exo transition-colors duration-300 group-hover:text-[#9577F4]">
            02 — LEARN
          </h4>
          <h5 className="text-base sm:text-lg font-semibold text-[#111827] transition-transform duration-300 font-satoshi group-hover:-translate-y-0.5">
            Build the skills that matter.
          </h5>
        </div>

        <div className="flex flex-col gap-2 group cursor-default">
          <h4 className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-stone-400 uppercase font-exo transition-colors duration-300 group-hover:text-[#9577F4]">
            03 — BUILD
          </h4>
          <h5 className="text-base sm:text-lg font-semibold text-[#111827] transition-transform duration-300 font-satoshi group-hover:-translate-y-0.5">
            Follow your roadmap and build skills.
          </h5>
        </div>

        <div className="flex flex-col gap-2 group cursor-default">
          <h4 className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-stone-400 uppercase font-exo transition-colors duration-300 group-hover:text-[#9577F4]">
            04 — GROW
          </h4>
          <h5 className="text-base sm:text-lg font-semibold text-[#111827] transition-transform duration-300 font-satoshi group-hover:-translate-y-0.5">
            Track your progress and goals.
          </h5>
        </div>

      </div>
    </div>
  );
};

export default Hero;