import React, { useRef } from "react";
import SectionTwoCanvas from "./SectionTwoCanvas";

const Section2 = () => {
  const sectionRef = useRef(null);

  return (
    <div
      ref={sectionRef}
      className="relative w-screen h-screen overflow-hidden"
    >
      <SectionTwoCanvas sectionRef={sectionRef} />

      <div className="pointer-events-none absolute inset-x-0 top-10 flex flex-col items-center text-center gap-2 px-6 md:top-14 font-inter">
        <h4 className="text-xs font-bold tracking-widest text-gray-400 uppercase font-exo">
          {/* Watch it happen */}
        </h4>
        <h2 className="font-satoshi text-4xl md:text-6xl font-black leading-none tracking-tighter text-gray-900">
          {/* SEE YOUR PROGRESS */}
        </h2>
      </div>
    </div>
  );
};

export default Section2;