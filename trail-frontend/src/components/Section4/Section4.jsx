import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Section4 = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(
        ".feature-reveal",
        { opacity: 0, y: 30, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
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
      // FIX 1: Heavily reduced vertical padding (py-16 to py-24 instead of py-40)
      className="relative flex w-full flex-col items-center justify-center py-16 sm:py-20 lg:py-24 bg-[#F9FAFB] overflow-hidden"
    >
      <div 
        className="absolute inset-0 z-0 opacity-[0.4]"
        style={{
          backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[800px] h-[60%] bg-[#7C3AED]/5 blur-[100px] md:blur-[140px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col items-center px-4 sm:px-6 md:px-8">
        
        {/* FIX 2: Reduced bottom margin (mb-10 to mb-12) to bring image closer */}
        <div className="flex flex-col items-center text-center mb-10 md:mb-12 max-w-2xl">
          <span className="feature-reveal mb-3 text-[10px] md:text-xs font-bold tracking-[0.25em] text-[#7C3AED] uppercase bg-[#7C3AED]/10 px-4 py-1.5 rounded-full">
            Why Trail Works
          </span>
          
          {/* FIX 3: Reduced font size and tightened line height */}
          <h2 className="feature-reveal font-satoshi text-[clamp(2rem,4vw,3rem)] lg:text-[3.5rem] font-black leading-tight md:leading-none tracking-tight text-[#0F172A] mt-3">
            EXPLORE OUR
            <br />
            <span className="bg-gradient-to-r from-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent italic font-serif pr-2">
              POWERFUL FEATURES.
            </span>
          </h2>
          
          {/* FIX 4: Made paragraph more compact */}
          <p className="feature-reveal mt-4 md:mt-5 text-sm md:text-base lg:text-lg font-medium text-slate-500 max-w-[90%] sm:max-w-xl leading-relaxed text-balance mx-auto">
            Most roadmaps are static and outdated. Trail uses real-time job data to build dynamic, ordered learning paths. Track your progress, access curated resources, and watch your skill gap shrink as you become job-ready.
          </p>
        </div>

        <div className="feature-reveal relative w-full rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[3rem] bg-white/80 backdrop-blur-xl p-2 sm:p-3 md:p-4 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] md:shadow-[0_40px_100px_-20px_rgba(124,58,237,0.15)] border border-slate-200/80 overflow-hidden transform-gpu transition-all duration-700 hover:scale-[1.02] hover:shadow-[0_50px_120px_-20px_rgba(124,58,237,0.2)]">
          <div className="relative w-full overflow-hidden rounded-[1rem] sm:rounded-[1.5rem] md:rounded-[2.5rem] bg-slate-50 flex items-center justify-center ring-1 ring-inset ring-slate-900/5">
            <img 
              src="/images/section4-features-images/Features.webp" 
              alt="Trail Interactive Features Overview" 
              className="w-full h-auto object-cover block"
              loading="lazy"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default Section4;