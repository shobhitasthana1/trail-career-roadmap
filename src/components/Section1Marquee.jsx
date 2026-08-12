import React from 'react'
import { motion } from "motion/react"

const Section1Marquee = () => {
  return (
    <div className='w-screen py-20 bg-violet-500 border-t-2 rounded-t-3xl overflow-hidden'>
<div className='text flex whitespace-nowrap text-amber-50 font-satoshi border-t-2 border-b-2'>
    <motion.h1 className='text-[11vw] font-extrabold leading-none font-exo'>WE BUILD YOUR NEXT MOVE WITH TRAIL</motion.h1>
    <motion.h1 className='text-[11vw] font-extrabold leading-none font-exo'>WE BUILD YOUR NEXT MOVE WITH TRAIL</motion.h1>
    <motion.h1 className='text-[11vw] font-extrabold leading-none font-exo'>WE BUILD YOUR NEXT MOVE WITH TRAIL</motion.h1>
</div>
    </div>
  )
}

export default Section1Marquee