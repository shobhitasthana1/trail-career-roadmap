import React from "react";

const topItems = [
  { text: "ELEVATE CAREER", color: "#6D3DF5" },
  { text: "MASTER SKILLS", color: "#111827" },
  { text: "LAND JOBS", color: "#6D3DF5" },
  { text: "BUILD PROJECTS", color: "#111827" },
];

const bottomItems = [
  { text: "STAY AHEAD", color: "#FFFFFF" },
  { text: "ACHIEVE GOALS", color: "#E9D5FF" },
  { text: "TRACK PROGRESS", color: "#FFFFFF" },
  { text: "YOUR ROADMAP", color: "#E9D5FF" },
];

const REPEATS_PER_TRACK = 6;

const TrackContent = ({ items, isLight }) => (
  <>
    {Array.from({ length: REPEATS_PER_TRACK }).map((_, r) =>
      items.map((item, i) => (
        <div key={`${r}-${i}`} className="flex items-center">
          <span
            className="mx-4 sm:mx-6 md:mx-8 lg:mx-10 font-satoshi text-[1.1rem] sm:text-xl md:text-2xl font-black uppercase tracking-[0.15em]"
            style={{ color: item.color }}
          >
            {item.text}
          </span>
          <span
            className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full ${
              isLight
                ? "bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                : "bg-[#6D3DF5] shadow-[0_0_10px_rgba(109,61,245,0.6)]"
            }`}
          ></span>
        </div>
      ))
    )}
  </>
);

const Section2Marquee = () => {
  return (
    <div className="relative flex w-full h-[140px] sm:h-[180px] md:h-[220px] flex-col items-center justify-center overflow-hidden bg-transparent">
      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-left {
          animation: marquee-left 35s linear infinite;
          will-change: transform;
        }
        .animate-scroll-right {
          animation: marquee-right 35s linear infinite;
          will-change: transform;
        }
        .animate-scroll-left:hover, .animate-scroll-right:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="absolute z-10 flex w-[110vw] -left-[5vw] -rotate-[3deg] items-center border-y border-stone-200 bg-white py-3.5 shadow-sm md:py-5">
        <div className="flex w-max animate-scroll-left whitespace-nowrap">
          <TrackContent items={topItems} isLight={false} />
        </div>
      </div>

      <div className="absolute z-20 flex w-[110vw] -left-[5vw] rotate-[3deg] items-center border-y border-[#5B32D4] bg-[#6D3DF5] py-3.5 shadow-[0_12px_40px_-10px_rgba(109,61,245,0.6)] md:py-5">
        <div className="flex w-max animate-scroll-right whitespace-nowrap">
          <TrackContent items={bottomItems} isLight={true} />
        </div>
      </div>
    </div>
  );
};

export default Section2Marquee;