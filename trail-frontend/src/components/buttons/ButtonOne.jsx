import React from "react";

const ButtonOne = ({ text }) => {
  return (
    <button className="relative flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#9D4EDD] px-4 py-2 text-xs font-semibold tracking-wide text-white transition-all duration-500 hover:-translate-y-0.5 hover:bg-gradient-to-r hover:from-[#0E0A1A] hover:to-[#1E123F] hover:shadow-[0_6px_24px_rgba(14,10,26,0.35)] md:gap-3 md:rounded-2xl md:px-5 md:py-3 md:text-sm">
      {text}
      <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
    </button>
  );
};

export default ButtonOne;