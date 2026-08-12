import React, { useState } from "react";

const CAREERS = ["FRONTEND", "FULL STACK", "AI / ML", "UI / UX", "BACKEND"];

const CareerSelector = ({ onSelect }) => {
  const [active, setActive] = useState("FRONTEND");

  const handleSelect = (career) => {
    setActive(career);
    onSelect?.(career);
  };

  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-2 rounded-full border border-[#E5E7EB] bg-white p-1.5 shadow-[0_2px_20px_rgba(0,0,0,0.04)] sm:w-fit sm:flex-nowrap md:gap-1">
      {CAREERS.map((career) => (
        <button
          key={career}
          onClick={() => handleSelect(career)}
          className={`whitespace-nowrap rounded-full px-4 py-2 font-exo text-[11px] font-bold tracking-widest transition-all duration-300 md:px-5 md:text-xs ${
            active === career
              ? "bg-[#6D3DF5] text-white shadow-[0_4px_14px_rgba(109,61,245,0.35)]"
              : "text-[#111827] hover:bg-[#f5f3ff]"
          }`}
        >
          {career}
        </button>
      ))}
    </div>
  );
};

export default CareerSelector;