import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  FiX,
  FiCheck,
  FiClock,
  FiTrendingUp,
  FiExternalLink,
  FiBookOpen,
  FiFileText,
  FiPlay,
  FiBookmark,
  FiLock,
  FiCircle,
} from "react-icons/fi";
import { fetchResources } from "../../services/api";

const stageStyles = {
  Foundation: "bg-blue-50 text-blue-700 border-blue-200",
  Core: "bg-[#6D3DF5]/10 text-[#6D3DF5] border-[#6D3DF5]/20",
  Database: "bg-teal-50 text-teal-700 border-teal-200",
  Advanced: "bg-amber-50 text-amber-700 border-amber-200",
  "Tools & Deployment": "bg-rose-50 text-rose-700 border-rose-200",
};

const getResourceIcon = (type) => {
  switch (type?.toLowerCase()) {
    case "video":
      return <FiPlay className="w-4 h-4 text-rose-500" />;
    case "course":
      return <FiBookOpen className="w-4 h-4 text-[#6D3DF5]" />;
    case "documentation":
      return <FiFileText className="w-4 h-4 text-teal-600" />;
    default:
      return <FiBookmark className="w-4 h-4 text-amber-600" />;
  }
};

const SkillDetailPanel = ({
  skill,
  isOpen,
  onClose,
  currentStatus = "not-started",
  onStatusChange,
  isLoggedIn = false,
  roadmapSlug = "",
}) => {
  const [resources, setResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(false);

  useEffect(() => {
    if (skill?.id) {
      let isMounted = true;
      setLoadingResources(true);
      fetchResources(skill.id)
        .then((res) => {
          if (isMounted) setResources(res || []);
        })
        .catch(() => {
          if (isMounted) setResources([]);
        })
        .finally(() => {
          if (isMounted) setLoadingResources(false);
        });
      return () => {
        isMounted = false;
      };
    }
  }, [skill?.id]);

  if (!isOpen || !skill) return null;

  const stage = skill.stage || "Core";
  const stageBadgeClass = stageStyles[stage] || stageStyles.Core;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs"
        />

        {/* Slide-in Drawer in Light Theme */}
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 280 }}
          data-lenis-prevent
          className="relative z-10 w-full sm:w-[460px] md:w-[500px] h-full bg-white border-l border-stone-200 text-[#111827] flex flex-col shadow-2xl overflow-hidden font-inter"
        >
          {/* Header Bar */}
          <div className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-stone-100 bg-white/95 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border font-exo ${stageBadgeClass}`}
              >
                {stage}
              </span>
              {skill.marketDemand && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#6D3DF5] bg-[#6D3DF5]/[0.08] px-2.5 py-0.5 rounded-full border border-[#6D3DF5]/15">
                  <FiTrendingUp className="w-3 h-3 text-[#6D3DF5]" />
                  {skill.marketDemand} Demand
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              aria-label="Close details"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="relative z-10 flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* Title & Description */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-geist font-bold text-[#111827] tracking-tight leading-snug mb-3">
                {skill.label}
              </h2>
              <p className="text-stone-600 font-inter text-sm sm:text-base leading-relaxed">
                {skill.description ||
                  "Master this skill to fulfill core industry engineering expectations and advance your roadmap mastery."}
              </p>
            </div>

            {/* Status Tracking Section */}
            <div className="rounded-2xl border border-stone-200 bg-[#FAF9FF] p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 font-exo">
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
                  <button
                    onClick={() => onStatusChange(skill.id, "not-started")}
                    className={`flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl text-xs font-semibold transition-all ${
                      currentStatus === "not-started"
                        ? "bg-white text-stone-900 border-2 border-stone-400 shadow-xs"
                        : "bg-white/80 text-stone-500 border border-stone-200 hover:bg-white hover:text-stone-800"
                    }`}
                  >
                    <FiCircle className="w-4 h-4 text-stone-400" />
                    <span>Not Started</span>
                  </button>

                  <button
                    onClick={() => onStatusChange(skill.id, "in-progress")}
                    className={`flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl text-xs font-semibold transition-all ${
                      currentStatus === "in-progress"
                        ? "bg-[#6D3DF5]/15 text-[#6D3DF5] border-2 border-[#6D3DF5] shadow-[0_0_12px_rgba(109,61,245,0.25)]"
                        : "bg-white/80 text-stone-500 border border-stone-200 hover:bg-[#6D3DF5]/10 hover:text-[#6D3DF5]"
                    }`}
                  >
                    <FiClock className="w-4 h-4 text-[#6D3DF5]" />
                    <span>In Progress</span>
                  </button>

                  <button
                    onClick={() => onStatusChange(skill.id, "completed")}
                    className={`flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl text-xs font-semibold transition-all ${
                      currentStatus === "completed"
                        ? "bg-emerald-600 text-white border-2 border-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.35)]"
                        : "bg-white/80 text-stone-500 border border-stone-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
                    }`}
                  >
                    <FiCheck className={`w-4 h-4 ${currentStatus === "completed" ? "text-white" : "text-emerald-600"}`} />
                    <span>Mark Done</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-[#6D3DF5]/10 via-[#7C3AED]/5 to-transparent border border-[#6D3DF5]/20">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#6D3DF5]/15 flex items-center justify-center border border-[#6D3DF5]/25">
                      <FiLock className="w-4 h-4 text-[#6D3DF5]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#111827]">Track Your Journey</p>
                      <p className="text-xs text-stone-500">Sign in to track progress and sync your checklist.</p>
                    </div>
                  </div>

                  <Link
                    to="/login"
                    state={{ from: `/explore/${roadmapSlug}` }}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-[#6D3DF5] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#9577F4] text-xs font-semibold text-white tracking-wide shadow-xs transition-all text-center whitespace-nowrap"
                  >
                    Log In
                  </Link>
                </div>
              )}
            </div>

            {/* Curated Resources Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-800 font-exo flex items-center gap-2">
                  <FiBookOpen className="w-4 h-4 text-[#6D3DF5]" />
                  Curated Learning Resources
                </h3>
                <span className="text-xs text-stone-400 font-medium">Verified sources</span>
              </div>

              {loadingResources ? (
                <div className="py-8 flex flex-col items-center justify-center gap-2 text-stone-400">
                  <div className="w-6 h-6 border-2 border-[#6D3DF5] border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs">Loading resources...</span>
                </div>
              ) : resources.length > 0 ? (
                <div className="space-y-3">
                  {resources.map((item) => (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start justify-between gap-3 p-3.5 rounded-xl border border-stone-200/90 bg-stone-50/70 hover:bg-white hover:border-[#6D3DF5]/40 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 p-2 rounded-lg bg-white border border-stone-200 group-hover:bg-[#6D3DF5]/10 group-hover:border-[#6D3DF5]/30 transition-colors">
                          {getResourceIcon(item.type)}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-stone-800 group-hover:text-[#6D3DF5] transition-colors">
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 text-xs text-stone-500">
                            <span className="text-[#6D3DF5] font-semibold">{item.platform}</span>
                            <span>•</span>
                            <span>{item.type}</span>
                            {item.duration && (
                              <>
                                <span>•</span>
                                <span>{item.duration}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <FiExternalLink className="w-4 h-4 text-stone-400 group-hover:text-[#6D3DF5] transition-colors shrink-0 mt-1" />
                    </a>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-stone-400">
                  No resources listed for this module yet.
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SkillDetailPanel;
