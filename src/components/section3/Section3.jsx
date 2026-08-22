import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Section3 = () => {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);

  const label1Ref = useRef(null);
  const heading1Ref = useRef(null);

  const text2WrapperRef = useRef(null);
  const heading2Ref = useRef(null);
  const label2Ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(imageRef.current, {
        transformOrigin: "center center",
        force3D: true,
        willChange: "transform, clip-path",
      });

      gsap.set(text2WrapperRef.current, { autoAlpha: 0 });
      gsap.set(heading2Ref.current, { y: 40 });
      gsap.set(label2Ref.current, { y: 20 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=600%",
          scrub: 2.5,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
        },
      });

      tl.fromTo(
        imageRef.current,
        {
          scale: 0.9,
          clipPath:
            "polygon(22% 20%, 58% 6%, 97% 42%, 58% 94%, 20% 86%, 12% 55%)",
        },
        {
          scale: 1,
          clipPath:
            "polygon(0% 0%, 100% 0%, 100% 100%, 100% 100%, 0% 100%, 0% 0%)",
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
          xPercent: -300,
          duration: 4,
          ease: "none",
        },
        "-=0.16"
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
      className="relative w-full h-screen overflow-hidden bg-[#FEFEFE]"
    >
      <img
        ref={imageRef}
        src="/images/section3-images/initial-image.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-[65%_60%] will-change-transform backface-hidden"
      />

      <div className="absolute inset-0 bg-linear-to-b from-black/5 via-black/10 to-black/20 pointer-events-none" />

      <div className="absolute inset-0 z-3 flex flex-col items-center justify-center text-white pointer-events-none drop-shadow-xl">
        <span
          ref={label1Ref}
          className="mb-4 text-xs md:text-sm font-inter font-semibold uppercase tracking-[0.18em]"
        >
          Your path starts here
        </span>

        <h1
          ref={heading1Ref}
          className="text-[clamp(3rem,8vw,8rem)] leading-[0.9] font-satoshi font-black tracking-[-0.04em] text-center whitespace-nowrap"
        >
          HOW IT WORKS
        </h1>
      </div>

      <div className="strip-reveal absolute top-0 z-4 h-full w-full">
        <div className="strips flex h-full w-full">
          <div
            className="strip h-full w-1/3 bg-no-repeat bg-size-[300%_100%] [clip-path:inset(0%_0%_0%_100%)] bg-position-[0%_50%]"
            style={{
              backgroundImage:
                "url('/images/section3-images/stripe-image.png')",
            }}
          />

          <div
            className="strip h-full w-1/3 bg-no-repeat bg-size-[300%_100%] [clip-path:inset(0%_0%_0%_100%)] bg-position-[50%_50%]"
            style={{
              backgroundImage:
                "url('/images/section3-images/stripe-image.png')",
            }}
          />

          <div
            className="strip h-full w-1/3 bg-no-repeat bg-size-[300%_100%] [clip-path:inset(0%_0%_0%_100%)] bg-position-[100%_50%]"
            style={{
              backgroundImage:
                "url('/images/section3-images/stripe-image.png')",
            }}
          />

          <div
            ref={text2WrapperRef}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none gap-6 px-4 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0)_70%)]"
          >
            <h1
              ref={heading2Ref}
              className="text-[clamp(3rem,7vw,7.5rem)] leading-none font-satoshi font-black tracking-tighter text-center text-[#111827]"
            >
              GET A LIVING ROADMAP.
            </h1>

            <p
              ref={label2Ref}
              className="text-lg md:text-2xl font-inter font-medium text-[#64748b] text-center max-w-3xl leading-relaxed text-balance"
            >
              Turn real job-market data into an ordered skill path — built for
              where you want to go.
            </p>
          </div>
        </div>
      </div>

      <div className="image-card-section h-full w-[200%] absolute top-0 z-6 translate-x-full flex items-center justify-around px-8">
        <div className="card card1 w-[25%] flex items-center justify-center">
          <img
            className="w-full h-auto object-contain"
            src="/images/section3-images/card1.png"
            alt=""
          />
        </div>
        <div className="card card2 w-[25%] flex items-center justify-center">
          <img
            className="w-full h-auto object-contain"
            src="/images/section3-images/card2.png"
            alt=""
          />
        </div>
        <div className="card card3 w-[25%] flex items-center justify-center">
          <img
            className="w-full h-auto object-contain"
            src="/images/section3-images/card3.png"
            alt=""
          />
        </div>
      </div>

      <div className="final-text-reveal">
        <img src="" alt="" />
      </div>
    </section>
  );
};

export default Section3;