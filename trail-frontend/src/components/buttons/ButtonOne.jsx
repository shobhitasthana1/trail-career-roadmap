import React from "react";

const ButtonOne = ({ text }) => {
  return (
    <button className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-[#0E0A1A] border border-white/10 px-4 py-2 sm:px-5 sm:py-2.5 text-[11px] sm:text-xs font-semibold tracking-wide text-white transition-all duration-500 hover:shadow-[0_8px_30px_rgba(124,58,237,0.4)] hover:-translate-y-0.5 md:gap-2.5 md:rounded-2xl md:px-6 md:py-3 md:text-sm cursor-pointer">
      <div className="absolute left-0 top-[110%] h-full w-full rounded-t-[50%] bg-gradient-to-r from-[#7C3AED] to-[#9D4EDD] transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:top-0 group-hover:rounded-none z-0" />

      <div className="relative z-10 block h-[16px] sm:h-[18px] md:h-[20px] overflow-hidden">
        <div className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-[16px] sm:group-hover:-translate-y-[18px] md:group-hover:-translate-y-[20px]">
          <span className="flex h-[16px] sm:h-[18px] md:h-[20px] items-center text-white">
            {text}
          </span>
          <span className="flex h-[16px] sm:h-[18px] md:h-[20px] items-center text-white">
            {text}
          </span>
        </div>
      </div>

      <div className="relative z-10 flex h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 overflow-hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-full group-hover:-translate-y-full"
        >
          <line x1="7" y1="17" x2="17" y2="7"></line>
          <polyline points="7 7 17 7 17 17"></polyline>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute h-full w-full -translate-x-full translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-0 group-hover:translate-y-0"
        >
          <line x1="7" y1="17" x2="17" y2="7"></line>
          <polyline points="7 7 17 7 17 17"></polyline>
        </svg>
      </div>
    </button>
  );
};

export default ButtonOne;