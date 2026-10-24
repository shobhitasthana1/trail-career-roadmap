import {
  useRef,
  useImperativeHandle,
  forwardRef,
  useEffect,
  useCallback,
} from "react";
import gsap from "gsap";

const roadmapSteps = [
  {
    id: "01",
    subtitle: "DISCOVER",
    title: "Find the right career path.",
    pos: 12.5,
  },
  {
    id: "02",
    subtitle: "EXPLORE",
    title: "Discover the skills that matter.",
    pos: 37.5,
  },
  {
    id: "03",
    subtitle: "BUILD",
    title: "Follow your roadmap and build skills.",
    pos: 62.5,
  },
  {
    id: "04",
    subtitle: "GROW",
    title: "Track your progress and goals.",
    pos: 87.5,
  },
];


const COLORS = {
  purple: "#7C3AED",
  purpleLight: "#9577F4",
  navy: "#111827",
  darkGray: "#374151",
  muted: "#9CA3AF",
  border: "#E7E5E4",
  white: "#FFFFFF",
  track: "#D6D3D1",
  };

const RoadmapTimeline = forwardRef((props, ref) => {
  const progressDotRef = useRef(null);
  const progressLineRef = useRef(null);
  const stepRefs = useRef([]);
  const currentStateRef = useRef(-1);

  if (stepRefs.current.length !== roadmapSteps.length) {
    stepRefs.current = roadmapSteps.map(
      (_, index) =>
        stepRefs.current[index] || {
          desktopDot: null,
          desktopSubtitle: null,
          desktopTitle: null,
          desktopCard: null,
          desktopBadge: null,
          desktopGlow: null,
          mobileDot: null,
          mobileSubtitle: null,
          mobileTitle: null,
          mobileCard: null,
          mobileLine: null,
          mobileBadge: null,
        }
    );
  }


  const applyStepState = useCallback((index, reached, active) => {
    const step = stepRefs.current[index];
    if (!step) return;

    if (step.desktopSubtitle) {
      gsap.to(step.desktopSubtitle, {
        color: active ? COLORS.purple : reached ? COLORS.purpleLight : COLORS.muted,
        duration: 0.25,
        overwrite: true,
      });
    }

    if (step.desktopTitle) {
      gsap.to(step.desktopTitle, {
        color: active || reached ? COLORS.navy : COLORS.darkGray,
        duration: 0.25,
        overwrite: true,
      });
    }

    if (step.desktopBadge) {
      gsap.to(step.desktopBadge, {
        backgroundColor: active ? COLORS.purple : "transparent",
        color: active ? COLORS.white : reached ? COLORS.purpleLight : COLORS.muted,
        borderColor: active ? COLORS.purple : reached ? "rgba(149,119,244,0.4)" : COLORS.border,
        duration: 0.3,
        overwrite: true,
      });
    }

    if (step.desktopDot) {
      gsap.to(step.desktopDot, {
        backgroundColor: active || reached ? COLORS.purple : COLORS.white,
        borderColor: active ? "#C4B5FD" : reached ? COLORS.purpleLight : COLORS.track,
        scale: active ? 1.4 : reached ? 1.08 : 1,
        boxShadow: active
          ? "0 0 0 6px rgba(124,58,237,0.14), 0 0 20px rgba(124,58,237,0.4)"
          : reached
          ? "0 0 0 3px rgba(149,119,244,0.1)"
          : "0 2px 5px rgba(15,23,42,0.08)",
        duration: 0.35,
        ease: "power2.out",
        overwrite: true,
      });
    }

    if (step.desktopGlow) {
      gsap.to(step.desktopGlow, {
        opacity: active ? 1 : 0,
        duration: 0.4,
        overwrite: true,
      });
    }

    if (step.desktopCard) {
      gsap.to(step.desktopCard, {
        backgroundColor: active ? "rgba(250,248,255,0.97)" : COLORS.white,
        borderColor: active
          ? "rgba(124,58,237,0.4)"
          : reached
          ? "rgba(149,119,244,0.25)"
          : "rgba(231,229,228,0.9)",
        boxShadow: active
          ? "0 20px 48px -18px rgba(124,58,237,0.28), 0 0 0 1px rgba(124,58,237,0.08)"
          : reached
          ? "0 10px 30px -20px rgba(124,58,237,0.14)"
          : "0 6px 20px -14px rgba(15,23,42,0.08)",
        y: active ? -8 : 0,
        scale: active ? 1.02 : 1,
        duration: 0.45,
        ease: "power3.out",
        overwrite: true,
      });
    }

    if (step.mobileSubtitle) {
      gsap.to(step.mobileSubtitle, {
        color: active ? COLORS.purple : reached ? COLORS.purpleLight : COLORS.muted,
        duration: 0.25,
        overwrite: true,
      });
    }

    if (step.mobileTitle) {
      gsap.to(step.mobileTitle, {
        color: active || reached ? COLORS.navy : COLORS.darkGray,
        duration: 0.25,
        overwrite: true,
      });
    }

    if (step.mobileBadge) {
      gsap.to(step.mobileBadge, {
        backgroundColor: active ? COLORS.purple : "transparent",
        color: active ? COLORS.white : reached ? COLORS.purpleLight : COLORS.muted,
        borderColor: active ? COLORS.purple : reached ? "rgba(149,119,244,0.4)" : COLORS.border,
        duration: 0.3,
        overwrite: true,
      });
    }

    if (step.mobileDot) {
      gsap.to(step.mobileDot, {
        backgroundColor: active || reached ? COLORS.purple : COLORS.white,
        borderColor: active ? "#C4B5FD" : reached ? COLORS.purpleLight : COLORS.track,
        scale: active ? 1.3 : reached ? 1.05 : 1,
        boxShadow: active
          ? "0 0 0 5px rgba(124,58,237,0.12), 0 0 16px rgba(124,58,237,0.35)"
          : "0 2px 5px rgba(15,23,42,0.08)",
        duration: 0.3,
        ease: "power2.out",
        overwrite: true,
      });
    }

    if (step.mobileCard) {
      gsap.to(step.mobileCard, {
        backgroundColor: active ? "rgba(250,248,255,0.97)" : COLORS.white,
        borderColor: active ? "rgba(124,58,237,0.32)" : "rgba(231,229,228,0.9)",
        boxShadow: active
          ? "0 16px 35px -18px rgba(124,58,237,0.26)"
          : "0 8px 22px -16px rgba(15,23,42,0.1)",
        y: active ? -3 : 0,
        duration: 0.35,
        ease: "power3.out",
        overwrite: true,
      });
    }

    if (step.mobileLine) {
      gsap.to(step.mobileLine, {
        backgroundColor: reached ? COLORS.purpleLight : COLORS.track,
        duration: 0.25,
        overwrite: true,
      });
    }
  }, []);

  useEffect(() => {
    if (progressDotRef.current) {
      progressDotRef.current.style.left = "12.5%";
    }

    if (progressLineRef.current) {
      progressLineRef.current.style.left = "12.5%";
      progressLineRef.current.style.width = "0%";
    }

    currentStateRef.current = 0;

    roadmapSteps.forEach((_, index) => {
      const reached = index === 0;
      const active = index === 0;
      applyStepState(index, reached, active);
    });

    return () => {
      gsap.killTweensOf(
        stepRefs.current.flatMap((step) => [
          step.desktopDot,
          step.desktopSubtitle,
          step.desktopTitle,
          step.desktopCard,
          step.desktopBadge,
          step.desktopGlow,
          step.mobileDot,
          step.mobileSubtitle,
          step.mobileTitle,
          step.mobileCard,
          step.mobileLine,
          step.mobileBadge,
        ])
      );
    };
  }, [applyStepState]);

  useImperativeHandle(ref, () => ({
    updateProgress: (progress) => {
      const safeProgress = Math.max(0, Math.min(1, progress));
      const dotPosition = 12.5 + safeProgress * 75;

      if (progressDotRef.current) {
        progressDotRef.current.style.left = `${dotPosition}%`;
      }

      if (progressLineRef.current) {
        progressLineRef.current.style.left = "12.5%";
        progressLineRef.current.style.width = `${safeProgress * 75}%`;
      }

      let activeIndex = 0;
      if (safeProgress >= 0.6666) {
        activeIndex = 2;
      } else if (safeProgress >= 0.3333) {
        activeIndex = 1;
      }

      if (safeProgress >= 0.98) {
        activeIndex = 3;
      }

      if (activeIndex !== currentStateRef.current) {
        currentStateRef.current = activeIndex;

        roadmapSteps.forEach((_, index) => {
          const reached = index <= activeIndex;
          const active = index === activeIndex;
          applyStepState(index, reached, active);
        });
      }
    },
  }));

  return (
    <div className="w-full mt-1 lg:mt-0 pb-0">
      {/* ===== Desktop / tablet rail ===== */}
      <div className="hidden md:block">
        <div className="relative w-full h-8 mb-4">
          {/* base track — dashed like rail ties for a subtle "trail" motif */}
          <div
            className="absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2 rounded-full"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, #D6D3D1 0, #D6D3D1 6px, transparent 6px, transparent 12px)",
            }}
          />

          {/* solid base line beneath the dashes for structure */}
          <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 bg-stone-200" />

          <div
            ref={progressLineRef}
            className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full z-[1] bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#A78BFA]"
            style={{
              left: "12.5%",
              width: "0%",
              boxShadow: "0 0 12px rgba(124,58,237,0.32)",
            }}
          />

          {roadmapSteps.map((step, index) => (
            <div
              key={`desktop-dot-${step.id}`}
              ref={(el) => {
                stepRefs.current[index].desktopDot = el;
              }}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-[13px] h-[13px] md:w-[15px] md:h-[15px] rounded-full border-2 bg-white z-[5]"
              style={{
                left: `${step.pos}%`,
                borderColor: index === 0 ? "#C4B5FD" : "#D6D3D1",
                backgroundColor: index === 0 ? "#7C3AED" : "#FFFFFF",
              }}
            >
              {index === 0 && (
                <span className="absolute inset-[3px] rounded-full bg-white" />
              )}
            </div>
          ))}

          <div
            ref={progressDotRef}
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-[24px] h-[24px] md:w-[28px] md:h-[28px] rounded-full bg-[#7C3AED] z-[10]"
            style={{
              left: "12.5%",
              boxShadow:
                "0 0 0 6px rgba(124,58,237,0.11), 0 0 26px rgba(124,58,237,0.4)",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-[13px] h-[13px] md:w-[15px] md:h-[15px]"
              fill="none"
            >
              <path
                d="M4 16.5V7.5C4 5 6 4 8.5 4H15.5C18 4 20 5 20 7.5V16.5C20 18 19 19 17.5 19H6.5C5 19 4 18 4 16.5Z"
                stroke="white"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path d="M4 13H20" stroke="white" strokeWidth="1.8" />
              <circle cx="7.5" cy="16" r="0.9" fill="white" />
              <circle cx="16.5" cy="16" r="0.9" fill="white" />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 w-full">
          {roadmapSteps.map((step, index) => (
            <div key={`desktop-card-${step.id}`} className="w-full">
              <div
                ref={(el) => {
                  stepRefs.current[index].desktopCard = el;
                }}
                className="group relative flex flex-col gap-2.5 min-h-[110px] lg:min-h-[120px] py-4 px-4 lg:py-5 lg:px-5 bg-white border border-stone-200 rounded-[16px] lg:rounded-[18px] overflow-hidden transition-colors duration-300"
                style={{
                  borderColor:
                    index === 0
                      ? "rgba(124,58,237,0.4)"
                      : "rgba(231,229,228,0.9)",
                }}
              >
                <div
                  ref={(el) => {
                    stepRefs.current[index].desktopGlow = el;
                  }}
                  className="pointer-events-none absolute -right-10 -top-10 w-32 h-32 rounded-full bg-violet-500/[0.09] blur-3xl"
                  style={{ opacity: index === 0 ? 1 : 0 }}
                />

                <div className="flex items-center justify-between relative z-[1]">
                  <h4
                    ref={(el) => {
                      stepRefs.current[index].desktopSubtitle = el;
                    }}
                    className="text-[10px] lg:text-[11px] font-bold tracking-[0.22em] uppercase font-exo"
                    style={{
                      color: index === 0 ? COLORS.purple : COLORS.muted,
                    }}
                  >
                    {step.subtitle}
                  </h4>

                  <span
                    ref={(el) => {
                      stepRefs.current[index].desktopBadge = el;
                    }}
                    className="flex items-center justify-center w-6 h-6 rounded-full border text-[10px] font-bold font-exo shrink-0"
                    style={{
                      backgroundColor: index === 0 ? COLORS.purple : "transparent",
                      color: index === 0 ? COLORS.white : COLORS.muted,
                      borderColor: index === 0 ? COLORS.purple : COLORS.border,
                    }}
                  >
                    {step.id}
                  </span>
                </div>

                <h5
                  ref={(el) => {
                    stepRefs.current[index].desktopTitle = el;
                  }}
                  className="relative z-[1] text-[14px] lg:text-[16px] leading-[1.35] font-semibold font-satoshi"
                  style={{
                    color: index === 0 ? COLORS.navy : COLORS.darkGray,
                  }}
                >
                  {step.title}
                </h5>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== Mobile stacked view ===== */}
      <div className="md:hidden flex flex-col gap-4 pt-3 pb-4">
        {roadmapSteps.map((step, index) => (
          <div key={`mobile-card-${step.id}`} className="flex gap-3 sm:gap-4">
            <div className="flex flex-col items-center pt-4">
              <div
                ref={(el) => {
                  stepRefs.current[index].mobileDot = el;
                }}
                className="relative flex items-center justify-center w-5 h-5 rounded-full border-2 bg-white shrink-0 z-[2]"
                style={{
                  borderColor: index === 0 ? "#C4B5FD" : COLORS.border,
                  backgroundColor: index === 0 ? COLORS.purple : COLORS.white,
                }}
              >
                <div className="w-[6px] h-[6px] rounded-full bg-white" />
              </div>

              {index !== roadmapSteps.length - 1 && (
                <div
                  ref={(el) => {
                    stepRefs.current[index].mobileLine = el;
                  }}
                  className="w-[2px] flex-1 min-h-[45px] my-2 rounded-full"
                  style={{
                    backgroundColor:
                      index === 0 ? COLORS.purpleLight : COLORS.track,
                  }}
                />
              )}
            </div>

            <div
              ref={(el) => {
                stepRefs.current[index].mobileCard = el;
              }}
              className="relative flex-1 min-w-0 flex flex-col gap-1.5 py-3.5 px-3.5 sm:py-4 sm:px-4 bg-white border border-stone-200 rounded-[16px] sm:rounded-[18px] overflow-hidden"
              style={{
                borderColor:
                  index === 0
                    ? "rgba(124,58,237,0.32)"
                    : "rgba(231,229,228,0.9)",
              }}
            >
              <div className="absolute -right-10 -bottom-10 w-28 h-28 rounded-full bg-violet-500/[0.07] blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between relative z-[1]">
                <h4
                  ref={(el) => {
                    stepRefs.current[index].mobileSubtitle = el;
                  }}
                  className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase font-exo"
                  style={{
                    color: index === 0 ? COLORS.purple : COLORS.muted,
                  }}
                >
                  {step.subtitle}
                </h4>

                <span
                  ref={(el) => {
                    stepRefs.current[index].mobileBadge = el;
                  }}
                  className="flex items-center justify-center w-5 h-5 rounded-full border text-[9px] font-bold font-exo shrink-0"
                  style={{
                    backgroundColor: index === 0 ? COLORS.purple : "transparent",
                    color: index === 0 ? COLORS.white : COLORS.muted,
                    borderColor: index === 0 ? COLORS.purple : COLORS.border,
                  }}
                >
                  {step.id}
                </span>
              </div>

              <h5
                ref={(el) => {
                  stepRefs.current[index].mobileTitle = el;
                }}
                className="relative z-[1] text-sm sm:text-base leading-snug font-semibold font-satoshi break-words"
                style={{
                  color: index === 0 ? COLORS.navy : COLORS.darkGray,
                }}
              >
                {step.title}
              </h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

RoadmapTimeline.displayName = "RoadmapTimeline";

export default RoadmapTimeline;