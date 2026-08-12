import React, { useRef } from "react";
import ButtonTwo from "./ButtonTwo";
// import HeroCanvas from "./HeroCanvas";

const Hero = () => {
  const heroSectionRef = useRef(null);

  return (
    <div ref={heroSectionRef} className="w-full px-6 pt-12 pb-12 md:px-10 md:pt-16 md:pb-20 font-inter">
      <div className="flex flex-col w-full lg:flex-row lg:justify-between">
        
        <div className="flex flex-col w-full max-w-[650px] mt-5 md:mt-10 lg:w-[55%]">
          <div className="flex flex-col gap-0">
            <h1 className="w-fit font-satoshi text-5xl font-black leading-[0.9] tracking-tighter text-[#111827] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] md:text-7xl hover:font-exo hover:italic hover:text-transparent hover:[-webkit-text-stroke:2px_#111827] hover:translate-x-4 cursor-default">
              YOUR JOURNEY.
            </h1>
            <h1 className="w-fit font-satoshi text-5xl font-black leading-[0.9] tracking-tighter text-[#9577F4] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] md:text-7xl hover:font-exo hover:italic hover:text-transparent hover:[-webkit-text-stroke:2px_#9577F4] hover:translate-x-4 cursor-default">
              YOUR ROADMAP.
            </h1>
            <h1 className="w-fit font-satoshi text-5xl font-black leading-[0.9] tracking-tighter text-[#111827] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] md:text-7xl hover:font-exo hover:italic hover:text-transparent hover:[-webkit-text-stroke:2px_#111827] hover:translate-x-4 cursor-default">
              YOUR FUTURE.
            </h1>
          </div>

          <p className="w-full mt-8 text-sm leading-relaxed text-gray-600 sm:w-4/5 md:text-base font-inter">
            TRAIL helps you discover the right career path, learn the skills that
            matter, follow a structured roadmap and track your progress — all in
            one place.
          </p>

          <div className="mt-8 w-fit">
            <ButtonTwo text="EXPLORE YOUR ROADMAP" />
          </div>
        </div>

        <div className="flex items-center justify-end w-full mt-10 lg:w-[45%] lg:mt-0">
          {/* <HeroCanvas sectionRef={heroSectionRef} /> */}
        </div>
      </div>

      <hr className="my-10 border-t-2 md:my-14 border-stone-200" />

      <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
        <div className="flex flex-col gap-1">
          <h4 className="text-xs font-bold tracking-widest text-gray-400 uppercase font-exo">
            01 — DISCOVER
          </h4>
          <h5 className="text-base font-semibold text-[#111827] md:text-lg font-satoshi">
            Find the right career path.
          </h5>
        </div>

        <div className="flex flex-col gap-1">
          <h4 className="text-xs font-bold tracking-widest text-gray-400 uppercase font-exo">
            02 — LEARN
          </h4>
          <h5 className="text-base font-semibold text-[#111827] md:text-lg font-satoshi">
            Build the skills that matter.
          </h5>
        </div>

        <div className="flex flex-col gap-1">
          <h4 className="text-xs font-bold tracking-widest text-gray-400 uppercase font-exo">
            03 — BUILD
          </h4>
          <h5 className="text-base font-semibold text-[#111827] md:text-lg font-satoshi">
            Follow your roadmap and build skills.
          </h5>
        </div>

        <div className="flex flex-col gap-1">
          <h4 className="text-xs font-bold tracking-widest text-gray-400 uppercase font-exo">
            04 — GROW
          </h4>
          <h5 className="text-base font-semibold text-[#111827] md:text-lg font-satoshi">
            Track your progress and goals.
          </h5>
        </div>
      </div>
    </div>
  );
};

export default Hero;