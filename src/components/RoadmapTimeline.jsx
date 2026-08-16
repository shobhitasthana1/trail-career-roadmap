import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  useEffect,
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
    subtitle: "LEARN",
    title: "Build the skills that matter.",
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
          mobileDot: null,
          mobileSubtitle: null,
          mobileTitle: null,
          mobileCard: null,
          mobileLine: null,
        }
    );
  }

  const COLORS = {
    purple: "#7C3AED",
    purpleLight: "#9577F4",
    navy: "#111827",
    darkGray: "#374151",
    muted: "#6B7280",
    border: "#E7E5E4",
    white: "#FFFFFF",
  };

  const applyStepState = (index, reached, active) => {
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

    if (step.desktopDot) {
      gsap.to(step.desktopDot, {
        backgroundColor: active || reached ? COLORS.purple : COLORS.white,
        borderColor: active ? "#C4B5FD" : reached ? COLORS.purpleLight : COLORS.border,
        scale: active ? 1.35 : reached ? 1.05 : 1,
        boxShadow: active
          ? "0 0 0 6px rgba(124,58,237,0.13), 0 0 18px rgba(124,58,237,0.35)"
          : reached
          ? "0 0 0 3px rgba(149,119,244,0.08)"
          : "0 2px 5px rgba(15,23,42,0.08)",
        duration: 0.3,
        ease: "power2.out",
        overwrite: true,
      });
    }

    if (step.desktopCard) {
      gsap.to(step.desktopCard, {
        backgroundColor: active ? "rgba(245,243,255,0.95)" : COLORS.white,
        borderColor: active
          ? "rgba(124,58,237,0.35)"
          : reached
          ? "rgba(149,119,244,0.22)"
          : "rgba(231,229,228,0.9)",
        boxShadow: active
          ? "0 18px 45px -18px rgba(124,58,237,0.25), 0 0 0 1px rgba(124,58,237,0.06)"
          : reached
          ? "0 10px 30px -20px rgba(124,58,237,0.12)"
          : "0 6px 24px -12px rgba(15,23,42,0.08)",
        y: active ? -7 : 0,
        scale: active ? 1.015 : 1,
        duration: 0.4,
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

    if (step.mobileDot) {
      gsap.to(step.mobileDot, {
        backgroundColor: active || reached ? COLORS.purple : COLORS.white,
        borderColor: active ? "#C4B5FD" : reached ? COLORS.purpleLight : COLORS.border,
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
        backgroundColor: active ? "rgba(245,243,255,0.96)" : COLORS.white,
        borderColor: active ? "rgba(124,58,237,0.3)" : "rgba(231,229,228,0.9)",
        boxShadow: active
          ? "0 16px 35px -18px rgba(124,58,237,0.25)"
          : "0 8px 25px -16px rgba(15,23,42,0.1)",
        y: active ? -3 : 0,
        duration: 0.35,
        ease: "power3.out",
        overwrite: true,
      });
    }

    if (step.mobileLine) {
      gsap.to(step.mobileLine, {
        backgroundColor: reached ? COLORS.purpleLight : COLORS.border,
        duration: 0.25,
        overwrite: true,
      });
    }
  };

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
          step.mobileDot,
          step.mobileSubtitle,
          step.mobileTitle,
          step.mobileCard,
          step.mobileLine,
        ])
      );
    };
  }, []);

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
    <div className="w-full mt-1 lg:mt-0 pb-6">
      <div className="hidden lg:block">
        <div className="relative w-full h-6 mb-3">
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#D6D3D1] -translate-y-1/2 rounded-full" />

          <div
            ref={progressLineRef}
            className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full z-[1] bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#A78BFA]"
            style={{
              left: "12.5%",
              width: "0%",
              boxShadow: "0 0 10px rgba(124,58,237,0.28)",
            }}
          />

          {roadmapSteps.map((step, index) => (
            <div
              key={`desktop-dot-${step.id}`}
              ref={(el) => {
                stepRefs.current[index].desktopDot = el;
              }}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-[14px] h-[14px] rounded-full border-2 bg-white z-[5]"
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
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-[26px] h-[26px] rounded-full bg-[#7C3AED] z-[10]"
            style={{
              left: "12.5%",
              boxShadow:
                "0 0 0 6px rgba(124,58,237,0.10), 0 0 24px rgba(124,58,237,0.38)",
            }}
          >
            <div className="w-[8px] h-[8px] rounded-full bg-white" />
          </div>
        </div>

        <div className="grid grid-cols-4 w-full">
          {roadmapSteps.map((step, index) => (
            <div key={`desktop-card-${step.id}`} className="w-full px-2">
              <div
                ref={(el) => {
                  stepRefs.current[index].desktopCard = el;
                }}
                className="group relative flex flex-col gap-2 min-h-[105px] py-4 px-5 bg-white border border-stone-200 rounded-[18px] overflow-hidden transition-colors duration-300"
                style={{
                  borderColor:
                    index === 0
                      ? "rgba(124,58,237,0.35)"
                      : "rgba(231,229,228,0.9)",
                }}
              >
                <div className="pointer-events-none absolute -right-12 -bottom-12 w-36 h-36 rounded-full bg-violet-500/[0.06] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute top-0 left-5 w-8 h-[2px] rounded-full bg-gradient-to-r from-violet-500 to-purple-300 opacity-70" />

                <h4
                  ref={(el) => {
                    stepRefs.current[index].desktopSubtitle = el;
                  }}
                  className="relative z-[1] text-[11px] font-bold tracking-[0.24em] uppercase font-exo"
                  style={{
                    color: index === 0 ? COLORS.purple : COLORS.muted,
                  }}
                >
                  {step.id} — {step.subtitle}
                </h4>

                <h5
                  ref={(el) => {
                    stepRefs.current[index].desktopTitle = el;
                  }}
                  className="relative z-[1] text-[16px] leading-[1.3] font-semibold font-satoshi max-w-[95%]"
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

      <div className="lg:hidden flex flex-col gap-4 pt-3 pb-4">
        {roadmapSteps.map((step, index) => (
          <div key={`mobile-card-${step.id}`} className="flex gap-4">
            <div className="flex flex-col items-center pt-4">
              <div
                ref={(el) => {
                  stepRefs.current[index].mobileDot = el;
                }}
                className="relative flex items-center justify-center w-5 h-5 rounded-full border-2 bg-white shrink-0 z-[2]"
                style={{
                  borderColor:
                    index === 0 ? "#C4B5FD" : COLORS.border,
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
                      index === 0 ? COLORS.purpleLight : COLORS.border,
                  }}
                />
              )}
            </div>

            <div
              ref={(el) => {
                stepRefs.current[index].mobileCard = el;
              }}
              className="relative flex-1 flex flex-col gap-1.5 py-4 px-4 bg-white border border-stone-200 rounded-[18px] overflow-hidden"
              style={{
                borderColor:
                  index === 0
                    ? "rgba(124,58,237,0.3)"
                    : "rgba(231,229,228,0.9)",
              }}
            >
              <div className="absolute top-0 left-4 w-7 h-[2px] rounded-full bg-gradient-to-r from-violet-500 to-purple-300" />

              <div className="absolute -right-10 -bottom-10 w-28 h-28 rounded-full bg-violet-500/[0.06] blur-2xl pointer-events-none" />

              <h4
                ref={(el) => {
                  stepRefs.current[index].mobileSubtitle = el;
                }}
                className="relative z-[1] text-[11px] font-bold tracking-[0.2em] uppercase font-exo"
                style={{
                  color: index === 0 ? COLORS.purple : COLORS.muted,
                }}
              >
                {step.id} — {step.subtitle}
              </h4>

              <h5
                ref={(el) => {
                  stepRefs.current[index].mobileTitle = el;
                }}
                className="relative z-[1] text-base leading-snug font-semibold font-satoshi"
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