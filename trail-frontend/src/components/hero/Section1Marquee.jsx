import React, { useRef } from "react";

const PHRASE_PRIMARY = "We Build Your Next Move";
const PHRASE_SECONDARY = "With Trail";
const UNITS_PER_TRACK = 10;

function TickerUnit() {
  return (
    <span className="flex items-center gap-4 md:gap-6 shrink-0 pr-4 md:pr-6">
      <span className="text-[11px] sm:text-xs md:text-sm font-semibold tracking-[0.32em] uppercase text-white">
        {PHRASE_PRIMARY}
      </span>

      <span
        aria-hidden="true"
        className="trail-spark select-none text-[10px] md:text-xs text-white/45"
      >
        ✦
      </span>

      <span
        className="text-[11px] sm:text-xs md:text-sm font-semibold tracking-[0.32em] uppercase text-transparent"
        style={{ WebkitTextStroke: "0.6px rgba(255,255,255,0.55)" }}
      >
        {PHRASE_SECONDARY}
      </span>

      <span
        aria-hidden="true"
        className="trail-spark select-none text-[10px] md:text-xs text-white/45"
      >
        ✦
      </span>
    </span>
  );
}

export default function Section1Marquee() {
  const wrapRef = useRef(null);
  const glowRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!wrapRef.current || !glowRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    glowRef.current.style.transform = `translateX(${x - 150}px)`;
  };

  return (
    <div
      ref={wrapRef}
      onMouseMove={handleMouseMove}
      /* Yahan -mt-8 md:-mt-14 aur z-20 add kiya hai gap khatam karne ke liye */
      className="trail-marquee group relative z-20 -mt-5 md:-mt-10 w-full overflow-hidden bg-[#6D3DF5] hover:bg-[#0C0A18] transition-colors duration-700 ease-out rounded-t-2xl md:rounded-t-3xl shadow-[0_-10px_30px_rgba(0,0,0,0.03)]"
      style={{
        maskImage:
          "linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%)",
      }}
    >
      <style>{`
        @keyframes trail-marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes trail-spark-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .trail-marquee .trail-track {
          animation: trail-marquee-scroll 32s linear infinite;
          will-change: transform;
        }
        .trail-marquee:hover .trail-track {
          animation-duration: 90s;
        }
        .trail-spark {
          display: inline-block;
          animation: trail-spark-spin 7s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .trail-marquee .trail-track,
          .trail-spark {
            animation: none;
          }
        }
      `}</style>

      <div className="absolute top-0 left-0 right-0 h-px bg-white/15" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/15" />

      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 h-full w-[300px] rounded-full blur-3xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />

      <div className="relative flex py-3.5 md:py-4">
        <div className="trail-track flex w-max items-center">
          {Array.from({ length: UNITS_PER_TRACK * 2 }).map((_, i) => (
            <TickerUnit key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}