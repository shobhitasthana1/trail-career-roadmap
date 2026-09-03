import React from "react";

const topItems = [
  { text: "FIND YOUR PATH", tier: "primary" },
  { text: "LEARN WHAT EMPLOYERS WANT", tier: "secondary" },
  { text: "TRACK YOUR PROGRESS", tier: "primary" },
  { text: "REACH YOUR NEXT ROLE", tier: "secondary" },
];

const bottomItems = [
  { text: "KNOW WHERE TO GO", tier: "primary" },
  { text: "KNOW WHAT TO LEARN", tier: "secondary" },
  { text: "FOLLOW THE SIGNAL", tier: "primary" },
  { text: "BUILD YOUR NEXT MOVE", tier: "secondary" },
];

const REPEATS_PER_TRACK = 6;

const topPalette = {
  primaryText: "#F6F2FF",
  secondaryText: "#B9A6F2",
  sparkColor: "rgba(199, 182, 255, 0.85)",
  dotGlow: "0 0 10px rgba(168, 139, 250, 0.85), 0 0 2px rgba(255,255,255,0.6)",
  textShadow: "0 1px 2px rgba(0,0,0,0.65), 0 0 18px rgba(139,92,246,0.18)",
};

const bottomPalette = {
  primaryText: "#FFFFFF",
  secondaryText: "#F3E8FF",
  sparkColor: "rgba(255, 255, 255, 0.9)",
  dotGlow: "0 0 10px rgba(255,255,255,0.9), 0 0 2px rgba(255,255,255,0.6)",
  textShadow: "0 1px 2px rgba(29,15,60,0.45), 0 0 16px rgba(29,15,60,0.15)",
};

const TrackContent = ({ items, palette }) => (
  <>
    {Array.from({ length: REPEATS_PER_TRACK }).map((_, r) =>
      items.map((item, i) => {
        const useSpark = (r * items.length + i) % 3 === 0;
        const isPrimary = item.tier === "primary";
        return (
          <div key={`${r}-${i}`} className="flex items-center">
            <span
              className={
                "mx-4 sm:mx-6 md:mx-8 lg:mx-10 font-geist uppercase whitespace-nowrap " +
                (isPrimary
                  ? "text-base sm:text-lg md:text-xl font-bold tracking-[0.18em]"
                  : "text-sm sm:text-base md:text-lg font-semibold tracking-[0.14em]")
              }
              style={{
                color: isPrimary ? palette.primaryText : palette.secondaryText,
                textShadow: palette.textShadow,
                opacity: isPrimary ? 1 : 0.9,
              }}
            >
              {item.text}
            </span>
            {useSpark ? (
              <span
                aria-hidden="true"
                className="trail-spark select-none text-xs"
                style={{ color: palette.sparkColor }}
              >
                ✦
              </span>
            ) : (
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full trail-dot"
                style={{ boxShadow: palette.dotGlow }}
              />
            )}
          </div>
        );
      })
    )}
  </>
);

