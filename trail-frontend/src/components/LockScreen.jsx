import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { FiLock } from "react-icons/fi";

const LockScreen = ({
  _badge = "Explore Locked",
  titlePrefix = "Explore is",
  titleHighlight = "locked.",
  message = "Please log in to explore roadmaps and track your learning journey.",
  loginText = "Login",
  signupText = "Create Account",
  previewType = "explore",
}) => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#FAFAFA] px-4 py-24 overflow-hidden font-inter selection:bg-[#7C3AED]/15 selection:text-[#6D3DF5]">
      {/* Soft Ambient Background Glows */}
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_15%_20%,rgba(109,61,245,0.08)_0%,transparent_45%),radial-gradient(circle_at_85%_80%,rgba(168,85,247,0.08)_0%,transparent_45%)]" />

      {/* Subtle Radial Dot Grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(#6D3DF5 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.14,
          maskImage:
            "radial-gradient(ellipse 65% 60% at 50% 50%, black 10%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 65% 60% at 50% 50%, black 10%, transparent 75%)",
        }}
      />

      {/* Blurred UI Preview Behind Lock */}
      <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-center">
        {previewType === "explore" ? (
          <div className="w-full max-w-[1000px] px-6 opacity-35 blur-[6px]">
            {/* Search and Header Placeholder */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-32 h-3.5 rounded-full bg-[#6D3DF5]/30 mb-3" />
              <div className="w-72 sm:w-96 h-9 rounded-2xl bg-stone-200 mb-3" />
              <div className="w-64 sm:w-[480px] h-3.5 rounded bg-stone-100 mb-6" />
              <div className="w-full max-w-[620px] h-14 rounded-2xl border border-stone-200 bg-white shadow-sm flex items-center px-4">
                <div className="w-5 h-5 rounded-full bg-stone-200 mr-3" />
                <div className="w-48 h-3.5 rounded bg-stone-100" />
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-24 sm:w-28 h-7 rounded-full bg-white border border-stone-200"
                  />
                ))}
              </div>
            </div>
            {/* Roadmap Canvas Placeholder */}
            <div className="h-64 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm flex items-center justify-center">
              <div className="flex gap-4 sm:gap-6 items-center">
                <div className="w-32 sm:w-40 h-20 rounded-2xl bg-stone-100 border border-stone-200" />
                <div className="w-8 sm:w-12 h-1 bg-stone-200" />
                <div className="w-36 sm:w-44 h-24 rounded-2xl bg-[#6D3DF5]/10 border border-[#6D3DF5]/20" />
                <div className="w-8 sm:w-12 h-1 bg-stone-200" />
                <div className="w-32 sm:w-40 h-20 rounded-2xl bg-stone-100 border border-stone-200" />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-[1000px] px-6 opacity-40 blur-[6px]">
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-28 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"
                >
                  <div className="w-8 h-2 rounded-full bg-[#6D3DF5]/30 mb-3" />
                  <div className="w-16 h-6 rounded-md bg-stone-200 mb-2" />
                  <div className="w-24 h-3 rounded bg-stone-100" />
                </div>
              ))}
            </div>
            <div className="h-36 rounded-3xl border border-stone-200 bg-white p-6 mb-6 shadow-sm">
              <div className="w-40 h-4 rounded bg-stone-200 mb-4" />
              <div className="w-full h-4 rounded-full bg-[#6D3DF5]/20" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="h-44 rounded-3xl border border-stone-200 bg-white" />
              <div className="h-44 rounded-3xl border border-stone-200 bg-white" />
            </div>
          </div>
        )}
      </div>

      {/* Frosted Glass Lock Card */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[460px]"
      >
        <div className="relative overflow-hidden rounded-[28px] border border-stone-200/90 bg-white/90 backdrop-blur-2xl p-8 sm:p-10 text-center shadow-[0_24px_60px_-15px_rgba(17,24,39,0.08),0_0_0_1px_rgba(255,255,255,0.9)_inset]">
          <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#6D3DF5] via-[#9577F4] to-[#A855F7]" />

          <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-[#6D3DF5]/10 to-[#A855F7]/10 border border-[#6D3DF5]/20 flex items-center justify-center mb-5 shadow-[0_12px_30px_-8px_rgba(109,61,245,0.2)]">
            <FiLock className="w-9 h-9 text-[#6D3DF5]" />
          </div>

          <h1 className="font-geist text-[28px] sm:text-[34px] font-bold text-[#111827] tracking-[-0.04em] leading-[1.08]">
            {titlePrefix}{" "}
            <span className="font-iowan italic font-normal bg-gradient-to-r from-[#6D3DF5] to-[#A855F7] bg-clip-text text-transparent pr-1">
              {titleHighlight}
            </span>
          </h1>

          <p className="mt-2.5 text-[#64748B] font-inter text-sm sm:text-[15px] leading-relaxed mb-8">
            {message}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Link
              to="/login"
              className="group relative flex-1 overflow-hidden rounded-xl bg-gradient-to-r from-[#6D3DF5] via-[#7C3AED] to-[#9577F4] px-6 py-3.5 text-sm font-semibold text-white tracking-wide shadow-[0_10px_25px_-5px_rgba(109,61,245,0.4)] transition-all duration-300 hover:shadow-[0_16px_32px_-6px_rgba(109,61,245,0.55)] hover:-translate-y-0.5 active:scale-[0.98] text-center font-geist"
            >
              <span className="relative z-10">{loginText}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#7C3AED] via-[#6D3DF5] to-[#A855F7] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>

            <Link
              to="/signup"
              className="flex-1 rounded-xl border border-stone-200 bg-[#F8FAFC] px-6 py-3.5 text-sm font-semibold text-[#111827] tracking-wide transition-all duration-300 hover:border-[#6D3DF5]/30 hover:bg-[#6D3DF5]/[0.04] hover:text-[#6D3DF5] active:scale-[0.98] text-center font-geist"
            >
              {signupText}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LockScreen;
