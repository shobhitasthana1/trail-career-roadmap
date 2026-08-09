import React from 'react';

const ButtonOne = ({ text }) => {
  return (
    <button className="flex items-center justify-center gap-3 px-8 py-3 bg-[#0a0a0a] rounded-xl hover:bg-[#171717] transition-all duration-300 active:scale-95">
      {/* Button Text */}
      <span className="text-gray-100 text-sm font-semibold tracking-wider uppercase">
        {text}
      </span>
      
      {/* Green Dot Indicator */}
      <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
    </button>
  );
};

export default ButtonOne;