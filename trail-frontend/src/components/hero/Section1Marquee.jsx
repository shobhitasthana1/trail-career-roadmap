
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
    <div className="trail-stage relative flex w-full flex-col items-center justify-center overflow-hidden bg-transparent">
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
          height: 130px;
          margin-top: -24px;
          z-index: 20;
        }
        @media (min-width: 640px) {
          .trail-stage { height: 165px; }
        }
        @media (min-width: 768px) {
          .trail-stage { height: 200px; margin-top: -48px; }
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
          padding-top: 0.875rem;
          padding-bottom: 0.875rem;
          transform: scale(1);
          transition: transform 0.35s ease, filter 0.35s ease, box-shadow 0.35s ease;
        }
        @media (min-width: 768px) {
          .trail-ribbon { padding-top: 1.25rem; padding-bottom: 1.25rem; }
        }

        .trail-ribbon--top {
          background-image: linear-gradient(112deg, #110C1C 0%, #1D1830 22%, #2C2350 50%, #1D1830 76%, #130E20 100%);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.16),
            inset 0 -14px 22px -14px rgba(0,0,0,0.75),
            0 18px 45px -18px rgba(0,0,0,0.7),
            0 6px 24px rgba(0,0,0,0.35);
        }
        .trail-ribbon--top:hover {
          filter: brightness(1.1) saturate(1.08);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.26),
            inset 0 -14px 22px -14px rgba(0,0,0,0.8),
            0 22px 55px -16px rgba(109,61,245,0.4),
            0 8px 28px rgba(0,0,0,0.45);
        }

        .trail-ribbon--bottom {
          background-image: linear-gradient(112deg, #5A2EDD 0%, #6D3DF5 20%, #7C3AED 45%, #8B5CF6 65%, #7C3AED 85%, #6427D6 100%);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.45),
            inset 0 -14px 22px -14px rgba(30,10,70,0.6),
            0 20px 55px -16px rgba(109,61,245,0.55),
            0 6px 26px rgba(124,58,237,0.35);
        }
        .trail-ribbon--bottom:hover {
          filter: brightness(1.06) saturate(1.1);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.6),
            inset 0 -14px 22px -14px rgba(30,10,70,0.65),
            0 26px 65px -14px rgba(139,92,246,0.65),
            0 10px 32px rgba(124,58,237,0.5);
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
            rgba(255,255,255,0.30) 0%,
            rgba(255,255,255,0.07) 10%,
            rgba(255,255,255,0.00) 26%,
            rgba(0,0,0,0.00) 55%,
            rgba(0,0,0,0.24) 78%,
            rgba(0,0,0,0.5) 100%
          );
        }
        .trail-ribbon--bottom .trail-shade {
          background-image: linear-gradient(
            to bottom,
            rgba(255,255,255,0.5) 0%,
            rgba(255,255,255,0.14) 12%,
            rgba(255,255,255,0.00) 30%,
            rgba(0,0,0,0.00) 56%,
            rgba(0,0,0,0.2) 80%,
            rgba(0,0,0,0.38) 100%
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
        .trail-ribbon:hover .trail-sheen {
          animation-duration: 2.4s;
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
        .trail-ribbon:hover .trail-spark {
          animation-duration: 2.4s;
        }
        .trail-dot {
          display: inline-block;
          background: currentColor;
        }
        .trail-ribbon--top .trail-dot { background: #C4B5FD; }
        .trail-ribbon--bottom .trail-dot { background: #FFFFFF; }

        @media (prefers-reduced-motion: reduce) {
          .trail-scroll-left,
          .trail-scroll-right,
          .trail-spark,
          .trail-sheen,
          .trail-shade {
            animation: none !important;
          }
          .trail-ribbon,
          .trail-ribbon:hover {
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <div
        className="trail-ribbon-shell absolute z-10"
        style={{ transform: "perspective(900px) rotateX(6deg) rotateZ(-2.5deg)" }}
      >
        <div className="trail-ribbon trail-ribbon--top">
          <span aria-hidden="true" className="trail-shade" />
          <span aria-hidden="true" className="trail-sheen" />
          <div className="trail-track flex w-max trail-scroll-left whitespace-nowrap">
            <TrackContent items={topItems} palette={topPalette} />
          </div>
        </div>
      </div>

      <div
        className="trail-ribbon-shell absolute z-20"
        style={{ transform: "perspective(900px) rotateX(-6deg) rotateZ(2.5deg)" }}
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