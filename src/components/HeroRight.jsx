import React from "react";
import { motion, useReducedMotion } from "motion/react";

const HeroRight = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative w-full flex justify-center items-center">
      <img className="w-full" src="/images/hero-images/trail-text.png" alt="" />

      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[65vw] sm:w-[50vw] md:w-[45vw] lg:w-[30vw]"
        animate={shouldReduceMotion ? {} : { y: [0, -14, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <img
          className="w-full"
          src="/images/hero-images/trail-hero-mascot.png"
          alt=""
        />

        <motion.img
          className="absolute bottom-6 sm:bottom-10 md:bottom-14 lg:bottom-20 left-3/4 -translate-x-1/2 translate-y-1/2 w-[22vw] sm:w-[16vw] md:w-[14vw] lg:w-[10vw]"
          src="/images/hero-images/trail-start-exploring-badge.png"
          alt=""
          animate={shouldReduceMotion ? {} : { rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />

        <motion.img
          className="absolute top-0 sm:top-2 md:top-3 lg:top-5 left-[110%] sm:left-[115%] lg:left-[125%] -translate-x-1/2 w-[14vw] sm:w-[10vw] md:w-[8vw] lg:w-[6vw]"
          src="/images/hero-images/trail-roadmap-badge.png"
          alt=""
          animate={shouldReduceMotion ? {} : { rotate: -360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    </div>
  );
};

export default HeroRight;