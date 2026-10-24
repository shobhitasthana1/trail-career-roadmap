import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  FiX,
  FiCheck,
  FiClock,
  FiCircle,
  FiTrendingUp,
  FiArrowRight,
  FiCompass,
  FiLock,
  FiLayers,
} from "react-icons/fi";

const stageStyles = {
  Foundation: "bg-blue-50 text-blue-700 border-blue-200/80",
  Core: "bg-[#6D3DF5]/10 text-[#6D3DF5] border-[#6D3DF5]/20",
  Database: "bg-teal-50 text-teal-700 border-teal-200/80",
  "Role-Specific": "bg-indigo-50 text-indigo-700 border-indigo-200/80",
  Advanced: "bg-amber-50 text-amber-700 border-amber-200/80",
  "Tools & Deployment": "bg-rose-50 text-rose-700 border-rose-200/80",
};

const SkillDetailPanel = ({
  skill,
  isOpen,
  onClose,
  currentStatus = "not-started",
  onStatusChange,
  isLoggedIn = false,
  roadmapSlug = "",
  allNodes = [],
  allEdges = [],
  roleName = "",
  onSelectSkill,
  hasStartedJourney = false,
  onStartJourney,
  startingJourney = false,
}) => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 640 : false
  );

  // Responsive check
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Extract individual topics from description
  const topics = skill?.description
    ? skill.description
        .replace(/\.$/, "")
        .split(",")
        .map((t) => t.trim().replace(/^and\s+/i, ""))
        .filter((t) => t.length > 0)
    : [];

  // Prerequisites ("Learn after") and Unlocks ("Unlocks next")
  const incomingSources = skill?.id
    ? allEdges.filter((e) => e.target === skill.id).map((e) => e.source)
    : [];
  const outgoingTargets = skill?.id
    ? allEdges.filter((e) => e.source === skill.id).map((e) => e.target)
    : [];

  const prerequisites = allNodes.filter((n) => incomingSources.includes(n.id));
  const unlocks = allNodes.filter((n) => outgoingTargets.includes(n.id));

  const nodeIdx = skill?.id ? allNodes.findIndex((n) => n.id === skill.id) : -1;
  const positionText =
    nodeIdx !== -1
      ? `Skill ${nodeIdx + 1} of ${allNodes.length} · ${roleName || "Roadmap"}`
      : `${roleName || "Roadmap"}`;

  if (!isOpen || !skill) return null;

  const stage = skill.stage || "Core";
  const stageBadgeClass = stageStyles[stage] || stageStyles.Core;
  const demandNum = parseInt(skill.marketDemand, 10) || 85;
  const demandLabel =
    demandNum >= 75 ? "High demand" : demandNum >= 50 ? "Growing demand" : "Niche demand";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-stretch sm:justify-end">
        {/* Backdrop overlay with blur & click outside to close */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs"
        />

        {/* Slide-in Drawer (Desktop) / Bottom Sheet (Mobile) */}
        <motion.div
          initial={{
            opacity: 0,
            x: isMobile ? 0 : "100%",
            y: isMobile ? "100%" : 0,
          }}
          animate={{
            opacity: 1,
            x: 0,
            y: 0,
          }}
          exit={{
            opacity: 0,
            x: isMobile ? 0 : "100%",
            y: isMobile ? "100%" : 0,
          }}
          transition={{ type: "spring", damping: 28, stiffness: 290 }}
          data-lenis-prevent
          className="relative z-10 w-full sm:w-[420px] max-h-[85vh] sm:max-h-full h-auto sm:h-full bg-white border-t sm:border-t-0 sm:border-l border-stone-200/90 text-[#111827] flex flex-col shadow-2xl overflow-hidden font-inter rounded-t-3xl sm:rounded-none"
        >
          {/* Mobile drag handle */}
          <div className="sm:hidden w-12 h-1.5 bg-stone-300 rounded-full mx-auto my-2.5 shrink-0" />

          {/* Header Row */}
          <div className="relative z-10 flex items-center justify-between px-6 py-4 sm:py-5 border-b border-stone-100 bg-white/95 backdrop-blur-md shrink-0">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border font-exo ${stageBadgeClass}`}
            >
              {stage}
            </span>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              aria-label="Close details"
              title="Close panel (Esc)"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="relative z-10 flex-1 overflow-y-auto px-6 py-5 space-y-6">
            {/* Title & Position */}
            <div>
              {positionText && (
                <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 font-exo mb-1.5">
                  {positionText}
                </p>
              )}
              <h2 className="text-2xl sm:text-[28px] font-geist font-bold text-[#111827] tracking-tight leading-snug mb-2.5">
                {skill.label}
              </h2>
              <p className="text-stone-600 font-inter text-sm leading-relaxed">
                {skill.description ||
                  "Master this skill to fulfill core industry engineering expectations and advance your roadmap mastery."}
              </p>
            </div>

            {/* What You'll Learn: Topic Chips */}
            {topics.length > 0 && (
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 font-exo block mb-2.5">
                  What you'll learn
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {topics.map((topic, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#6D3DF5]/[0.06] border border-[#6D3DF5]/15 text-xs font-medium text-stone-700"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Market Demand Row with Progress Bar */}
            <div className="rounded-2xl border border-stone-200/80 bg-[#FAFAFC] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 font-exo flex items-center gap-1.5">
                  <FiTrendingUp className="w-3.5 h-3.5 text-[#6D3DF5]" />
                  Market Demand
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#6D3DF5]">
                    {skill.marketDemand || `${demandNum}%`}
                  </span>
                  <span className="text-[11px] font-medium text-stone-500">
                    · {demandLabel}
                  </span>
                </div>
              </div>

              <div className="w-full h-2 rounded-full bg-stone-200/80 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#6D3DF5] via-[#7C3AED] to-[#A855F7] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(10, demandNum))}%` }}
                />
              </div>
            </div>

            {/* Roadmap Graph Context: Learn After & Unlocks Next */}
            {(prerequisites.length > 0 || unlocks.length > 0) && (
              <div className="rounded-2xl border border-stone-200/80 bg-white p-4 space-y-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 font-exo flex items-center gap-1.5">
                  <FiLayers className="w-3.5 h-3.5 text-[#6D3DF5]" />
                  Roadmap Flow
                </span>

                {/* Learn after (Prerequisites) */}
                {prerequisites.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold text-stone-500 block mb-1.5">
                      Learn after:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {prerequisites.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => onSelectSkill && onSelectSkill(p.id)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-stone-100 hover:bg-[#6D3DF5] text-stone-700 hover:text-white text-xs font-medium border border-stone-200/80 transition-all cursor-pointer"
                          title={`Jump to ${p.label}`}
                        >
                          <span>{p.label}</span>
                          <span className="text-[10px] opacity-60">↗</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Unlocks next */}
                {unlocks.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold text-stone-500 block mb-1.5">
                      Unlocks next:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {unlocks.map((u) => (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => onSelectSkill && onSelectSkill(u.id)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-purple-50/70 hover:bg-[#6D3DF5] text-purple-900 hover:text-white text-xs font-medium border border-purple-200/80 transition-all cursor-pointer"
                          title={`Jump to ${u.label}`}
                        >
                          <span>{u.label}</span>
                          <span className="text-[10px] opacity-60">↗</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Skill Status Section (Selectable Cards) */}
            <div className="rounded-2xl border border-stone-200/90 bg-[#FAF9FF] p-4 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 font-exo">
                  Skill Status
                </span>
                {isLoggedIn && (
                  <span className="text-xs text-[#6D3DF5] font-semibold capitalize">
                    {currentStatus.replace("-", " ")}
                  </span>
                )}
              </div>

              {isLoggedIn ? (
                <div className="grid grid-cols-3 gap-2">
                  {/* Not Started Card */}
                  <button
                    type="button"
                    onClick={() => onStatusChange(skill.id, "not-started")}
                    className={`flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      currentStatus === "not-started"
                        ? "bg-stone-200 text-stone-900 border-2 border-stone-400 shadow-xs"
                        : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50 hover:text-stone-900"
                    }`}
                  >
                    <FiCircle
                      className={`w-4 h-4 ${
                        currentStatus === "not-started" ? "text-stone-800" : "text-stone-400"
                      }`}
                    />
                    <span>Not Started</span>
                  </button>

                  {/* In Progress Card */}
                  <button
                    type="button"
                    onClick={() => onStatusChange(skill.id, "in-progress")}
                    className={`flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      currentStatus === "in-progress"
                        ? "bg-[#6D3DF5]/15 text-[#6D3DF5] border-2 border-[#6D3DF5] ring-2 ring-[#6D3DF5]/20 shadow-xs"
                        : "bg-white text-stone-600 border border-stone-200 hover:bg-[#6D3DF5]/5 hover:text-[#6D3DF5]"
                    }`}
                  >
                    <FiClock
                      className={`w-4 h-4 ${
                        currentStatus === "in-progress" ? "text-[#6D3DF5]" : "text-stone-400"
                      }`}
                    />
                    <span>In Progress</span>
                  </button>

                  {/* Mark Done Card */}
                  <button
                    type="button"
                    onClick={() => onStatusChange(skill.id, "completed")}
                    className={`flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      currentStatus === "completed"
                        ? "bg-emerald-50 text-emerald-800 border-2 border-emerald-500 shadow-xs"
                        : "bg-white text-stone-600 border border-stone-200 hover:bg-emerald-50/50 hover:text-emerald-700 hover:border-emerald-200"
                    }`}
                  >
                    <FiCheck
                      className={`w-4 h-4 ${
                        currentStatus === "completed" ? "text-emerald-700" : "text-stone-400"
                      }`}
                    />
                    <span>Mark Done</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-[#6D3DF5]/20">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#6D3DF5]/10 flex items-center justify-center shrink-0">
                      <FiLock className="w-4 h-4 text-[#6D3DF5]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#111827]">Track Your Journey</p>
                      <p className="text-[11px] text-stone-500">Log in to update status & sync progress.</p>
                    </div>
                  </div>

                  <Link
                    to="/login"
                    state={{ from: `/explore/${roadmapSlug}` }}
                    className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-[#6D3DF5] hover:bg-[#5b30d6] text-xs font-semibold text-white tracking-wide transition-all text-center whitespace-nowrap shadow-xs"
                  >
                    Log In
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Footer Action Bar */}
          <div className="px-6 py-4 border-t border-stone-100 bg-[#FAFAFC] shrink-0">
            {hasStartedJourney ? (
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-500 font-medium">
                  Journey active in your progress
                </span>
                <Link
                  to="/progress"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6D3DF5] hover:text-[#5b30d6] transition-colors"
                >
                  <span>View in Progress</span>
                  <FiArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <button
                type="button"
                onClick={onStartJourney}
                disabled={startingJourney}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#6D3DF5] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#9577F4] text-white text-xs sm:text-sm font-semibold tracking-wide shadow-md shadow-[#6D3DF5]/20 hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
              >
                <FiCompass className="w-4 h-4" />
                <span>{startingJourney ? "Starting Journey..." : "Start Journey on this Roadmap"}</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SkillDetailPanel;
