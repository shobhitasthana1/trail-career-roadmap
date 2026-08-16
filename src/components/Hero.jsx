import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ButtonTwo from "./ButtonTwo";
import HeroRight, {
  setHeroFrameProgress,
  initHeroFrame,
} from "./HeroRight";
import RoadmapTimeline from "./RoadmapTimeline";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroSectionRef = useRef(null);
  const roadmapRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: heroSectionRef.current,
        start: "top top",
        end: "+=3000",
        pin: true,
        pinSpacing: true,
        scrub: 0.05,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          setHeroFrameProgress(progress);

          if (roadmapRef.current) {
            roadmapRef.current.updateProgress(progress);
          }
        },
      });

      initHeroFrame();
    }, heroSectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={heroSectionRef}
      className="w-full min-h-screen lg:h-screen px-6 pt-24 pb-10 md:px-10 lg:pt-[100px] lg:pb-12 font-inter bg-white flex flex-col justify-center"
    >
      <div className="flex flex-col w-full lg:flex-row lg:justify-between lg:items-center">
        <div className="flex flex-col w-full max-w-[650px] lg:max-w-none mt-4 md:mt-8 lg:w-[45%] relative z-10">
          <img
            className="w-[25vw] sm:w-[18vw] md:w-[15vw] lg:w-[10vw] mb-4 lg:mb-2"
            src="/images/hero-images/trail-build-your-path-sticker.png"
            alt="Build Your Path"
          />

          <div className="flex flex-col gap-0">
            {["YOUR JOURNEY.", "YOUR ROADMAP.", "YOUR FUTURE."].map((text, i) => (
              <h1
                key={i}
                className={`w-fit font-satoshi text-[12vw] sm:text-[9vw] md:text-7xl font-black leading-[0.9] tracking-tighter transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:font-exo hover:italic hover:text-transparent hover:translate-x-4 cursor-default
                ${i === 1 ? "text-[#9577F4] hover:[-webkit-text-stroke:2px_#9577F4]" : "text-[#111827] hover:[-webkit-text-stroke:2px_#111827]"}`}
              >
                {text}
              </h1>
            ))}
          </div>

          <p className="w-full mt-6 text-sm leading-relaxed text-gray-600 sm:text-base md:w-4/5 font-inter">
            TRAIL helps you discover the right career path, learn the skills
            that matter, follow a structured roadmap and track your progress —
            all in one place.
          </p>

          <div className="mt-8 w-fit">
            <ButtonTwo text="EXPLORE YOUR ROADMAP" />
          </div>
        </div>

        <div className="flex items-center justify-center w-full mt-8 sm:mt-10 lg:w-[55%] lg:mt-0 relative z-0">
          <HeroRight />
        </div>
      </div>

      <RoadmapTimeline ref={roadmapRef} />
    </div>
  );
};

export default Hero;