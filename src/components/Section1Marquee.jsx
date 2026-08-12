import React from 'react'
import { motion } from "motion/react"
import { TiWavesOutline } from "react-icons/ti"

const Section1Marquee = () => {
  return (
    <div className="w-full py-16 md:py-24 bg-[#6D3DF5] rounded-t-2xl md:rounded-t-3xl overflow-hidden">
      <div className="flex whitespace-nowrap text-[#F8FAFC] font-satoshi border-y border-white/20 py-4 md:py-6">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: 0 }}
            animate={{ x: "-100%" }}
            transition={{ ease: "linear", repeat: Infinity, duration: 15 }}
            className="flex items-center gap-8 md:gap-16 pr-8 md:pr-16 shrink-0"
          >
            <h1 className="text-[12vw] md:text-[8vw] font-black leading-none tracking-tighter">
              WE BUILD YOUR NEXT MOVE
            </h1>
            <TiWavesOutline className="text-[10vw] md:text-[6vw] opacity-80" />
            <h1 className="text-[12vw] md:text-[8vw] font-black leading-none tracking-tighter">
              WITH TRAIL
            </h1>
            <TiWavesOutline className="text-[10vw] md:text-[6vw] opacity-80" />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Section1Marquee