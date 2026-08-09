import React from "react";

const ButtonOne = ({ text }) => {
  return (
    <button className="flex items-center gap-3 rounded-2xl bg-black px-5 py-3 text-sm font-medium tracking-wide text-white transition-all duration-300 hover:bg-zinc-800">
      {text}

      <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
    </button>
  );
};

export default ButtonOne;