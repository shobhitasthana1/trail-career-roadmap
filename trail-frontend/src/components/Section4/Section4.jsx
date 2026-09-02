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
      className="relative flex w-full flex-col items-center justify-center py-16 sm:py-20 lg:py-24 bg-[#FFFFFF] overflow-hidden"
    >
      <div 
        className="absolute inset-0 z-0 opacity-[0.4]"
        style={{
          backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[800px] h-[60%] bg-[#7C3AED]/5 blur-[100px] md:blur-[140px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col items-center px-4 sm:px-6 md:px-8">
        
        <div className="flex flex-col items-center text-center mb-10 md:mb-14 w-full">
          <span className="feature-reveal mb-4 flex items-center font-exo text-[11px] font-bold uppercase tracking-[0.3em] text-[#6D3DF5] md:text-xs">
            Where Trail Excels
          </span>
          
          <h2 className="feature-reveal font-satoshi text-[clamp(1.8rem,3.5vw,3.5rem)] lg:text-[4rem] font-black tracking-tight text-[#0F172A] mt-2 md:whitespace-nowrap">
            EXPLORE THE POWERFUL{" "}
            <span className="bg-gradient-to-r from-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent italic font-serif font-normal lowercase">
              features.
            </span>
          </h2>
          
          <p className="feature-reveal mt-5 text-sm md:text-base lg:text-lg font-medium text-slate-500 w-full md:w-max leading-relaxed text-center mx-auto">
            Most roadmaps are static and outdated. Trail uses real-time job data to build dynamic, ordered learning paths. <br className="hidden md:block" />
            Track your progress, access curated resources, and watch your skill gap shrink as you become job-ready.
          </p>
        </div>

        <div className="feature-reveal relative w-full max-w-[1200px] rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] md:shadow-[0_40px_100px_-20px_rgba(124,58,237,0.15)] border border-slate-200/60 overflow-hidden transform-gpu transition-all duration-700 hover:scale-[1.01]">
          <img 
            src="/images/section4-features-images/Features.webp" 
            alt="Trail Interactive Features Overview" 
            className="w-full h-auto object-cover block"
            loading="lazy"
          />
        </div>

      </div>
    </section>
  );
};

export default Section4;