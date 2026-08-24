// import { useState, useRef, useEffect } from "react";
// import { motion, AnimatePresence } from "motion/react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// const FAQ_DATA = [
//   {
//     question: "How is this different from a roadmap I'd find online?",
//     answer:
//       "Most roadmaps are hardcoded once and never updated. Trail rebuilds its skill list from real, current job postings — so what you see today reflects what employers are actually asking for right now.",
//   },
//   {
//     question: "Where does the job data come from?",
//     answer:
//       "We pull listings through job-search APIs that aggregate sources like LinkedIn and — not by scraping those platforms directly.",
//   },
//   {
//     question: "How often does the roadmap update?",
//     answer:
//       "Automatically, roughly every 24 hours per role. Nothing you need to refresh yourself.",
//   },
//   {
//     question: "Is Trail free to use?",
//     answer:
//       "Yes — fully free, built as an academic project with no paid tiers.",
//   },
//   {
//     question: "Do I need an account to search a role?",
//     answer:
//       "No — Explore is open to everyone. An account's only needed to save roadmaps and track progress.",
//   },
//   {
//     question: "What if the role I search isn't in the system yet?",
//     answer:
//       "Search it anyway — Trail fetches live data for a role the first time anyone searches it.",
//   },
// ];

// const FAQ = () => {
//   const sectionRef = useRef(null);
//   const [openIndex, setOpenIndex] = useState(null);

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       gsap.fromTo(
//         ".faq-reveal",
//         { opacity: 0, y: 30 },
//         {
//           opacity: 1,
//           y: 0,
//           duration: 0.8,
//           ease: "power3.out",
//           stagger: 0.1,
//           scrollTrigger: {
//             trigger: sectionRef.current,
//             start: "top 80%",
//             toggleActions: "play none none none",
//           },
//         }
//       );
//     }, sectionRef);

//     return () => ctx.revert();
//   }, []);

//   const toggleFAQ = (index) => {
//     setOpenIndex(openIndex === index ? null : index);
//   };

//   return (
//     <section
//       ref={sectionRef}
//       className="relative flex w-full flex-col items-center justify-center py-24 md:py-32 bg-white" 
//       // Note: Change 'bg-white' to match your global background (e.g., bg-[#F8FAFC] or dark mode bg)
//     >
//       <div className="relative mx-auto flex w-[92%] max-w-4xl flex-col items-center">
        
//         {/* Header Section */}
//         <div className="flex flex-col items-center text-center mb-12 lg:mb-16">
//           <span className="faq-reveal mb-3 flex items-center gap-2 font-exo text-[11px] font-bold uppercase tracking-[0.3em] text-[#6D3DF5] md:text-xs">
//             Got Questions? <span className="text-sm">✦</span>
//           </span>
//           <h2 className="faq-reveal font-satoshi text-[clamp(2rem,4vw,3.2rem)] font-black leading-[1.1] tracking-tight text-[#111827]">
//             FREQUENTLY ASKED
//             <br />
//             <span className="bg-gradient-to-r from-[#6D3DF5] to-[#A855F7] bg-clip-text text-transparent">
//               QUESTIONS.
//             </span>
//           </h2>
//         </div>

//         {/* FAQs List */}
//         <div className="faq-reveal w-full flex flex-col gap-4">
//           {FAQ_DATA.map((faq, index) => {
//             const isOpen = openIndex === index;

//             return (
//               <motion.div
//                 key={index}
//                 className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${
//                   isOpen
//                     ? "border-[#6D3DF5]/30 bg-[#6D3DF5]/[0.03]"
//                     : "border-gray-200 bg-white hover:border-gray-300"
//                 }`}
//                 initial={false}
//               >
//                 <button
//                   onClick={() => toggleFAQ(index)}
//                   className="flex w-full items-center justify-between gap-4 p-5 text-left md:p-6"
//                 >
//                   <span
//                     className={`font-satoshi text-base font-bold transition-colors duration-300 md:text-lg ${
//                       isOpen ? "text-[#6D3DF5]" : "text-[#111827]"
//                     }`}
//                   >
//                     {faq.question}
//                   </span>
                  
//                   {/* Plus/Minus Icon */}
//                   <div
//                     className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
//                       isOpen ? "bg-[#6D3DF5] text-white" : "bg-gray-100 text-gray-500"
//                     }`}
//                   >
//                     <motion.svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="16"
//                       height="16"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2.5"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       animate={{ rotate: isOpen ? 45 : 0 }}
//                       transition={{ duration: 0.3, ease: "easeInOut" }}
//                     >
//                       <line x1="12" y1="5" x2="12" y2="19"></line>
//                       <line x1="5" y1="12" x2="19" y2="12"></line>
//                     </motion.svg>
//                   </div>
//                 </button>

//                 <AnimatePresence initial={false}>
//                   {isOpen && (
//                     <motion.div
//                       initial={{ height: 0, opacity: 0 }}
//                       animate={{ height: "auto", opacity: 1 }}
//                       exit={{ height: 0, opacity: 0 }}
//                       transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
//                     >
//                       <div className="px-5 pb-5 pt-0 md:px-6 md:pb-6 font-inter text-sm md:text-base leading-relaxed text-[#64748B]">
//                         {faq.answer}
//                       </div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </motion.div>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default FAQ;

import React from 'react'

const FAQ = () => {
  return (
    <div>FAQ</div>
  )
}

export default FAQ