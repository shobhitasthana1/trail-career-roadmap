import React from "react";

const items = [
  { text: "DISCOVER", color: "#6D3DF5" },
  { text: "LEARN", color: "#111827" },
  { text: "BUILD", color: "#6D3DF5" },
  { text: "SPECIALIZE", color: "#111827" },
];

const REPEATS_PER_TRACK = 6;

const TrackContent = () => (
  <>
    {Array.from({ length: REPEATS_PER_TRACK }).map((_, r) =>
      items.map((item, i) => (
        <div key={`${r}-${i}`} className="flex items-center">
          <span
            className="mx-4 sm:mx-6 md:mx-8 lg:mx-10 xl:mx-12 font-satoshi text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black uppercase tracking-tight"
            style={{ color: item.color }}
          >
            {item.text}
          </span>
          <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 md:h-2.5 md:w-2.5 lg:h-3 lg:w-3 rounded-full bg-[#6D3DF5] shadow-[0_0_8px_rgba(109,61,245,0.6)]"></span>
        </div>
      ))
    )}
  </>
);

const Section2Marquee = () => {
  return (
    <div className="relative w-full overflow-hidden border-y border-[#E5E7EB] bg-white py-2.5 sm:py-3 md:py-4 lg:py-5">
      <div className="flex w-max animate-marquee whitespace-nowrap will-change-transform">
        <div className="flex shrink-0 items-center">
          <TrackContent />
        </div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          <TrackContent />
        </div>
      </div>
    </div>
  );
};

export default Section2Marquee;