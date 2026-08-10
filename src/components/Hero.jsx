import React, { useRef } from "react";
import ButtonTwo from "./ButtonTwo";
import HeroCanvas from "./HeroCanvas";

const Hero = () => {
  const heroSectionRef = useRef(null);

  return (
    <div ref={heroSectionRef} className="w-full px-6 py-12 md:px-10 font-inter">
      <div className="flex flex-col w-full lg:flex-row lg:justify-between">
        
        <div className="flex flex-col w-full gap-2 mt-5 md:mt-10 lg:w-1/2">
          <h1 className="w-fit font-satoshi text-5xl font-black leading-none tracking-tighter text-gray-900 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] md:text-7xl hover:font-exo hover:italic hover:text-transparent hover:[-webkit-text-stroke:2px_#111827] hover:translate-x-4 cursor-default">
            YOUR JOURNEY.
          </h1>
          <h1 className="w-fit font-satoshi text-5xl font-black leading-none tracking-tighter text-[#9577F4] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] md:text-7xl hover:font-exo hover:italic hover:text-transparent hover:[-webkit-text-stroke:2px_#9577F4] hover:translate-x-4 cursor-default">
            YOUR ROADMAP.
          </h1>
          <h1 className="w-fit font-satoshi text-5xl font-black leading-none tracking-tighter text-gray-900 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] md:text-7xl hover:font-exo hover:italic hover:text-transparent hover:[-webkit-text-stroke:2px_#111827] hover:translate-x-4 cursor-default">
            YOUR FUTURE.
          </h1>

          <p className="w-full mt-6 text-sm leading-relaxed text-gray-600 sm:w-4/5 md:text-base font-inter">
            TRAIL helps you discover the right career path, learn the skills that
            matter, follow a structured roadmap and track your progress — all in
            one place.
          </p>
        </div>

        <div className="flex items-center justify-end w-full mt-10 lg:w-1/2 lg:mt-0">
          <HeroCanvas sectionRef={heroSectionRef} />
        </div>

      </div>

      <hr className="my-10 border-t-2 md:my-16 border-stone-200" />

      <div className="flex flex-col items-start justify-between w-full gap-8 lg:flex-row lg:items-center lg:gap-0">
        <div className="flex flex-col gap-6 sm:flex-row md:gap-16">
          <div className="flex flex-col gap-1">
            <h4 className="text-xs font-bold tracking-widest text-gray-400 uppercase font-exo">
              Built for your next move
            </h4>
            <h5 className="text-base font-semibold text-gray-800 md:text-lg font-satoshi">
              Discover a career path that fits your goals.
            </h5>
          </div>

          <div className="flex flex-col gap-1">
            <h4 className="text-xs font-bold tracking-widest text-gray-400 uppercase font-exo">
              Built for your next move
            </h4>
            <h5 className="text-base font-semibold text-gray-800 md:text-lg font-satoshi">
              Discover a career path that fits your goals.
            </h5>
          </div>
        </div>

        <div className="w-full sm:w-auto">
          <ButtonTwo text="EXPLORE YOUR ROADMAP" />
        </div>
      </div>
    </div>
  );
};

export default Hero;