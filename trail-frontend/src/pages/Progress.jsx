import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  FiLock,
  FiCompass,
  FiCheck,
  FiClock,
  FiCircle,
  FiArrowRight,
  FiChevronDown,
  FiChevronUp,
  FiBookmark,
} from "react-icons/fi";

import { useAuth } from "../context/AuthContext";
import { fetchMyJourneys, updateSkillStatus } from "../services/api";

/* ── Locked screen for guests (Light Theme) ───────────────────────── */
const LockedProgress = () => (
  <div className="relative min-h-screen w-full flex items-center justify-center bg-[#FAFAFA] px-4 py-24 overflow-hidden font-inter selection:bg-[#7C3AED]/15 selection:text-[#6D3DF5]">
    {/* Soft Ambient Background Glows */}
    <div className="pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_15%_20%,rgba(109,61,245,0.08)_0%,transparent_45%),radial-gradient(circle_at_85%_80%,rgba(168,85,247,0.08)_0%,transparent_45%)]" />

    {/* Subtle Radial Dot Grid */}
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: "radial-gradient(#6D3DF5 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        opacity: 0.14,
        maskImage:
          "radial-gradient(ellipse 65% 60% at 50% 50%, black 10%, transparent 75%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 65% 60% at 50% 50%, black 10%, transparent 75%)",
      }}
    />

    {/* Blurred Dashboard Preview Behind Lock */}
    <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-center">
      <div className="w-full max-w-[1000px] px-6 opacity-40 blur-[6px]">
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-28 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"
            >
              <div className="w-8 h-2 rounded-full bg-[#6D3DF5]/30 mb-3" />
              <div className="w-16 h-6 rounded-md bg-stone-200 mb-2" />
              <div className="w-24 h-3 rounded bg-stone-100" />
            </div>
          ))}
        </div>
        <div className="h-36 rounded-3xl border border-stone-200 bg-white p-6 mb-6 shadow-sm">
          <div className="w-40 h-4 rounded bg-stone-200 mb-4" />
          <div className="w-full h-4 rounded-full bg-[#6D3DF5]/20" />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="h-44 rounded-3xl border border-stone-200 bg-white" />
          <div className="h-44 rounded-3xl border border-stone-200 bg-white" />
        </div>
      </div>
    </div>

    {/* Frosted Glass Lock Card */}
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 w-full max-w-[460px]"
    >
      <div className="relative overflow-hidden rounded-[28px] border border-stone-200/90 bg-white/90 backdrop-blur-2xl p-8 sm:p-10 text-center shadow-[0_24px_60px_-15px_rgba(17,24,39,0.08),0_0_0_1px_rgba(255,255,255,0.9)_inset]">
        <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#6D3DF5] via-[#9577F4] to-[#A855F7]" />

        <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-[#6D3DF5]/10 to-[#A855F7]/10 border border-[#6D3DF5]/20 flex items-center justify-center mb-6 shadow-[0_12px_30px_-8px_rgba(109,61,245,0.2)]">
          <FiLock className="w-9 h-9 text-[#6D3DF5]" />
        </div>

        <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-[#6D3DF5]/15 bg-[#6D3DF5]/[0.06] px-3 py-1 font-exo text-[10px] font-bold uppercase tracking-[0.22em] text-[#6D3DF5]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#6D3DF5]" />
          Dashboard Locked
        </span>

        <h1 className="mt-1 font-geist text-[28px] sm:text-[34px] font-bold text-[#111827] tracking-[-0.04em] leading-[1.08]">
          Track your{" "}
          <span className="font-iowan italic font-normal bg-gradient-to-r from-[#6D3DF5] to-[#A855F7] bg-clip-text text-transparent pr-1">
            progress.
          </span>
        </h1>

        <p className="mt-2.5 text-[#64748B] font-inter text-sm sm:text-[15px] leading-relaxed mb-8">
          Sign in or create a free account to unlock your personal dashboard, daily streaks, and skill milestones.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link
            to="/login"
            className="group relative flex-1 overflow-hidden rounded-xl bg-gradient-to-r from-[#6D3DF5] via-[#7C3AED] to-[#9577F4] px-6 py-3.5 text-sm font-semibold text-white tracking-wide shadow-[0_10px_25px_-5px_rgba(109,61,245,0.4)] transition-all duration-300 hover:shadow-[0_16px_32px_-6px_rgba(109,61,245,0.55)] hover:-translate-y-0.5 active:scale-[0.98] text-center font-geist"
          >
            <span className="relative z-10">Sign In</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#7C3AED] via-[#6D3DF5] to-[#A855F7] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Link>

          <Link
            to="/signup"
            className="flex-1 rounded-xl border border-stone-200 bg-[#F8FAFC] px-6 py-3.5 text-sm font-semibold text-[#111827] tracking-wide transition-all duration-300 hover:border-[#6D3DF5]/30 hover:bg-[#6D3DF5]/[0.04] hover:text-[#6D3DF5] active:scale-[0.98] text-center font-geist"
          >
            Create Account
          </Link>
        </div>
      </div>
    </motion.div>
  </div>
);

/* ── Real progress dashboard driven by Started Journeys ──────────── */
const ProgressDashboard = () => {
  const { user } = useAuth();
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedJourneySlug, setExpandedJourneySlug] = useState(null);

  const loadJourneys = useCallback(async () => {
    try {
      const data = await fetchMyJourneys();
      setJourneys(data || []);
      // Auto-expand first journey if available
      if (data && data.length > 0 && !expandedJourneySlug) {
        setExpandedJourneySlug(data[0].slug);
      }
    } catch {
      setJourneys([]);
    } finally {
      setLoading(false);
    }
  }, [expandedJourneySlug]);

  useEffect(() => {
    let isMounted = true;
    fetchMyJourneys()
      .then((data) => {
        if (isMounted) {
          setJourneys(data || []);
          if (data && data.length > 0) {
            setExpandedJourneySlug(data[0].slug);
          }
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle skill status change directly from Progress page checklist
  const handleChecklistSkillToggle = async (journeySlug, skillId, currentStatus) => {
    const nextStatus =
      currentStatus === "completed"
        ? "not-started"
        : currentStatus === "in-progress"
        ? "completed"
        : "in-progress";

    // Optimistic UI update
    setJourneys((prev) =>
      prev.map((j) => {
        if (j.slug !== journeySlug) return j;
        const updatedNodes = j.nodes.map((n) =>
          n.id === skillId ? { ...n, status: nextStatus } : n
        );
        const comp = updatedNodes.filter((n) => n.status === "completed").length;
        const inProg = updatedNodes.filter((n) => n.status === "in-progress").length;
        const notSt = updatedNodes.filter((n) => n.status === "not-started").length;
        const pct = j.totalSkills > 0 ? Math.round((comp / j.totalSkills) * 100) : 0;

        const updatedStages = j.stages.map((stg) => {
          const stgSkills = stg.skills.map((s) =>
            s.id === skillId ? { ...s, status: nextStatus } : s
          );
          return {
            ...stg,
            skills: stgSkills,
            completed: stgSkills.filter((s) => s.status === "completed").length,
          };
        });

        return {
          ...j,
          nodes: updatedNodes,
          stages: updatedStages,
          completedCount: comp,
          inProgressCount: inProg,
          notStartedCount: notSt,
          progressPct: pct,
        };
      })
    );

    try {
      await updateSkillStatus(journeySlug, skillId, nextStatus);
    } catch {
      loadJourneys();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-2 border-[#6D3DF5] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#64748B] font-exo">
            Loading Your Learning Journeys...
          </span>
        </div>
      </div>
    );
  }

  const totalJourneysCount = journeys.length;
  const totalCompletedSkills = journeys.reduce((acc, curr) => acc + (curr.completedCount || 0), 0);
  const totalInProgressSkills = journeys.reduce((acc, curr) => acc + (curr.inProgressCount || 0), 0);

  return (
    <div className="relative min-h-screen w-full bg-[#FAFAFA] px-4 sm:px-6 md:px-10 lg:px-12 pt-32 sm:pt-40 pb-20 overflow-x-hidden font-inter selection:bg-[#7C3AED]/15 selection:text-[#6D3DF5]">
      {/* Soft Ambient Background Glows */}
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_10%_15%,rgba(109,61,245,0.07)_0%,transparent_45%),radial-gradient(circle_at_90%_85%,rgba(168,85,247,0.07)_0%,transparent_45%)]" />

      {/* Subtle Radial Dot Grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(#6D3DF5 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          opacity: 0.12,
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 30%, black 0%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 30%, black 0%, transparent 75%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
        >
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#6D3DF5]/15 bg-[#6D3DF5]/[0.06] px-3.5 py-1 font-exo text-[11px] font-bold uppercase tracking-[0.22em] text-[#6D3DF5] mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#6D3DF5]" />
              Active Learning Command Center
            </span>
            <h1 className="font-geist text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111827]">
              Welcome back, {user?.name?.split(" ")[0] || "Learner"}
            </h1>
            <p className="mt-2 text-[#64748B] font-inter text-sm sm:text-base">
              Synchronized in real-time with your active journeys and skills in Explore.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6D3DF5] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#9577F4] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-[#6D3DF5]/20 hover:shadow-lg transition-all"
            >
              <FiCompass className="w-4 h-4" />
              <span>Explore Roadmaps</span>
            </Link>
          </div>
        </motion.div>

        {/* ── EMPTY STATE (User hasn't started any roadmap yet) ───────────── */}
        {totalJourneysCount === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-stone-200/90 bg-white/95 backdrop-blur-xl p-8 sm:p-14 text-center shadow-[0_15px_40px_-15px_rgba(17,24,39,0.06)]"
          >
            <div className="mx-auto w-16 h-16 rounded-2xl bg-[#6D3DF5]/10 border border-[#6D3DF5]/20 flex items-center justify-center text-[#6D3DF5] mb-5 shadow-xs">
              <FiCompass className="w-8 h-8" />
            </div>

            <h2 className="font-geist text-2xl sm:text-3xl font-bold text-[#111827] mb-2 tracking-tight">
              You haven't started any roadmap yet
            </h2>

            <p className="text-stone-500 font-inter text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
              Open any role in Explore, click "Start Journey", and track each module as you learn.
            </p>

            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#6D3DF5] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#9577F4] text-white text-sm font-semibold tracking-wide shadow-md shadow-[#6D3DF5]/25 hover:shadow-lg transition-all active:scale-[0.98]"
            >
              <span>Explore Roadmaps</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          <>
            {/* ── Summary Stats ────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs">
                <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 font-exo mb-2">
                  Active Journeys
                </div>
                <div className="font-geist text-3xl font-extrabold text-[#111827]">
                  {totalJourneysCount}
                </div>
                <div className="text-xs text-stone-400 mt-1">Roadmaps being tracked</div>
              </div>

              <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs">
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 font-exo mb-2">
                  Skills Mastered
                </div>
                <div className="font-geist text-3xl font-extrabold text-[#111827]">
                  {totalCompletedSkills}
                </div>
                <div className="text-xs text-stone-400 mt-1">Verified modules completed</div>
              </div>

              <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs col-span-2 lg:col-span-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#6D3DF5] font-exo mb-2">
                  In Progress
                </div>
                <div className="font-geist text-3xl font-extrabold text-[#111827]">
                  {totalInProgressSkills}
                </div>
                <div className="text-xs text-stone-400 mt-1">Active learning modules</div>
              </div>
            </div>

            {/* ── Started Journeys Cards + Checklist ──────────────────────── */}
            <div className="space-y-6">
              {journeys.map((journey) => {
                const isExpanded = expandedJourneySlug === journey.slug;

                return (
                  <motion.div
                    key={journey.slug}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl border border-stone-200/90 bg-white/95 shadow-xs hover:shadow-md transition-all overflow-hidden"
                  >
                    {/* Journey Card Header */}
                    <div className="p-6 sm:p-7 border-b border-stone-100">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#6D3DF5]/10 text-[#6D3DF5] font-exo">
                              {journey.totalSkills} Modules Total
                            </span>
                            {journey.isSaved && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                                <FiBookmark className="w-3 h-3" />
                                Saved
                              </span>
                            )}
                          </div>

                          <h2 className="font-geist text-2xl font-bold text-[#111827]">
                            {journey.role}
                          </h2>
                          <p className="text-xs sm:text-sm text-stone-500 line-clamp-1 mt-0.5">
                            {journey.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <Link
                            to={`/explore/${journey.slug}`}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-[#6D3DF5] text-white text-xs font-semibold tracking-wide transition-colors"
                          >
                            <span>Continue in Explore</span>
                            <FiArrowRight className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() =>
                              setExpandedJourneySlug(isExpanded ? null : journey.slug)
                            }
                            className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-600 transition-colors"
                            aria-label="Toggle checklist"
                            title="Toggle module checklist"
                          >
                            {isExpanded ? (
                              <FiChevronUp className="w-4 h-4" />
                            ) : (
                              <FiChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar & Counts */}
                      <div>
                        <div className="flex items-center justify-between text-xs font-semibold mb-2">
                          <span className="text-stone-600">
                            {journey.completedCount} of {journey.totalSkills} skills completed
                          </span>
                          <span className="text-[#6D3DF5] font-geist font-bold text-sm">
                            {journey.progressPct}%
                          </span>
                        </div>

                        <div className="w-full h-3 rounded-full bg-stone-100 border border-stone-200/70 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#6D3DF5] to-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${journey.progressPct}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Expandable Skill-by-Skill Checklist Grouped by Stage */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-[#FAF9FF]/80 p-6 sm:p-7 border-t border-stone-100 space-y-6"
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 font-exo">
                              Skill-by-Skill Checklist (Click to update status)
                            </h3>
                            <span className="text-[11px] text-stone-400">
                              Auto-syncs with interactive flowchart
                            </span>
                          </div>

                          <div className="space-y-5">
                            {journey.stages.map((stageItem) => (
                              <div
                                key={stageItem.name}
                                className="rounded-2xl border border-stone-200/80 bg-white p-4 sm:p-5 shadow-2xs"
                              >
                                <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-100">
                                  <span className="text-xs font-bold uppercase tracking-wider text-[#6D3DF5] font-exo">
                                    {stageItem.name} Stage
                                  </span>
                                  <span className="text-xs font-semibold text-stone-500">
                                    {stageItem.completed} / {stageItem.total} done
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                  {stageItem.skills.map((skill) => {
                                    const isDone = skill.status === "completed";
                                    const isInProg = skill.status === "in-progress";

                                    return (
                                      <div
                                        key={skill.id}
                                        onClick={() =>
                                          handleChecklistSkillToggle(
                                            journey.slug,
                                            skill.id,
                                            skill.status
                                          )
                                        }
                                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                                          isDone
                                            ? "bg-emerald-50/70 border-emerald-300 text-emerald-900"
                                            : isInProg
                                            ? "bg-purple-50/60 border-purple-300 text-purple-900"
                                            : "bg-stone-50/60 border-stone-200/80 text-stone-700 hover:bg-stone-100/70"
                                        }`}
                                      >
                                        <div className="flex items-center gap-2.5">
                                          <div
                                            className={`w-5 h-5 rounded-md flex items-center justify-center text-xs transition-colors ${
                                              isDone
                                                ? "bg-emerald-600 text-white"
                                                : isInProg
                                                ? "bg-[#6D3DF5] text-white"
                                                : "border border-stone-300 bg-white text-stone-400"
                                            }`}
                                          >
                                            {isDone ? (
                                              <FiCheck className="w-3.5 h-3.5" />
                                            ) : isInProg ? (
                                              <FiClock className="w-3 h-3" />
                                            ) : (
                                              <FiCircle className="w-3 h-3" />
                                            )}
                                          </div>
                                          <span className="text-xs sm:text-sm font-semibold">
                                            {skill.label}
                                          </span>
                                        </div>

                                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 capitalize">
                                          {skill.status.replace("-", " ")}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* ── Progress Page Wrapper ─────────────────────────────────────────── */
const Progress = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="w-9 h-9 border-2 border-[#6D3DF5] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return isAuthenticated ? <ProgressDashboard /> : <LockedProgress />;
};

export default Progress;