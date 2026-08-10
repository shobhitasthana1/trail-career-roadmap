import React from "react";

const ButtonOne = ({ text }) => {
  return (
    <button className="flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-xs font-medium tracking-wide text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#9577F4] hover:shadow-[0_4px_15px_rgba(149,119,244,0.4)] md:gap-3 md:rounded-2xl md:px-5 md:py-3 md:text-sm">
      {text}
      <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
    </button>
  );
};

export default ButtonOne;