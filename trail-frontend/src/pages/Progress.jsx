import { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  FiCompass,
  FiCheck,
  FiClock,
  FiCircle,
  FiArrowRight,
  FiChevronDown,
  FiChevronUp,
  FiBookmark,
  FiTrash2,
  FiX,
  FiRotateCcw,
} from "react-icons/fi";

import { useAuth } from "../context/AuthContext";
import {
  fetchMyJourneys,
  updateSkillStatus,
  removeJourney,
  removeSkillFromJourney,
  restoreSkillToJourney,
  resetJourneySkills,
} from "../services/api";
import LockScreen from "../components/LockScreen";

/* ── Locked screen for guests (Light Theme) ───────────────────────── */
const LockedProgress = () => (
  <LockScreen
    badge="Dashboard Locked"
    titlePrefix="Track your"
    titleHighlight="progress."
    message="Sign in or create a free account to unlock your personal dashboard, daily streaks, and skill milestones."
    loginText="Sign In"
    signupText="Create Account"
    previewType="progress"
  />
);

/* ── Real progress dashboard driven by Started Journeys ──────────── */
const ProgressDashboard = () => {
  const { user } = useAuth();
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedJourneySlug, setExpandedJourneySlug] = useState(null);
  const [confirmDeleteSlug, setConfirmDeleteSlug] = useState(null);
  const [undoToast, setUndoToast] = useState({
    visible: false,
    journeySlug: "",
    skillId: "",
    skillLabel: "",
    previousStatus: "not-started",
    journeyRole: "",
  });

  const undoTimerRef = useRef(null);

  const loadJourneys = useCallback(async () => {
    try {
      const data = await fetchMyJourneys();
      setJourneys(data || []);
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
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
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
        const total = updatedNodes.length;
        const pct = total > 0 ? Math.round((comp / total) * 100) : 0;

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

  // Remove a whole journey
  const handleConfirmRemoveJourney = async (slug) => {
    setJourneys((prev) => prev.filter((j) => j.slug !== slug));
    setConfirmDeleteSlug(null);
    if (expandedJourneySlug === slug) setExpandedJourneySlug(null);

    try {
      await removeJourney(slug);
    } catch {
      loadJourneys();
    }
  };

  // Remove individual skill from a journey with Undo toast
  const handleRemoveSkill = async (e, journeySlug, skill, journeyRole) => {
    e.stopPropagation();

    // Optimistic update
    setJourneys((prev) =>
      prev.map((j) => {
        if (j.slug !== journeySlug) return j;
        const updatedNodes = j.nodes.filter((n) => n.id !== skill.id);
        const comp = updatedNodes.filter((n) => n.status === "completed").length;
        const inProg = updatedNodes.filter((n) => n.status === "in-progress").length;
        const notSt = updatedNodes.filter((n) => n.status === "not-started").length;
        const total = updatedNodes.length;
        const pct = total > 0 ? Math.round((comp / total) * 100) : 0;

        const updatedStages = j.stages
          .map((stg) => {
            const stgSkills = stg.skills.filter((s) => s.id !== skill.id);
            return {
              ...stg,
              skills: stgSkills,
              total: stgSkills.length,
              completed: stgSkills.filter((s) => s.status === "completed").length,
            };
          })
          .filter((stg) => stg.skills.length > 0);

        return {
          ...j,
          nodes: updatedNodes,
          stages: updatedStages,
          totalSkills: total,
          completedCount: comp,
          inProgressCount: inProg,
          notStartedCount: notSt,
          progressPct: pct,
        };
      })
    );

    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setUndoToast({
      visible: true,
      journeySlug,
      skillId: skill.id,
      skillLabel: skill.label,
      previousStatus: skill.status,
      journeyRole,
    });

    undoTimerRef.current = setTimeout(() => {
      setUndoToast((prev) => ({ ...prev, visible: false }));
    }, 5500);

    try {
      await removeSkillFromJourney(journeySlug, skill.id);
    } catch {
      loadJourneys();
    }
  };

  // Undo remove skill
  const handleUndoRemoveSkill = async () => {
    if (!undoToast.visible) return;
    const { journeySlug, skillId, previousStatus } = undoToast;
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setUndoToast((prev) => ({ ...prev, visible: false }));

    try {
      await restoreSkillToJourney(journeySlug, skillId, previousStatus);
      await loadJourneys();
    } catch {
      loadJourneys();
    }
  };

  // Reset skills for a journey
  const handleResetSkills = async (journeySlug) => {
    try {
      await resetJourneySkills(journeySlug);
      await loadJourneys();
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
    <div className="relative min-h-screen w-full bg-[#FAFAFA] px-4 sm:px-6 md:px-10 lg:px-12 pt-28 sm:pt-36 pb-20 overflow-x-hidden font-inter selection:bg-[#7C3AED]/15 selection:text-[#6D3DF5]">
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
        {/* Header Bar - Removed Decorative Eyebrow (Section B) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8"
        >
          <div>
            <h1 className="font-geist text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111827]">
              Welcome back, {user?.name?.split(" ")[0] || "Learner"}
            </h1>
            <p className="mt-1.5 text-[#64748B] font-inter text-sm sm:text-base">
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
                const isDeleting = confirmDeleteSlug === journey.slug;
                const hasZeroSkills = (journey.totalSkills || 0) === 0;

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
                              {journey.totalSkills} Modules Remaining
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

                        <div className="flex items-center gap-2.5 flex-wrap">
                          <Link
                            to={`/explore/${journey.slug}`}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-[#6D3DF5] text-white text-xs font-semibold tracking-wide transition-colors"
                          >
                            <span>Continue in Explore</span>
                            <FiArrowRight className="w-3.5 h-3.5" />
                          </Link>

                          {/* Remove whole journey button */}
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteSlug(isDeleting ? null : journey.slug)}
                            className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-red-50 hover:border-red-200 hover:text-red-600 text-stone-500 transition-colors"
                            aria-label="Remove journey"
                            title="Remove journey"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
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

                      {/* Confirmation Inline Banner for Journey Removal */}
                      <AnimatePresence>
                        {isDeleting && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-4 p-4 rounded-2xl bg-red-50/90 border border-red-200 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                          >
                            <div>
                              <p className="text-xs sm:text-sm font-semibold text-red-900">
                                Remove the {journey.role} journey?
                              </p>
                              <p className="text-xs text-red-700">
                                Your saved progress for this roadmap will be deleted completely.
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleConfirmRemoveJourney(journey.slug)}
                                className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition-colors"
                              >
                                Remove Journey
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteSlug(null)}
                                className="px-3.5 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Progress Bar & Counts */}
                      {hasZeroSkills ? (
                        <div className="py-5 px-4 text-center bg-stone-50 rounded-2xl border border-stone-200/80 my-2">
                          <p className="font-geist text-sm sm:text-base font-semibold text-stone-700 mb-1">
                            No skills left in this journey
                          </p>
                          <p className="text-xs text-stone-500 mb-3">
                            You removed all skills from this checklist.
                          </p>
                          <div className="flex items-center justify-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleResetSkills(journey.slug)}
                              className="px-3.5 py-1.5 rounded-xl bg-[#6D3DF5] text-white text-xs font-semibold hover:bg-[#5b30d6] transition-colors"
                            >
                              Restore Full Roadmap
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteSlug(journey.slug)}
                              className="px-3.5 py-1.5 rounded-xl bg-stone-200 text-stone-700 hover:bg-red-50 hover:text-red-600 text-xs font-semibold transition-colors"
                            >
                              Remove Journey
                            </button>
                          </div>
                        </div>
                      ) : (
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
                      )}
                    </div>

                    {/* Expandable Skill-by-Skill Checklist Grouped by Stage */}
                    <AnimatePresence>
                      {isExpanded && !hasZeroSkills && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-[#FAF9FF]/80 p-6 sm:p-7 border-t border-stone-100 space-y-6"
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 font-exo">
                              Skill-by-Skill Checklist (Click to cycle status)
                            </h3>
                            <button
                              type="button"
                              onClick={() => handleResetSkills(journey.slug)}
                              className="text-[11px] font-semibold text-[#6D3DF5] hover:underline"
                            >
                              Restore All Removed Skills
                            </button>
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
                                        className={`group relative flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                                          isDone
                                            ? "bg-emerald-50/70 border-emerald-300 text-emerald-900"
                                            : isInProg
                                            ? "bg-purple-50/60 border-purple-300 text-purple-900"
                                            : "bg-stone-50/60 border-stone-200/80 text-stone-700 hover:bg-stone-100/70"
                                        }`}
                                      >
                                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                          <div
                                            className={`w-5 h-5 rounded-md flex items-center justify-center text-xs shrink-0 transition-colors ${
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
                                          <span className="text-xs sm:text-sm font-semibold truncate">
                                            {skill.label}
                                          </span>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 capitalize">
                                            {skill.status.replace("-", " ")}
                                          </span>

                                          {/* Individual Skill Remove Button */}
                                          <button
                                            type="button"
                                            onClick={(e) =>
                                              handleRemoveSkill(
                                                e,
                                                journey.slug,
                                                skill,
                                                journey.role
                                              )
                                            }
                                            className="p-1 rounded-md text-stone-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                                            title={`Remove ${skill.label} from journey`}
                                            aria-label={`Remove ${skill.label}`}
                                          >
                                            <FiX className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
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

      {/* Floating Toast with Undo Action */}
      <AnimatePresence>
        {undoToast.visible && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#111827] text-white px-4 py-3 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-md"
          >
            <span className="text-xs text-stone-300">
              Removed <strong className="text-white font-semibold">"{undoToast.skillLabel}"</strong>
            </span>
            <button
              type="button"
              onClick={handleUndoRemoveSkill}
              className="px-2.5 py-1 rounded-lg bg-[#6D3DF5] hover:bg-[#5b30d6] text-white text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1 font-exo cursor-pointer"
            >
              <FiRotateCcw className="w-3 h-3" />
              Undo
            </button>
            <button
              type="button"
              onClick={() => setUndoToast((prev) => ({ ...prev, visible: false }))}
              className="p-1 text-stone-400 hover:text-white"
              aria-label="Dismiss"
            >
              <FiX className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
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