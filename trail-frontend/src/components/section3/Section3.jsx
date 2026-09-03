import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Section3 = () => {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const gradientRef = useRef(null); 
  const label1Ref = useRef(null);
  const heading1Ref = useRef(null);
  const text2WrapperRef = useRef(null);
  const heading2Ref = useRef(null);
  const label2Ref = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;
      const startXPercent = isMobile ? 25 : 50;

      gsap.set([imageRef.current, gradientRef.current], {
        transformOrigin: "center center",
        force3D: true,
        willChange: "transform, clip-path",
      });

      gsap.set(text2WrapperRef.current, { autoAlpha: 0 });
      gsap.set(heading2Ref.current, { y: 40 });
      gsap.set(label2Ref.current, { y: 20 });
      gsap.set(".final-text-reveal-content", { xPercent: 100 });
      gsap.set(".imagereveal", { xPercent: 100 });
      gsap.set(".image-card-section", { xPercent: startXPercent });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=1200%",
          pin: true,
          pinSpacing: true,
          scrub: 2.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
        },
      });

      tl.fromTo(
        [imageRef.current, gradientRef.current],
        {
          scale: 0.9,
          clipPath: "polygon(22% 20%, 58% 6%, 97% 42%, 58% 94%, 20% 86%, 12% 55%)",
        },
        {
          scale: 1,
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 100% 100%, 0% 100%, 0% 0%)",
          duration: 1.4,
        }
      );

      tl.fromTo(
        label1Ref.current,
        { opacity: 0, y: 25, letterSpacing: "0.35em" },
        {
          opacity: 1,
          y: 0,
          letterSpacing: "0.18em",
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.75"
      );

      tl.fromTo(
        heading1Ref.current,
        { scale: 1.8, opacity: 0, y: 30 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power4.out",
        },
        "-=0.6"
      );

      tl.to(
        [heading1Ref.current, label1Ref.current],
        {
          opacity: 0,
          y: -30,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.in",
        },
        "+=0.3"
      );

      tl.to(
        ".strip",
        {
          clipPath: "inset(0% 0% 0% 0%)",
          stagger: -0.09,
          duration: 1.2,
          ease: "power2.inOut",
        },
        "-=0.1"
      );

      tl.to(
        text2WrapperRef.current,
        {
          autoAlpha: 1,
          duration: 0.5,
        },
        "-=0.6"
      );

      tl.to(
        heading2Ref.current,
        {
          y: 0,
          duration: 0.8,
          ease: "power4.out",
        },
        "-=0.3"
      );

      tl.to(
        label2Ref.current,
        {
          y: 0,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.6"
      );

      tl.to(
        ".image-card-section",
        {
          xPercent: -100, 
          duration: 12,
          ease: "none",
        },
        "cardsSlide"
      );

      tl.to(
        text2WrapperRef.current,
        {
          autoAlpha: 0,
          duration: 1.5,
          ease: "power2.out",
        },
        "cardsSlide+=1"
      );

      tl.to(
        ".imagereveal",
        {
          xPercent: 0,
          duration: 4,
          ease: "power2.inOut",
        },
        "cardsSlide+=8.5"
      );

      tl.to(
        ".final-text-reveal-content",
        {
          xPercent: 0,
          duration: 4,
          ease: "power2.out",
        },
        "cardsSlide+=9"
      );
    }, sectionRef);

    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-[#F8F8FA] z-30"
    >
      <img
        ref={imageRef}
        src="/images/section3-images/initial-image.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-[65%_60%] will-change-transform backface-hidden"
      />

      <div 
        ref={gradientRef}
        className="absolute inset-0 bg-gradient-to-b from-[#0E0A1A]/10 via-[#0E0A1A]/30 to-[#0E0A1A]/50 pointer-events-none will-change-transform backface-hidden" 
      />

      <div className="absolute inset-0 z-3 flex flex-col items-center justify-center pointer-events-none">
        <span
          ref={label1Ref}
          className="mb-4 text-xs md:text-sm font-inter font-[600] uppercase tracking-[0.2em] text-[#E9D5FF] drop-shadow-[0_2px_10px_rgba(124,58,237,0.5)]"
        >
          THREE SIMPLE STEPS
        </span>

        <h1
          ref={heading1Ref}
          className="text-[clamp(3rem,8vw,8rem)] leading-[0.96] font-geist font-bold tracking-[-0.045em] text-center whitespace-nowrap text-white drop-shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
        >
          HOW IT WORKS
        </h1>
      </div>

      <div className="strip-reveal absolute top-0 z-4 h-full w-full">
        <div className="strips flex h-full w-full relative">
          <div
            className="strip absolute left-0 h-full w-[33.5%] bg-[#0E0A1A] [clip-path:inset(0%_0%_0%_100%)]"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(124,58,237,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(124,58,237,0.08) 1px, transparent 1px), radial-gradient(circle at bottom left, rgba(124,58,237,0.12) 0%, #0E0A1A 65%)`,
              backgroundSize: "40px 40px, 40px 40px, 100% 100%",
            }}
          />
          <div
            className="strip absolute left-[33.33%] h-full w-[33.5%] bg-[#0E0A1A] [clip-path:inset(0%_0%_0%_100%)]"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(124,58,237,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(124,58,237,0.08) 1px, transparent 1px), radial-gradient(circle at center, rgba(157,78,221,0.1) 0%, #0E0A1A 75%)`,
              backgroundSize: "40px 40px, 40px 40px, 100% 100%",
            }}
          />
          <div
            className="strip absolute right-0 h-full w-[33.5%] bg-[#0E0A1A] [clip-path:inset(0%_0%_0%_100%)]"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(124,58,237,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(124,58,237,0.08) 1px, transparent 1px), radial-gradient(circle at bottom right, rgba(124,58,237,0.12) 0%, #0E0A1A 65%)`,
              backgroundSize: "40px 40px, 40px 40px, 100% 100%",
            }}
          />

          <div
            ref={text2WrapperRef}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none gap-4 md:gap-6 px-4 bg-[radial-gradient(circle_at_center,rgba(14,10,26,0.92)_0%,rgba(14,10,26,0.6)_40%,rgba(14,10,26,0)_80%)]"
          >
            <h1
              ref={heading2Ref}
              className="text-[clamp(2.5rem,6vw,6rem)] leading-[0.96] font-geist font-bold tracking-[-0.045em] text-center text-white drop-shadow-[0_4px_32px_rgba(124,58,237,0.2)]"
            >
              <span>Pick your</span>{" "}
              <span className="font-iowan italic font-normal text-[#C4B5FD]">
                goal.
              </span>
            </h1>
            <p
              ref={label2Ref}
              className="text-base md:text-2xl font-inter font-[500] text-[#E9D5FF] text-center max-w-3xl leading-[1.5] text-balance opacity-80 px-2"
            >
              Choose the role you want. We’ll map the way there.
            </p>
          </div>
        </div>
      </div>

      <div className="image-card-section h-full w-[400%] md:w-[200%] absolute top-0 z-[8] flex items-center justify-evenly px-4 md:px-8 pointer-events-none">
        <div className="card w-[80vw] md:w-[45vw] flex items-center justify-center shrink-0">
          <img
            className="w-full h-[45vh] md:h-[60vh] object-contain drop-shadow-[0_20px_60px_rgba(124,58,237,0.3)] transition-transform duration-700 hover:scale-105"
            src="/images/section3-images/card1.png"
            alt="Search your role"
          />
        </div>
        
        <div className="card w-[80vw] md:w-[45vw] flex items-center justify-center shrink-0">
          <img
            className="w-full h-[45vh] md:h-[60vh] object-contain drop-shadow-[0_20px_60px_rgba(124,58,237,0.3)] transition-transform duration-700 hover:scale-105"
            src="/images/section3-images/card2.png"
            alt="Get a living roadmap"
          />
        </div>
        
        <div className="card w-[80vw] md:w-[45vw] flex items-center justify-center shrink-0">
          <img
            className="w-full h-[45vh] md:h-[60vh] object-contain drop-shadow-[0_20px_60px_rgba(124,58,237,0.3)] transition-transform duration-700 hover:scale-105"
            src="/images/section3-images/card3.png"
            alt="Track progress"
          />
        </div>
      </div>

      <div className="final-text-reveal h-full w-full absolute top-0 z-20 overflow-hidden">
        <div className="imagereveal w-full h-full relative will-change-transform">
          <div className="absolute inset-0 w-full h-full bg-[#F8F8FA]" />
          <div
            className="absolute inset-0 w-full h-full bg-[#0E0A1A]"
            style={{
              clipPath: "ellipse(120% 100% at 50% 0%)",
              backgroundImage: `linear-gradient(to right, rgba(124,58,237,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(124,58,237,0.06) 1px, transparent 1px), radial-gradient(ellipse at top center, rgba(124,58,237,0.25) 0%, rgba(78,42,221,0.1) 45%, #0E0A1A 100%)`,
              backgroundSize: "40px 40px, 40px 40px, 100% 100%",
            }}
          />
        </div>

        <div className="final-text-reveal-content h-full w-full absolute top-0 z-30 flex items-center justify-center bg-transparent">
          <h2 className="text-[clamp(2.2rem,5vw,5.5rem)] leading-[0.96] tracking-[-0.045em] text-center drop-shadow-[0_4px_32px_rgba(124,58,237,0.4)] px-4 pointer-events-none">
            <span className="block whitespace-nowrap font-geist font-bold text-white">
              Your path is clear.
            </span>
            <span className="block whitespace-nowrap mt-1 md:mt-2 font-iowan font-normal italic bg-gradient-to-r from-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent pb-2">
              Now start your journey.
            </span>
          </h2>
        </div>
      </div>
    </section>
  );
};

export default Section3;