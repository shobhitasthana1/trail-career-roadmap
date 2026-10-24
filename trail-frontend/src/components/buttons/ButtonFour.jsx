import { FiArrowRight } from "react-icons/fi";

const ButtonFour = ({ text, onClick }) => {
  return (
    <button onClick={onClick} className="group flex items-center gap-3 rounded-xl border border-[#E5E7EB] bg-transparent px-4 py-2 text-xs font-medium tracking-wide text-[#111827] transition-all duration-300 hover:border-[#111827] hover:bg-[#111827] hover:text-white md:rounded-2xl md:px-5 md:py-3 md:text-sm">
      {text}
      <FiArrowRight className="text-base transition-transform duration-300 group-hover:translate-x-1" />
    </button>
  );
};

export default ButtonFour;