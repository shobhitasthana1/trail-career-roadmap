import React from "react";

const topItems = [
  { text: "ELEVATE CAREER", color: "#6D3DF5" },
  { text: "MASTER SKILLS", color: "#111827" },
  { text: "LAND JOBS", color: "#6D3DF5" },
  { text: "BUILD PROJECTS", color: "#111827" },
];

const bottomItems = [
  { text: "STAY AHEAD", color: "#FFFFFF" },
  { text: "ACHIEVE GOALS", color: "#F3E8FF" },
  { text: "TRACK PROGRESS", color: "#FFFFFF" },
  { text: "YOUR ROADMAP", color: "#F3E8FF" },
];

const REPEATS_PER_TRACK = 6;

const TrackContent = ({ items, isLight }) => (
  <>
    {Array.from({ length: REPEATS_PER_TRACK }).map((_, r) =>
      items.map((item, i) => (
        <div key={`${r}-${i}`} className="flex items-center">
          <span
            className="mx-4 sm:mx-6 md:mx-8 lg:mx-10 font-satoshi text-[1.15rem] sm:text-xl md:text-2xl font-black uppercase tracking-[0.18em]"
            style={{ color: item.color }}
          >
            {item.text}
          </span>
          <span
            className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full ${
              isLight
                ? "bg-white/90 shadow-[0_0_12px_rgba(255,255,255,0.9)]"
                : "bg-[#6D3DF5] shadow-[0_0_12px_rgba(109,61,245,0.7)]"
            }`}
          ></span>
        </div>
      ))
    )}
  </>
);

const Section2Marquee = () => {
  return (
    <div className="relative flex w-full h-[150px] sm:h-[190px] md:h-[230px] flex-col items-center justify-center overflow-hidden bg-transparent my-4">
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
          animation: marquee-left 32s linear infinite;
          will-change: transform;
        }
        .animate-scroll-right {
          animation: marquee-right 32s linear infinite;
          will-change: transform;
        }
        .animate-scroll-left:hover, .animate-scroll-right:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="absolute z-10 flex w-[112vw] -left-[6vw] -rotate-[2.5deg] items-center border-y border-stone-200/80 bg-white/95 backdrop-blur-md py-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] md:py-5">
        <div className="flex w-max animate-scroll-left whitespace-nowrap">
          <TrackContent items={topItems} isLight={false} />
        </div>
      </div>

      <div className="absolute z-20 flex w-[112vw] -left-[6vw] rotate-[2.5deg] items-center border-y border-[#5B32D4] bg-gradient-to-r from-[#6D3DF5] via-[#7C3AED] to-[#8B5CF6] py-4 shadow-[0_16px_50px_-12px_rgba(109,61,245,0.55)] md:py-5">
        <div className="flex w-max animate-scroll-right whitespace-nowrap">
          <TrackContent items={bottomItems} isLight={true} />
        </div>
      </div>
    </div>
  );
};

export default Section2Marquee;