import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  FiCompass,
  FiArrowRight,
  FiTrendingUp,
  FiLayers,
  FiCheckCircle,
  FiSearch,
} from "react-icons/fi";

import Footer from "../components/footer/Footer";
import { PREBUILT_ROLES } from "../services/api";

const Roadmap = () => {
  return (
    <div className="relative min-h-screen w-full bg-[#FAFAFA] text-[#111827] overflow-x-hidden font-inter selection:bg-[#7C3AED]/15 selection:text-[#6D3DF5]">
      {/* Soft Ambient Background Glows */}
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_15%_15%,rgba(109,61,245,0.07)_0%,transparent_45%),radial-gradient(circle_at_85%_85%,rgba(168,85,247,0.07)_0%,transparent_45%)]" />

      {/* Subtle Radial Dot Grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(#6D3DF5 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          opacity: 0.12,
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 30%, black 0%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 30%, black 0%, transparent 75%)",
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-12 pt-32 sm:pt-40 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-14 sm:mb-16"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6D3DF5]/[0.06] border border-[#6D3DF5]/15 mb-5 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6D3DF5] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6D3DF5]"></span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6D3DF5] font-exo">
              Curated Roadmaps Gallery
            </span>
          </div>

          <h1 className="font-geist text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#111827] mb-5 leading-[1.1]">
            Ready-Made Career{" "}
            <span className="bg-gradient-to-r from-[#6D3DF5] via-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent font-iowan italic font-normal">
              Roadmaps.
            </span>
          </h1>

          <p className="text-[#64748B] font-inter text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-6">
            These roadmaps are ready — open any in Explore to view it interactively, or search any other role there.
          </p>

          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-[#6D3DF5] hover:border-[#6D3DF5]/40 hover:bg-[#6D3DF5]/[0.03] text-xs sm:text-sm font-semibold transition-all shadow-sm"
          >
            <FiSearch className="w-4 h-4 text-[#6D3DF5]" />
            <span>Search custom roles in Explore</span>
            <FiArrowRight className="w-4 h-4 text-stone-400" />
          </Link>
        </motion.div>

        {/* ── Roadmaps Gallery Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-20">
          {PREBUILT_ROLES.map((item, idx) => (
            <motion.div
              key={item.slug}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group relative flex flex-col justify-between rounded-3xl border border-stone-200/90 bg-white/95 backdrop-blur-xl p-6 sm:p-7 shadow-[0_10px_30px_-10px_rgba(17,24,39,0.05)] hover:shadow-[0_20px_45px_-12px_rgba(109,61,245,0.15)] hover:border-[#6D3DF5]/30 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Top Accent Gradient Bar */}
              <div
                className={`absolute top-0 inset-x-6 h-[3px] rounded-full bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              <div>
                {/* Meta Header */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold text-[#6D3DF5] bg-[#6D3DF5]/10 border border-[#6D3DF5]/15 font-exo uppercase tracking-wider">
                    <FiLayers className="w-3 h-3 text-[#6D3DF5]" />
                    {item.totalSkills} Modules
                  </span>

                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                    <FiTrendingUp className="w-3 h-3 text-emerald-600" />
                    {item.marketDemandAvg} Demand
                  </span>
                </div>

                {/* Role Title */}
                <h3 className="font-geist text-xl sm:text-2xl font-bold text-[#111827] mb-2.5 group-hover:text-[#6D3DF5] transition-colors tracking-tight">
                  {item.role}
                </h3>

                {/* Description */}
                <p className="text-stone-500 font-inter text-xs sm:text-sm leading-relaxed mb-6">
                  {item.description}
                </p>

                {/* Top Skills Tags */}
                <div className="mb-6">
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-stone-400 font-exo mb-2">
                    Key Topics Covered:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.topSkills.map((sk) => (
                      <span
                        key={sk}
                        className="text-[11px] font-medium text-stone-600 bg-stone-100/90 px-2.5 py-1 rounded-lg border border-stone-200/60"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button: View in Explore */}
              <Link
                to={`/explore/${item.slug}`}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-stone-900 group-hover:bg-gradient-to-r group-hover:from-[#6D3DF5] group-hover:to-[#7C3AED] text-white text-xs sm:text-sm font-semibold tracking-wide shadow-sm group-hover:shadow-md transition-all duration-300"
              >
                <span>View in Explore</span>
                <FiArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* ── Bottom Callout ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="rounded-3xl border border-stone-200/90 bg-gradient-to-br from-white via-white to-[#6D3DF5]/[0.03] p-8 sm:p-12 text-center shadow-sm"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#6D3DF5]/10 text-[#6D3DF5] flex items-center justify-center mx-auto mb-4 border border-[#6D3DF5]/20">
            <FiCompass className="w-6 h-6" />
          </div>

          <h2 className="font-geist text-2xl sm:text-3xl font-bold text-[#111827] mb-3">
            Looking for a different technical specialization?
          </h2>

          <p className="text-stone-500 font-inter text-sm sm:text-base max-w-xl mx-auto mb-6">
            Our role search engine generates custom interactive roadmaps on the fly with accurate live market prerequisites.
          </p>

          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#6D3DF5] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#9577F4] text-white text-sm font-semibold tracking-wide shadow-md shadow-[#6D3DF5]/25 hover:shadow-lg transition-all"
          >
            <span>Open Explore Search</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Roadmap;
