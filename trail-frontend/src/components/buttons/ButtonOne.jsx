import React from "react";

const ButtonOne = ({ text }) => {
  return (
    <button className="relative flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0E0A1A] to-[#160F2C] border border-white/10 px-4 py-2 text-xs font-semibold tracking-wide text-white transition-all duration-500 hover:-translate-y-0.5 hover:from-[#6D3DF5] hover:to-[#9D4EDD] hover:shadow-[0_6px_24px_rgba(109,61,245,0.35)] md:gap-3 md:rounded-2xl md:px-5 md:py-3 md:text-sm cursor-pointer">
      {text}
    </button>
  );
};

export default ButtonOne;