export default function Section1Marquee() {
  return (
    <div className="trail-stage relative flex w-full flex-col items-center justify-center overflow-hidden bg-transparent my-2">
      <style>{`
        @keyframes trail-marquee-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes trail-marquee-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        @keyframes trail-sheen-sweep {
          0%   { background-position: -170% 0; }
          100% { background-position: 170% 0; }
        }

        @keyframes trail-shade-turn {
          0%, 100% { background-position: 0% 0%; }
          50%      { background-position: 0% 14%; }
        }

        @keyframes trail-spark-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .trail-stage {
          height: 110px;
          z-index: 10;
          overflow: visible;
        }
        @media (min-width: 640px) {
          .trail-stage { height: 130px; }
        }
        @media (min-width: 768px) {
          .trail-stage { height: 150px; }
        }

        .trail-ribbon-shell {
          position: absolute;
          width: 112vw;
          left: -6vw;
        }

        .trail-ribbon {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          display: flex;
          align-items: center;
          padding-top: 0.75rem;
          padding-bottom: 0.75rem;
          transform: scale(1);
          transition: transform 0.35s ease, filter 0.35s ease, box-shadow 0.35s ease;
        }
        @media (min-width: 768px) {
          .trail-ribbon { padding-top: 1rem; padding-bottom: 1rem; }
        }

        .trail-ribbon--top {
          background-image: linear-gradient(112deg, #110C1C 0%, #1D1830 22%, #2C2350 50%, #1D1830 76%, #130E20 100%);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.12),
            0 10px 30px -10px rgba(0,0,0,0.5);
        }
        .trail-ribbon--top:hover {
          filter: brightness(1.1) saturate(1.08);
        }

        .trail-ribbon--bottom {
          background-image: linear-gradient(112deg, #5A2EDD 0%, #6D3DF5 20%, #7C3AED 45%, #8B5CF6 65%, #7C3AED 85%, #6427D6 100%);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.3),
            0 12px 35px -10px rgba(109,61,245,0.4);
        }
        .trail-ribbon--bottom:hover {
          filter: brightness(1.06) saturate(1.1);
        }

        .trail-ribbon:hover {
          transform: scale(1.015);
        }

        .trail-shade {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-repeat: no-repeat;
          background-size: 100% 170%;
          animation: trail-shade-turn 9s ease-in-out infinite;
        }
        .trail-ribbon--top .trail-shade {
          background-image: linear-gradient(
            to bottom,
            rgba(255,255,255,0.2) 0%,
            rgba(255,255,255,0.05) 10%,
            transparent 30%,
            transparent 70%,
            rgba(0,0,0,0.3) 100%
          );
        }
        .trail-ribbon--bottom .trail-shade {
          background-image: linear-gradient(
            to bottom,
            rgba(255,255,255,0.3) 0%,
            rgba(255,255,255,0.1) 10%,
            transparent 30%,
            transparent 70%,
            rgba(0,0,0,0.2) 100%
          );
        }

        .trail-sheen {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-repeat: no-repeat;
          background-size: 260% 100%;
          mix-blend-mode: screen;
        }
        .trail-ribbon--top .trail-sheen {
          background-image: linear-gradient(
            100deg,
            transparent 0%, transparent 42%,
            rgba(196,181,253,0.35) 48.5%,
            rgba(255,255,255,0.62) 50%,
            rgba(196,181,253,0.35) 51.5%,
            transparent 58%, transparent 100%
          );
          animation: trail-sheen-sweep 6.5s linear infinite;
        }
        .trail-ribbon--bottom .trail-sheen {
          background-image: linear-gradient(
            100deg,
            transparent 0%, transparent 40%,
            rgba(255,255,255,0.4) 48%,
            rgba(255,255,255,0.85) 50%,
            rgba(255,255,255,0.4) 52%,
            transparent 60%, transparent 100%
          );
          animation: trail-sheen-sweep 5.5s linear infinite;
          animation-delay: -2s;
        }

        .trail-track {
          position: relative;
          z-index: 2;
        }
        .trail-scroll-left {
          animation: trail-marquee-left 36s linear infinite;
          will-change: transform;
        }
        .trail-scroll-right {
          animation: trail-marquee-right 32s linear infinite;
          will-change: transform;
        }

        .trail-spark {
          display: inline-block;
          animation: trail-spark-spin 6s linear infinite;
        }
        .trail-dot {
          display: inline-block;
          background: currentColor;
        }
        .trail-ribbon--top .trail-dot { background: #C4B5FD; }
        .trail-ribbon--bottom .trail-dot { background: #FFFFFF; }
      `}</style>

      {/* back ribbon */}
      <div
        className="trail-ribbon-shell absolute z-10"
        style={{ transform: "perspective(900px) rotateX(4deg) rotateZ(-2deg)", backfaceVisibility: "hidden" }}
      >
        <div className="trail-ribbon trail-ribbon--top">
          <span aria-hidden="true" className="trail-shade" />
          <span aria-hidden="true" className="trail-sheen" />
          <div className="trail-track flex w-max trail-scroll-left whitespace-nowrap">
            <TrackContent items={topItems} palette={topPalette} />
          </div>
        </div>
      </div>

      {/* front ribbon */}
      <div
        className="trail-ribbon-shell absolute z-20"
        style={{ transform: "perspective(900px) rotateX(-4deg) rotateZ(2deg)", backfaceVisibility: "hidden" }}
      >
        <div className="trail-ribbon trail-ribbon--bottom">
          <span aria-hidden="true" className="trail-shade" />
          <span aria-hidden="true" className="trail-sheen" />
          <div className="trail-track flex w-max trail-scroll-right whitespace-nowrap">
            <TrackContent items={bottomItems} palette={bottomPalette} />
          </div>
        </div>
      </div>
    </div>
  );
}