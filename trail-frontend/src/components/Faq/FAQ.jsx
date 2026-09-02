import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FAQ_DATA = [
  {
    question: "How is this different from a roadmap I'd find online?",
    answer:
      "Most roadmaps are hardcoded once and never updated. Trail rebuilds its skill list from real, current job postings — so what you see today reflects what employers are actually asking for right now.",
  },
  {
    question: "Where does the job data come from?",
    answer:
      "We pull listings through job-search APIs that aggregate sources like LinkedIn and — not by scraping those platforms directly.",
  },
  {
    question: "How often does the roadmap update?",
    answer:
      "Automatically, roughly every 24 hours per role. Nothing you need to refresh yourself.",
  },
  {
    question: "Is Trail free to use?",
    answer:
      "Yes — fully free, built as an academic project with no paid tiers.",
  },
  {
    question: "Do I need an account to search a role?",
    answer:
      "No — Explore is open to everyone. An account's only needed to save roadmaps and track progress.",
  },
  {
    question: "What if the role I search isn't in the system yet?",
    answer:
      "Search it anyway — Trail fetches live data for a role the first time anyone searches it.",
  },
];

const FAQ = () => {
  const sectionRef = useRef(null);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".faq-reveal",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      ref={sectionRef}
      className="relative flex w-full flex-col items-center justify-center py-24 md:py-32 bg-[#FAFAFA] overflow-hidden" 
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.4] [background:radial-gradient(ellipse_at_center,rgba(109,61,245,0.08)_0%,transparent_70%)]" />

      <div className="relative mx-auto flex w-[90%] max-w-[1200px] flex-col items-center z-10">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <span className="faq-reveal mb-4 flex items-center font-exo text-[11px] font-bold uppercase tracking-[0.3em] text-[#6D3DF5] md:text-xs">
            Got Questions?
          </span>

          {/* Editorial Styled Multi-Line Heading */}
          <h2 className="faq-reveal font-satoshi text-[clamp(2.2rem,4vw,3.8rem)] font-black leading-[1.15] tracking-tight text-[#111827]">
            <span>Frequently asked</span>{" "}
            <span className="bg-gradient-to-r from-[#6D3DF5] to-[#A855F7] bg-clip-text text-transparent font-serif italic font-normal pb-1 inline-block">
              questions.
            </span>
          </h2>
        </div>

        {/* FAQs 2-Column Grid */}
        <div className="faq-reveal w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-start">
          
          {/* LEFT COLUMN (Questions 1 to 3) */}
          <div className="flex w-full flex-col gap-4 md:gap-5">
            {FAQ_DATA.slice(0, 3).map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <motion.div
                  key={index}
                  className={`group overflow-hidden rounded-2xl md:rounded-[24px] border transition-all duration-300 ${
                    isOpen
                      ? "border-[#6D3DF5]/30 bg-[#6D3DF5]/[0.02] shadow-[0_10px_40px_rgba(109,61,245,0.08)]"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1"
                  }`}
                  initial={false}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="flex w-full items-center justify-between gap-4 p-5 md:p-6 lg:p-7 text-left outline-none"
                  >
                    <span
                      className={`font-satoshi text-base font-bold transition-colors duration-300 md:text-[18px] leading-snug pr-2 ${
                        isOpen ? "text-[#6D3DF5]" : "text-[#111827] group-hover:text-[#6D3DF5]"
                      }`}
                    >
                      {faq.question}
                    </span>
                    
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                        isOpen 
                          ? "bg-[#6D3DF5] text-white shadow-[0_4px_12px_rgba(109,61,245,0.3)]" 
                          : "bg-gray-50 text-gray-400 group-hover:bg-[#6D3DF5]/10 group-hover:text-[#6D3DF5]"
                      }`}
                    >
                      <motion.svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.4, ease: "backOut(1.5)" }}
                      >
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </motion.svg>
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="px-5 pb-6 pt-0 md:px-7 md:pb-7 font-inter text-sm md:text-[15px] leading-relaxed text-[#64748B] pr-12 md:pr-16">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* RIGHT COLUMN (Questions 4 to 6) */}
          <div className="flex w-full flex-col gap-4 md:gap-5">
            {FAQ_DATA.slice(3, 6).map((faq, i) => {
              const index = i + 3;
              const isOpen = openIndex === index;

              return (
                <motion.div
                  key={index}
                  className={`group overflow-hidden rounded-2xl md:rounded-[24px] border transition-all duration-300 ${
                    isOpen
                      ? "border-[#6D3DF5]/30 bg-[#6D3DF5]/[0.02] shadow-[0_10px_40px_rgba(109,61,245,0.08)]"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1"
                  }`}
                  initial={false}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="flex w-full items-center justify-between gap-4 p-5 md:p-6 lg:p-7 text-left outline-none"
                  >
                    <span
                      className={`font-satoshi text-base font-bold transition-colors duration-300 md:text-[18px] leading-snug pr-2 ${
                        isOpen ? "text-[#6D3DF5]" : "text-[#111827] group-hover:text-[#6D3DF5]"
                      }`}
                    >
                      {faq.question}
                    </span>
                    
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                        isOpen 
                          ? "bg-[#6D3DF5] text-white shadow-[0_4px_12px_rgba(109,61,245,0.3)]" 
                          : "bg-gray-50 text-gray-400 group-hover:bg-[#6D3DF5]/10 group-hover:text-[#6D3DF5]"
                      }`}
                    >
                      <motion.svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.4, ease: "backOut(1.5)" }}
                      >
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </motion.svg>
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="px-5 pb-6 pt-0 md:px-7 md:pb-7 font-inter text-sm md:text-[15px] leading-relaxed text-[#64748B] pr-12 md:pr-16">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};

export default FAQ;