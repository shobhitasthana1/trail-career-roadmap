import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  FiCompass,
  FiArrowRight,
  FiLayers,
  FiCheckCircle,
  FiSearch,
  FiX,
} from "react-icons/fi";

import Footer from "../components/footer/Footer";
import { PREBUILT_ROLES } from "../services/api";

const Roadmap = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");

  const categories = ["ALL", "FRONTEND", "BACKEND", "FULL STACK", "AI / DATA"];

  const filteredRoles = useMemo(() => {
    return (PREBUILT_ROLES || []).filter((item) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.role?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        (item.topSkills || []).some((sk) => sk.toLowerCase().includes(q));

      if (activeCategory === "ALL") return matchesSearch;

      const textToMatch = `${item.role} ${item.description} ${(
        item.topSkills || []
      ).join(" ")}`.toUpperCase();

      if (activeCategory === "AI / DATA") {
        return (
          matchesSearch &&
          (textToMatch.includes("AI") ||
            textToMatch.includes("ML") ||
            textToMatch.includes("DATA") ||
            textToMatch.includes("PYTHON"))
        );
      }

      return matchesSearch && textToMatch.includes(activeCategory);
    });
  }, [searchQuery, activeCategory]);

  const totalModulesCount = useMemo(
    () =>
      (PREBUILT_ROLES || []).reduce(
        (acc, curr) => acc + (Number(curr.totalSkills) || 0),
        0
      ),
    []
  );

  return (
    <div className="relative min-h-screen w-full bg-[#FAFAFA] text-[#111827] overflow-x-hidden font-inter selection:bg-[#7C3AED]/15 selection:text-[#6D3DF5]">
      {/* Soft Ambient Background Glows */}
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_12%_12%,rgba(109,61,245,0.08)_0%,transparent_42%),radial-gradient(circle_at_88%_82%,rgba(168,85,247,0.08)_0%,transparent_45%)]" />
      <div className="pointer-events-none absolute top-16 left-1/2 -translate-x-1/2 w-[90vw] max-w-[750px] h-[280px] bg-gradient-to-tr from-[#6D3DF5]/10 via-[#9577F4]/10 to-transparent blur-[100px] rounded-full" />

      {/* Subtle Radial Dot Grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(#6D3DF5 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          opacity: 0.14,
          maskImage:
            "radial-gradient(ellipse 75% 55% at 50% 25%, black 10%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 55% at 50% 25%, black 10%, transparent 75%)",
        }}
      />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-[1320px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 pt-28 sm:pt-36 pb-20">
        {/* ── Hero Header Section ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-14"
        >
          {/* Main Heading */}
          <h1 className="font-geist text-[clamp(2.1rem,5vw,4rem)] font-bold tracking-[-0.045em] text-[#111827] mb-4 leading-[1.02]">
            Ready-Made Career{" "}
            <span className="bg-gradient-to-r from-[#6D3DF5] via-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent font-iowan italic font-normal pr-1">
              Roadmaps.
            </span>
          </h1>

          <p className="text-[#64748B] font-inter text-sm sm:text-base md:text-[17px] leading-relaxed max-w-2xl mx-auto mb-8 px-2">
            Explore structured learning paths built for modern developers — pick a role below or explore custom career paths.
          </p>

          {/* Quick Stats Strip */}
          <div className="inline-grid grid-cols-3 gap-2 sm:gap-4 p-1.5 sm:p-2 rounded-2xl border border-stone-200/80 bg-white/85 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.03)] mb-8 w-full max-w-lg">
            <div className="flex flex-col items-center justify-center py-2 px-2 sm:px-4 rounded-xl bg-[#F8FAFC]">
              <span className="font-geist text-lg sm:text-2xl font-black text-[#111827]">
                {PREBUILT_ROLES?.length || 0}+
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#64748B] font-exo">
                Career Tracks
              </span>
            </div>
            <div className="flex flex-col items-center justify-center py-2 px-2 sm:px-4 rounded-xl bg-[#F8FAFC]">
              <span className="font-geist text-lg sm:text-2xl font-black text-[#6D3DF5]">
                {totalModulesCount}+
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#64748B] font-exo">
                Skill Modules
              </span>
            </div>
            <div className="flex flex-col items-center justify-center py-2 px-2 sm:px-4 rounded-xl bg-[#F8FAFC]">
              <span className="font-geist text-lg sm:text-2xl font-black text-[#7C3AED]">
                100%
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#64748B] font-exo">
                Free & Open
              </span>
            </div>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="flex flex-col gap-3.5 max-w-2xl mx-auto">
            <div className="relative flex items-center w-full">
              <FiSearch className="absolute left-4 w-4 h-4 text-[#6D3DF5] pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter roadmaps by role or skill (e.g. React, Python, Backend)..."
                className="w-full pl-11 pr-28 py-3.5 rounded-2xl bg-white border border-stone-200/90 text-xs sm:text-sm text-[#111827] placeholder-[#94A3B8] shadow-[0_8px_30px_-8px_rgba(17,24,39,0.05)] outline-none transition-all duration-300 focus:border-[#6D3DF5] focus:ring-4 focus:ring-[#6D3DF5]/10"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 p-1.5 rounded-lg text-stone-400 hover:text-[#111827] hover:bg-stone-100 transition-colors cursor-pointer"
                  aria-label="Clear search"
                >
                  <FiX className="w-4 h-4" />
                </button>
              ) : (
                <Link
                  to="/explore"
                  className="hidden sm:inline-flex items-center gap-1.5 absolute right-2 px-3.5 py-2 rounded-xl bg-[#6D3DF5]/[0.08] hover:bg-[#6D3DF5] text-[#6D3DF5] hover:text-white text-xs font-semibold transition-all duration-200"
                >
                  <span>Explore Search</span>
                  <FiArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto no-scrollbar pb-1 px-1">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`shrink-0 px-3.5 py-1.5 rounded-full font-exo text-[10px] sm:text-[11px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-[#6D3DF5] text-white shadow-[0_4px_14px_rgba(109,61,245,0.35)]"
                        : "bg-white border border-stone-200/80 text-[#64748B] hover:border-[#6D3DF5]/30 hover:text-[#6D3DF5]"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ── Roadmaps Gallery Grid ─────────────────────────────────────────── */}
        {filteredRoles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7 mb-20">
            <AnimatePresence mode="popLayout">
              {filteredRoles.map((item, idx) => (
                <motion.div
                  layout
                  key={item.slug}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.45, delay: idx * 0.06 }}
                  className="group relative flex flex-col justify-between rounded-[26px] border border-stone-200/90 bg-white/95 backdrop-blur-xl p-5 sm:p-6 lg:p-7 shadow-[0_10px_30px_-12px_rgba(17,24,39,0.05)] hover:shadow-[0_24px_50px_-12px_rgba(109,61,245,0.16)] hover:border-[#6D3DF5]/35 transition-all duration-300 hover:-translate-y-1.5 overflow-hidden"
                >
                  {/* Top Gradient Accent Bar */}
                  <div
                    className={`absolute top-0 inset-x-0 h-[3.5px] bg-gradient-to-r ${
                      item.gradient || "from-[#6D3DF5] via-[#7C3AED] to-[#A855F7]"
                    } opacity-75 group-hover:opacity-100 transition-opacity duration-300`}
                  />

                  {/* Soft Ambient Corner Glow on Hover */}
                  <div className="pointer-events-none absolute -right-12 -top-12 w-36 h-36 rounded-full bg-[#6D3DF5]/[0.06] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div>
                    {/* Card Top Meta Row */}
                    <div className="flex items-center justify-between gap-2 mb-5">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#6D3DF5]/20 bg-[#6D3DF5]/[0.07] font-exo text-[11px] font-bold text-[#6D3DF5]">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-[#6D3DF5] bg-[#6D3DF5]/[0.07] border border-[#6D3DF5]/15 font-exo uppercase tracking-wider">
                          <FiLayers className="w-3 h-3 text-[#6D3DF5]" />
                          {item.totalSkills} Modules
                        </span>
                      </div>
                    </div>

                    {/* Role Title */}
                    <h3 className="font-geist text-xl sm:text-[22px] font-bold text-[#111827] mb-2 group-hover:text-[#6D3DF5] transition-colors tracking-tight leading-snug">
                      {item.role}
                    </h3>

                    {/* Description */}
                    <p className="text-[#64748B] font-inter text-xs sm:text-sm leading-relaxed mb-6 line-clamp-3">
                      {item.description}
                    </p>

                    {/* Top Skills Tags */}
                    <div className="mb-6">
                      <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#94A3B8] font-exo mb-2.5">
                        Core Skills Inside
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(item.topSkills || []).map((sk) => (
                          <span
                            key={sk}
                            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#334155] bg-white px-2.5 py-1 rounded-lg border border-stone-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] group-hover:border-[#6D3DF5]/20 transition-colors"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-[#6D3DF5]/70" />
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Button: View in Explore */}
                  <div className="pt-4 border-t border-stone-100">
                    <Link
                      to={`/explore/${item.slug}`}
                      className="w-full flex items-center justify-between py-2.5 pl-4 pr-2.5 rounded-2xl bg-[#111827] group-hover:bg-gradient-to-r group-hover:from-[#6D3DF5] group-hover:via-[#7C3AED] group-hover:to-[#9577F4] text-white text-xs sm:text-sm font-semibold tracking-wide shadow-sm group-hover:shadow-[0_10px_25px_-5px_rgba(109,61,245,0.45)] transition-all duration-300"
                    >
                      <span className="font-geist">Explore Interactive Path</span>
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 group-hover:bg-white group-hover:text-[#6D3DF5] transition-all duration-300 group-hover:-rotate-45">
                        <FiArrowRight className="w-4 h-4" />
                      </span>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* Empty Filter State */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-3xl border border-dashed border-stone-300 bg-white/80 p-10 sm:p-14 text-center max-w-xl mx-auto mb-20"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#6D3DF5]/10 text-[#6D3DF5] flex items-center justify-center mx-auto mb-4">
              <FiSearch className="w-6 h-6" />
            </div>
            <h3 className="font-geist text-xl font-bold text-[#111827] mb-2">
              No prebuilt roadmap matches &ldquo;{searchQuery}&rdquo;
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] mb-6">
              Don&apos;t worry — you can explore other specializations or search in Explore.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("ALL");
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs sm:text-sm font-semibold text-[#111827] hover:border-[#6D3DF5]/40 cursor-pointer"
              >
                Reset Filters
              </button>
              <Link
                to="/explore"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6D3DF5] to-[#7C3AED] text-xs sm:text-sm font-semibold text-white shadow-md"
              >
                <span>Open Explore</span>
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}

        {/* ── Bottom Callout Banner ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative overflow-hidden rounded-[30px] border border-[#6D3DF5]/20 bg-white p-7 sm:p-12 lg:p-14 text-center shadow-[0_20px_50px_-15px_rgba(109,61,245,0.12)]"
        >
          {/* Top Gradient Bar */}
          <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#6D3DF5] via-[#9577F4] to-[#A855F7]" />

          {/* Decorative Background Rings */}
          <div className="pointer-events-none absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-[#6D3DF5]/[0.06] blur-3xl" />
          <div className="pointer-events-none absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#A855F7]/[0.06] blur-3xl" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6D3DF5]/10 to-[#A855F7]/10 text-[#6D3DF5] flex items-center justify-center mx-auto mb-5 border border-[#6D3DF5]/20 shadow-sm">
              <FiCompass className="w-7 h-7" />
            </div>

            <h2 className="font-geist text-2xl sm:text-3xl lg:text-4xl font-bold text-[#111827] tracking-tight mb-3">
              Looking for a different{" "}
              <span className="font-iowan italic font-normal bg-gradient-to-r from-[#6D3DF5] to-[#A855F7] bg-clip-text text-transparent pr-1">
                specialization?
              </span>
            </h2>

            <p className="text-[#64748B] font-inter text-xs sm:text-base leading-relaxed mb-8">
              Explore our interactive search engine to navigate through role prerequisites and module dependencies seamlessly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                to="/explore"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#6D3DF5] via-[#7C3AED] to-[#9577F4] text-white text-xs sm:text-sm font-semibold tracking-wide shadow-[0_10px_25px_-5px_rgba(109,61,245,0.45)] hover:shadow-[0_16px_32px_-5px_rgba(109,61,245,0.6)] hover:-translate-y-0.5 transition-all font-geist"
              >
                <span>Open Explore Search</span>
                <FiArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/progress"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-stone-200 bg-[#F8FAFC] hover:bg-white hover:border-[#6D3DF5]/30 text-[#111827] hover:text-[#6D3DF5] text-xs sm:text-sm font-semibold transition-all font-geist"
              >
                <FiCheckCircle className="w-4 h-4 text-[#6D3DF5]" />
                <span>Track My Progress</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Roadmap;