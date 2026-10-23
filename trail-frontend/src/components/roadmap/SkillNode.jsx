import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { FiCheck, FiTrendingUp } from "react-icons/fi";

const stageStyles = {
  Foundation: {
    borderLeft: "border-l-4 border-l-blue-500",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
  },
  Core: {
    borderLeft: "border-l-4 border-l-[#6D3DF5]",
    badge: "bg-[#6D3DF5]/10 text-[#6D3DF5] border-[#6D3DF5]/20",
  },
  Database: {
    borderLeft: "border-l-4 border-l-teal-500",
    badge: "bg-teal-50 text-teal-700 border-teal-200",
  },
  Advanced: {
    borderLeft: "border-l-4 border-l-amber-500",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
  },
  "Tools & Deployment": {
    borderLeft: "border-l-4 border-l-rose-500",
    badge: "bg-rose-50 text-rose-700 border-rose-200",
  },
};

const SkillNode = ({ data, selected }) => {
  const status = data.status || "not-started";
  const stage = data.stage || "Core";
  const stageConfig = stageStyles[stage] || stageStyles.Core;

  const isCompleted = status === "completed";
  const isInProgress = status === "in-progress";

  return (
    <div
      onClick={data.onClick}
      className={`relative group w-[250px] sm:w-[270px] rounded-2xl p-4 cursor-pointer transition-all duration-300 select-none ${
        stageConfig.borderLeft
      } ${
        isCompleted
          ? "bg-emerald-50/90 border border-emerald-400 shadow-[0_6px_20px_rgba(16,185,129,0.18)] hover:shadow-[0_10px_28px_rgba(16,185,129,0.28)]"
          : isInProgress
          ? "bg-purple-50/70 border-2 border-[#7C3AED] shadow-[0_6px_22px_rgba(109,61,245,0.2)] hover:shadow-[0_12px_30px_rgba(109,61,245,0.3)]"
          : selected
          ? "bg-white border-2 border-[#6D3DF5] shadow-[0_8px_25px_rgba(109,61,245,0.18)]"
          : "bg-white border border-stone-200/90 shadow-[0_4px_16px_rgba(17,24,39,0.05)] hover:shadow-[0_10px_25px_-5px_rgba(109,61,245,0.12)] hover:border-[#6D3DF5]/40 hover:-translate-y-0.5"
      }`}
    >
      {/* Target Handle (Top) */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-white !border-2 !border-[#7C3AED] hover:!scale-125 !transition-transform"
      />

      {/* Top Meta Bar: Stage & Demand */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border font-exo ${stageConfig.badge}`}
        >
          {stage}
        </span>

        {data.marketDemand && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#6D3DF5] bg-[#6D3DF5]/[0.08] px-2 py-0.5 rounded-full border border-[#6D3DF5]/15">
            <FiTrendingUp className="w-3 h-3 text-[#6D3DF5]" />
            {data.marketDemand}
          </span>
        )}
      </div>

      {/* Skill Title */}
      <div className="mb-2.5">
        <h3 className="font-geist font-bold text-[14px] leading-snug tracking-tight text-[#111827] group-hover:text-[#6D3DF5] transition-colors">
          {data.label}
        </h3>
      </div>

      {/* Bottom Status Row */}
      <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
        {isCompleted ? (
          <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
            <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <FiCheck className="w-2.5 h-2.5" />
            </span>
            Completed
          </span>
        ) : isInProgress ? (
          <span className="inline-flex items-center gap-1.5 text-[#6D3DF5] font-semibold text-[11px]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6D3DF5] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6D3DF5]"></span>
            </span>
            In Progress
          </span>
        ) : (
          <span className="text-stone-400 text-[11px] font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-stone-300"></span>
            Not Started
          </span>
        )}

        <span className="text-[10px] font-semibold text-stone-400 group-hover:text-[#6D3DF5] transition-colors">
          Details →
        </span>
      </div>

      {/* Source Handle (Bottom) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-white !border-2 !border-[#7C3AED] hover:!scale-125 !transition-transform"
      />
    </div>
  );
};

export default memo(SkillNode);
