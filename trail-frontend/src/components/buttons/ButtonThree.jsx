import { FiArrowUpRight } from "react-icons/fi";

const ButtonThree = ({ text, onClick }) => {
  return (
    <button onClick={onClick} className="group flex items-center gap-2 rounded-xl bg-brand-purple px-4 py-2 text-xs font-medium tracking-wide text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#5b30d6] hover:shadow-[0_6px_20px_rgba(109,61,245,0.4)] md:gap-3 md:rounded-2xl md:px-6 md:py-3 md:text-sm">
      {text}
      <FiArrowUpRight className="text-base transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </button>
  );
};

export default ButtonThree;