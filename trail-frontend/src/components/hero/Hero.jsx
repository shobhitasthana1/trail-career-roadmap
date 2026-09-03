import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroRight, {
  setHeroFrameProgress,
  initHeroFrame,
} from "./HeroRight";

gsap.registerPlugin(ScrollTrigger);

const roadmapSteps = [
  { id: "01", subtitle: "DISCOVER", title: "Find the right career path.", pos: 12.5 },
  { id: "02", subtitle: "EXPLORE", title: "Discover the skills that matter.", pos: 37.5 },
  { id: "03", subtitle: "BUILD", title: "Follow your roadmap and build skills.", pos: 62.5 },
  { id: "04", subtitle: "GROW", title: "Track your progress and goals.", pos: 87.5 },
];

const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";

const Hero = () => {
  const heroSectionRef = useRef(null);
  const progressDotRef = useRef(null);
  const progressLineRef = useRef(null);
  const stepRefs = useRef([]);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined"
      ? window.matchMedia(DESKTOP_MEDIA_QUERY).matches
      : true
  );

  stepRefs.current = roadmapSteps.map(
    (_, i) => stepRefs.current[i] ?? { dot: null, subtitle: null, title: null, card: null }
  );

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const handleChange = (e) => setIsDesktop(e.matches);
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-line",
        { opacity: 0, y: 60, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2, stagger: 0.15, ease: "expo.out", delay: 0.1 }
      );
      gsap.fromTo(
        ".hero-fade",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out", delay: 0.6 }
      );
    }, heroSectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const applyStepState = (dotPosition) => {
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
      };

      if (isDesktop) {
        ScrollTrigger.create({
          id: "hero-pin",
          trigger: heroSectionRef.current,
          start: "top top",
          end: "+=1200", 
          pin: true,
          pinSpacing: true,
          scrub: 0.5, 
          anticipatePin: 1,
          invalidateOnRefresh: true,
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

            applyStepState(dotPosition);
          },
        });
      }

      initHeroFrame();

      if (progressDotRef.current) progressDotRef.current.style.left = "12.5%";
      if (progressLineRef.current) progressLineRef.current.style.width = "12.5%";

      if (stepRefs.current[0].subtitle) {
        gsap.set(stepRefs.current[0].subtitle, { color: "#9577F4" });
        gsap.set(stepRefs.current[0].title, { color: "#111827", opacity: 1 });
        gsap.set(stepRefs.current[0].card, {
          borderColor: "rgba(149,119,244,0.3)",
          boxShadow: "0 10px 30px -10px rgba(149,119,244,0.15)",
          y: -4,
        });
      }
    }, heroSectionRef);

    return () => ctx.revert();
  }, [isDesktop]);

  return (
    <div
      ref={heroSectionRef}
      className="w-full min-h-screen lg:h-screen lg:max-h-screen px-5 sm:px-8 md:px-12 lg:px-20 pt-16 sm:pt-20 md:pt-20 lg:pt-16 pb-0 font-inter bg-white flex flex-col justify-center gap-6 lg:gap-8 overflow-x-hidden"
    >
      <div className="w-full max-w-[1400px] mx-auto flex flex-col justify-center flex-1">
        <div className="flex flex-col w-full lg:flex-row lg:justify-between lg:items-center gap-6 lg:gap-4">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left w-full max-w-[600px] mx-auto lg:mx-0 lg:max-w-none mt-6 sm:mt-8 lg:mt-10 lg:w-[50%] relative z-10">
            <img
              className="w-[28vw] sm:w-[20vw] md:w-[16vw] lg:w-[14vw] max-w-[130px] sm:max-w-[150px] lg:max-w-[180px] mb-1.5 sm:mb-2 lg:mb-2 transition-transform duration-300 hover:scale-105 cursor-pointer"
              src="/images/hero-images/01-Start-Here.png"
              alt="Start Here"
            />

            <h1 className="w-full mt-1 lg:mt-2 max-w-[650px] text-[clamp(2.2rem,10vw,3.2rem)] leading-[0.9] tracking-[-0.055em] sm:text-5xl lg:text-[72px] text-[#111827] cursor-default">
              <span className="hero-line block whitespace-nowrap font-geist font-black transition-all duration-500 ease-out lg:hover:text-[#7C3AED] lg:hover:translate-x-3">
                Your journey.
              </span>
              <span className="hero-line block whitespace-nowrap font-iowan font-normal italic tracking-[-0.04em] my-1 lg:my-0.5 transition-all duration-500 ease-out lg:hover:text-[#A855F7] lg:hover:translate-x-3">
                your roadmap.
              </span>
              <span className="hero-line block whitespace-nowrap font-geist font-black bg-gradient-to-r from-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent pb-2 transition-all duration-500 ease-out lg:hover:translate-x-3">
                your future.
              </span>
            </h1>

            <p className="hero-fade w-full mt-2 sm:mt-2.5 lg:mt-3 text-sm sm:text-base lg:text-[17px] leading-relaxed text-gray-600 max-w-[420px] lg:max-w-none lg:w-[85%] font-inter">
              TRAIL helps you discover the right career path, learn the skills
              that matter, follow a structured roadmap and track your progress —
              all in one place.
            </p>

            <div className="hero-fade mt-2 sm:mt-2.5 lg:mt-3 w-fit">
              <img
                className="w-[56vw] sm:w-[40vw] md:w-[34vw] lg:w-[32vw] xl:w-[28vw] max-w-[260px] sm:max-w-[300px] lg:max-w-[320px] transition-all duration-300 hover:scale-105 hover:brightness-105 active:scale-95 cursor-pointer"
                src="/images/hero-images/Explore-Your-Roadmap.png"
                alt="Explore Your Roadmap"
              />
            </div>
          </div>

          <div className="flex items-center justify-center w-full lg:w-[50%] relative z-0">
            <HeroRight />
          </div>
        </div>

        <div className="w-full pb-0 mt-6 lg:mt-8 relative z-10">
          <div className="hidden lg:block relative w-full pt-1">
            <div className="absolute top-0 left-0 w-full h-2">
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

            <div className="grid grid-cols-4 w-full pt-5">
              {roadmapSteps.map((step, index) => (
                <div key={step.id} className="w-full px-1 xl:px-2">
                  <div
                    ref={(el) => (stepRefs.current[index].card = el)}
                    className="flex flex-col gap-1 xl:gap-2 h-full p-3 xl:p-4 bg-white border border-stone-200 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]"
                  >
                    <h4
                      ref={(el) => (stepRefs.current[index].subtitle = el)}
                      className="text-[10px] xl:text-xs font-bold tracking-[0.2em] text-stone-400 uppercase font-exo"
                    >
                      {step.id} — {step.subtitle}
                    </h4>
                    <h5
                      ref={(el) => (stepRefs.current[index].title = el)}
                      className="text-sm xl:text-[15px] leading-tight font-semibold text-stone-500 font-satoshi opacity-50"
                    >
                      {step.title}
                    </h5>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:hidden flex flex-col gap-3 pt-2 pb-4">
            {roadmapSteps.map((step, index) => (
              <div key={`mob-${step.id}`} className="flex gap-3">
                <div className="flex flex-col items-center pt-2">
                  <div
                    className={`flex items-center justify-center w-4 h-4 rounded-full shrink-0 ${
                      index === 0
                        ? "bg-[#9577F4] shadow-[0_0_0_4px_rgba(149,119,244,0.15)]"
                        : "bg-white border-2 border-stone-200"
                    }`}
                  >
                    {index === 0 && <div className="w-[6px] h-[6px] rounded-full bg-white" />}
                  </div>
                  {index !== roadmapSteps.length - 1 && (
                    <div className="w-[2px] flex-1 bg-stone-100 my-1 rounded-full" />
                  )}
                </div>

                <div
                  className={`flex-1 flex flex-col gap-1.5 p-3 sm:p-4 bg-white border rounded-xl min-w-0 ${
                    index === 0
                      ? "border-[#9577F4]/30 shadow-[0_8px_24px_-8px_rgba(149,119,244,0.2)]"
                      : "border-stone-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]"
                  }`}
                >
                  <h4
                    className={`text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase font-exo ${
                      index === 0 ? "text-[#9577F4]" : "text-stone-400"
                    }`}
                  >
                    {step.id} — {step.subtitle}
                  </h4>
                  <h5
                    className={`text-sm sm:text-base font-semibold font-satoshi break-words ${
                      index === 0 ? "text-[#111827]" : "text-stone-500"
                    }`}
                  >
                    {step.title}
                  </h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;