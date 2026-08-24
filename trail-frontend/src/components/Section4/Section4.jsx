import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Section4 = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".feature-reveal",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
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
      className="relative flex w-full flex-col items-center justify-center py-20 md:py-32 bg-white"
    >
      <div className="relative mx-auto flex w-[85%] max-w-[1440px] flex-col items-center">
        
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <h2 className="feature-reveal font-satoshi text-[clamp(2rem,4vw,3.6rem)] font-black leading-[1.1] tracking-tight text-[#111827]">
            EXPLORE OUR
            <br />
            <span className="bg-gradient-to-r from-[#6D3DF5] to-[#A855F7] bg-clip-text text-transparent">
              POWERFUL FEATURES.
            </span>
          </h2>
        </div>

        <div className="w-full flex flex-col gap-6 md:gap-10">
          
          {/* 6-Column Grid System */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 md:gap-10">
            
            {/* ROW 1: 3 Images (Each takes 2 columns: 2+2+2 = 6) */}
            <div className="feature-reveal w-full h-full md:col-span-2 overflow-hidden rounded-2xl md:rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-transform duration-300 hover:-translate-y-2">
              <img src="/images/section4-features-images/Features1.png" alt="Feature 1" className="w-full h-auto" />
            </div>
            
            <div className="feature-reveal w-full h-full md:col-span-2 overflow-hidden rounded-2xl md:rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-transform duration-300 hover:-translate-y-2">
              <img src="/images/section4-features-images/Features2.png" alt="Feature 2" className="w-full h-auto" />
            </div>

            <div className="feature-reveal w-full h-full md:col-span-2 overflow-hidden rounded-2xl md:rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-transform duration-300 hover:-translate-y-2">
              <img src="/images/section4-features-images/Features3.png" alt="Feature 3" className="w-full h-auto" />
            </div>
            
            {/* ROW 2: 2 Images Centered (Shifted using col-start-2) */}
            <div className="feature-reveal w-full h-full md:col-start-2 md:col-span-2 overflow-hidden rounded-2xl md:rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-transform duration-300 hover:-translate-y-2">
              <img src="/images/section4-features-images/Features4.png" alt="Feature 4" className="w-full h-auto" />
            </div>

            <div className="feature-reveal w-full h-full md:col-span-2 overflow-hidden rounded-2xl md:rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-transform duration-300 hover:-translate-y-2">
              <img src="/images/section4-features-images/Features5.png" alt="Feature 5" className="w-full h-auto" />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Section4;