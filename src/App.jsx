import React, { useEffect, useRef } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Section2 from './components/Section2'
import Lenis from 'lenis'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsap from 'gsap'

gsap.registerPlugin(ScrollTrigger)

const App = () => {
  const scrollRef = useRef(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.2,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const rafCallback = (time) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(rafCallback)
    gsap.ticker.lagSmoothing(0)

    const finalRefresh = () => ScrollTrigger.refresh()

    if (document.readyState === 'complete') {
      setTimeout(finalRefresh, 500)
    } else {
      window.addEventListener('load', () => setTimeout(finalRefresh, 500))
    }

    return () => {
      window.removeEventListener('load', finalRefresh)
      gsap.ticker.remove(rafCallback)
      lenis.destroy()
    }
  }, [])

  return (
    <div ref={scrollRef} className="w-full min-h-screen overflow-x-hidden bg-[#f0eeee]">
      <Navbar />
      <Hero />
      <Section2 />
    </div>
  )
}

export default App