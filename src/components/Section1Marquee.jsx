import React from 'react'
import { motion } from "framer-motion"
import { TiWavesOutline } from "react-icons/ti"

const marqueeContent = (
  <>
    <h1 className="text-[7vw] sm:text-[6vw] md:text-[4.5vw] font-black uppercase tracking-tight">
      WE BUILD YOUR NEXT MOVE
    </h1>
    <TiWavesOutline className="text-[5vw] sm:text-[4vw] md:text-[3vw] opacity-70 group-hover:text-[#6D3DF5] group-hover:opacity-100 transition-all duration-500 ease-in-out" />
    <h1 className="text-[7vw] sm:text-[6vw] md:text-[4.5vw] font-black uppercase tracking-tight">
      WITH TRAIL
    </h1>
    <TiWavesOutline className="text-[5vw] sm:text-[4vw] md:text-[3vw] opacity-70 group-hover:text-[#6D3DF5] group-hover:opacity-100 transition-all duration-500 ease-in-out" />
  </>
);

const Section1Marquee = () => {
  return (
    <div className="relative z-10 group w-full py-10 sm:py-12 md:py-14 bg-[#6D3DF5] hover:bg-[#111827] transition-colors duration-700 ease-in-out rounded-t-2xl md:rounded-t-3xl overflow-hidden flex shadow-lg">
      <div className="flex whitespace-nowrap text-[#F8FAFC] font-satoshi border-y border-white/15 group-hover:border-[#6D3DF5]/30 transition-colors duration-700 ease-in-out py-3 sm:py-4 md:py-5 w-full">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: 0 }}
            animate={{ x: "-100%" }}
            transition={{ ease: "linear", repeat: Infinity, duration: 22 }}
            className="flex items-center gap-6 sm:gap-10 md:gap-12 pr-6 sm:pr-10 md:pr-12 shrink-0 select-none"
          >
            {marqueeContent}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Section1Marquee