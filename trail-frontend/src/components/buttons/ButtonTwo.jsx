
const ButtonTwo = ({ text }) => {
  return (
    <button className="flex items-center gap-3 border-2 border-stone-950 rounded-xl px-4 py-2 text-xs md:rounded-2xl md:px-5 md:py-3 md:text-sm font-medium tracking-wide text-zinc-950 transition-all duration-300 hover:bg-[#9577F4] hover:border-[#9577F4] hover:text-white">
      {text}
      <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
    </button>
  );
};

export default ButtonTwo;