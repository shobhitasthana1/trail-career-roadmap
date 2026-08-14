import React from 'react'
import { motion } from "framer-motion";

const HeroRight = () => {
  return (
    <div className="relative w-full flex justify-center items-center">
      <img 
        className="w-full" 
        src="/images/hero-images/trail-text.png" 
        alt="" 
      />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30vw]">
        <img 
          className="w-full" 
          src="/images/hero-images/trail-hero-mascot.png" 
          alt=""
        />
        
        <motion.img
          className="absolute bottom-20 left-3/4 -translate-x-1/2 translate-y-1/2 w-[10vw]"
          src="/images/hero-images/trail-start-exploring-badge.png"
          alt=""
          animate={{ rotate: 360 }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <motion.img
          className="absolute top-5 left-[125%] -translate-x-1/2 w-[6vw]"
          src="/images/hero-images/trail-roadmap-badge.png"
          alt=""
          animate={{ rotate: 360 }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    </div>
  )
}

export default HeroRight