import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ButtonTwo from "./ButtonTwo";
import HeroRight, {
  setHeroFrameProgress,
  initHeroFrame,
} from "./HeroRight";

gsap.registerPlugin(ScrollTrigger);

const roadmapSteps = [
  { id: "01", subtitle: "DISCOVER", title: "Find the right career path.", pos: 12.5 },
  { id: "02", subtitle: "LEARN", title: "Build the skills that matter.", pos: 37.5 },
  { id: "03", subtitle: "BUILD", title: "Follow your roadmap and build skills.", pos: 62.5 },
  { id: "04", subtitle: "GROW", title: "Track your progress and goals.", pos: 87.5 },
];

const Hero = () => {
  const heroSectionRef = useRef(null);
  const progressDotRef = useRef(null);
  const progressLineRef = useRef(null);
  const stepRefs = useRef([]);

  stepRefs.current = roadmapSteps.map((_, i) => stepRefs.current[i] ?? { dot: null, subtitle: null, title: null, card: null });

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

          const dotPosition = 12.5 + progress * 75;

          if (progressDotRef.current) {
            progressDotRef.current.style.left = `${dotPosition}%`;
          }

          if (progressLineRef.current) {
            progressLineRef.current.style.width = `${dotPosition}%`;
          }

          stepRefs.current.forEach((step, index) => {
            const isReached = dotPosition >= roadmapSteps[index].pos;

            if (step.subtitle) {
              gsap.to(step.subtitle, {
                color: isReached ? "#9577F4" : "#a8a29e",
                duration: 0.3,
                overwrite: "auto",
              });
            }
            if (step.title) {
              gsap.to(step.title, {
                color: isReached ? "#111827" : "#78716c",
                opacity: isReached ? 1 : 0.5,
                duration: 0.3,
                overwrite: "auto",
              });
            }
            if (step.dot) {
              gsap.to(step.dot, {
                backgroundColor: isReached ? "#9577F4" : "#ffffff",
                borderColor: isReached ? "#9577F4" : "#e7e5e4",
                duration: 0.3,
                overwrite: "auto",
              });
            }
            if (step.card) {
              gsap.to(step.card, {
                borderColor: isReached ? "rgba(149,119,244,0.3)" : "rgba(231,229,228,1)",
                boxShadow: isReached 
                  ? "0 10px 30px -10px rgba(149,119,244,0.15)" 
                  : "0 4px 20px -4px rgba(0,0,0,0.03)",
                y: isReached ? -4 : 0,
                duration: 0.4,
                ease: "power2.out",
                overwrite: "auto",
              });
            }
          });
        },
      });

      initHeroFrame();
      
      if (progressDotRef.current) progressDotRef.current.style.left = "12.5%";
      if (progressLineRef.current) progressLineRef.current.style.width = "12.5%";
      
      if (stepRefs.current[0].subtitle) {
         gsap.set(stepRefs.current[0].subtitle, { color: "#9577F4" });
         gsap.set(stepRefs.current[0].title, { color: "#111827", opacity: 1 });
         gsap.set(stepRefs.current[0].card, { 
           borderColor: "rgba(149,119,244,0.3)",
           boxShadow: "0 10px 30px -10px rgba(149,119,244,0.15)",
           y: -4 
         });
      }

    }, heroSectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={heroSectionRef}
      className="w-full min-h-screen lg:h-screen px-4 sm:px-6 md:px-10 pt-24 sm:pt-28 lg:pt-24 xl:pt-28 pb-6 lg:pb-8 font-inter bg-white flex flex-col justify-between overflow-x-hidden"
    >
      <div className="flex flex-col w-full lg:flex-row lg:justify-between lg:items-center my-auto">
        
        <div className="flex flex-col w-full max-w-[650px] lg:max-w-none mt-2 sm:mt-4 lg:w-[45%] relative z-10">
          <img
            className="w-[22vw] sm:w-[16vw] md:w-[13vw] lg:w-[9vw] mb-3 sm:mb-4 lg:mb-2"
            src="/images/hero-images/trail-build-your-path-sticker.png"
            alt="Build Your Path"
          />

          <div className="flex flex-col gap-0">
            {["YOUR JOURNEY.", "YOUR ROADMAP.", "YOUR FUTURE."].map((text, i) => (
              <h1
                key={i}
                className={`w-fit font-satoshi text-[11vw] sm:text-[8.5vw] md:text-6xl lg:text-6xl xl:text-7xl font-black leading-[0.9] tracking-tighter transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:font-exo hover:italic hover:text-transparent hover:translate-x-4 cursor-default
                ${i === 1 ? "text-[#9577F4] hover:[-webkit-text-stroke:2px_#9577F4]" : "text-[#111827] hover:[-webkit-text-stroke:2px_#111827]"}`}
              >
                {text}
              </h1>
            ))}
          </div>

          <p className="w-full mt-4 sm:mt-5 text-xs sm:text-sm lg:text-base leading-relaxed text-gray-600 md:w-4/5 font-inter">
            TRAIL helps you discover the right career path, learn the skills
            that matter, follow a structured roadmap and track your progress —
            all in one place.
          </p>

          <div className="mt-6 sm:mt-7 w-fit">
            <ButtonTwo text="EXPLORE YOUR ROADMAP" />
          </div>
        </div>

        <div className="flex items-center justify-center w-full mt-6 sm:mt-8 lg:w-[52%] lg:mt-0 relative z-0">
          <HeroRight />
        </div>
      </div>

      <div className="w-full mt-4 lg:mt-0 pb-2">
        
        <div className="hidden lg:block relative w-full pt-2">
          
          <div className="absolute top-0 left-0 w-full h-5">
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-stone-100 -translate-y-1/2 rounded-full" />

            <div
              ref={progressLineRef}
              className="absolute top-1/2 left-0 h-[2px] bg-[#9577F4] -translate-y-1/2 rounded-full z-0"
            />

            {roadmapSteps.map((step, index) => (
              <div
                key={`dot-${step.id}`}
                ref={(el) => (stepRefs.current[index].dot = el)}
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-stone-200 z-10 transition-colors"
                style={{ left: `${step.pos}%` }}
              />
            ))}

            <div
              ref={progressDotRef}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded-full bg-[#9577F4] shadow-[0_0_0_5px_rgba(149,119,244,0.15),0_0_18px_rgba(149,119,244,0.55)] z-20"
            >
              <div className="w-[7px] h-[7px] rounded-full bg-white" />
            </div>
          </div>

          <div className="grid grid-cols-4 w-full pt-4">
            {roadmapSteps.map((step, index) => (
              <div key={step.id} className="w-full px-2 xl:px-3">
                <div 
                  ref={(el) => (stepRefs.current[index].card = el)}
                  className="flex flex-col gap-2 xl:gap-3 h-full p-4 xl:p-5 bg-white border border-stone-200 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]"
                >
                  <h4
                    ref={(el) => (stepRefs.current[index].subtitle = el)}
                    className="text-[11px] xl:text-xs font-bold tracking-[0.2em] text-stone-400 uppercase font-exo"
                  >
                    {step.id} — {step.subtitle}
                  </h4>
                  <h5
                    ref={(el) => (stepRefs.current[index].title = el)}
                    className="text-sm xl:text-[16px] leading-snug font-semibold text-stone-500 font-satoshi opacity-50"
                  >
                    {step.title}
                  </h5>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:hidden flex flex-col gap-3 sm:gap-4 pt-3">
          {roadmapSteps.map((step, index) => (
             <div key={`mob-${step.id}`} className="flex gap-4">
              <div className="flex flex-col items-center pt-4">
                <div
                  className={`flex items-center justify-center w-4 h-4 rounded-full shrink-0 ${
                    index === 0 
                      ? 'bg-[#9577F4] shadow-[0_0_0_4px_rgba(149,119,244,0.15)]' 
                      : 'bg-white border-2 border-stone-200'
                  }`}
                >
                  {index === 0 && <div className="w-[6px] h-[6px] rounded-full bg-white" />}
                </div>
                {index !== roadmapSteps.length - 1 && (
                  <div className="w-[2px] flex-1 bg-stone-100 my-2 rounded-full" />
                )}
              </div>

              <div 
                className={`flex-1 flex flex-col gap-1.5 p-4 bg-white border rounded-2xl ${
                  index === 0 
                    ? 'border-[#9577F4]/30 shadow-[0_8px_24px_-8px_rgba(149,119,244,0.2)]' 
                    : 'border-stone-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]'
                }`}
              >
                <h4 className={`text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase font-exo ${index === 0 ? 'text-[#9577F4]' : 'text-stone-400'}`}>
                  {step.id} — {step.subtitle}
                </h4>
                <h5 className={`text-sm sm:text-base font-semibold font-satoshi ${index === 0 ? 'text-[#111827]' : 'text-stone-500'}`}>
                  {step.title}
                </h5>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Hero;