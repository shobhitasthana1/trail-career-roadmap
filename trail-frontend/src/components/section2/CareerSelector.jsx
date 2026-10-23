import { motion } from "motion/react";

const CAREERS = ["FRONTEND", "FULL STACK", "AI / ML", "UI / UX", "BACKEND"];

const CareerSelector = ({ active, onSelect }) => {
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-1 rounded-full border border-[#E5E7EB] bg-white p-1.5 shadow-[0_2px_20px_rgba(0,0,0,0.04)] sm:w-fit sm:flex-nowrap">
      {CAREERS.map((career) => {
        const isActive = active === career;
        return (
          <button
            key={career}
            onClick={() => onSelect?.(career)}
            className={`relative whitespace-nowrap rounded-full px-4 py-2 font-exo text-[11px] font-bold tracking-widest transition-colors duration-300 ease-out active:scale-95 md:px-5 md:text-xs ${
              isActive ? "text-white" : "text-[#111827] hover:text-[#6D3DF5]"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="career-pill"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className="absolute inset-0 rounded-full bg-[#6D3DF5] shadow-[0_4px_14px_rgba(109,61,245,0.35)]"
              />
            )}
            <span className="relative z-10">{career}</span>
          </button>
        );
      })}
    </div>
  );
};

export default CareerSelector;
