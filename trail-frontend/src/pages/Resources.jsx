import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/footer/Footer";
import { FiFileText, FiCpu, FiLayers, FiBookOpen } from "react-icons/fi";

const resourceCollections = [
  {
    category: "Cheatsheets & Reference Guides",
    count: "48+ Docs",
    desc: "Syntax quick-references, Git interactive commands, Linux terminal power shortcuts, and CSS grid recipes.",
    tags: ["React 19", "TypeScript", "Tailwind CSS v4", "Docker", "SQL Queries"],
    icon: FiFileText,
  },
  {
    category: "Production Starters & Boilerplates",
    count: "18+ Repos",
    desc: "Production-ready templates with authentication, state caching, database connectors, and CI/CD pipelines.",
    tags: ["Vite + React", "Next.js 15", "Express + Prisma", "Microservices Boilerplate"],
    icon: FiCpu,
  },
  {
    category: "Interview Problem Frameworks",
    count: "120+ Patterns",
    desc: "System design blueprints, algorithmic problem patterns (Sliding Window, DFS/BFS, Dynamic Programming), and behavioral prep.",
    tags: ["System Design", "NeetCode Patterns", "Concurrency", "Behavioral Framework"],
    icon: FiLayers,
  },
  {
    category: "Curated Free Video Courses & Books",
    count: "65+ Resources",
    desc: "Handpicked high-signal courses from freeCodeCamp, MIT OpenCourseWare, Stanford CS, and top open-source books.",
    tags: ["MIT 6.006", "CS50", "The Rust Book", "Designing Data-Intensive Apps"],
    icon: FiBookOpen,
  },
];

const Resources = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative min-h-screen w-full bg-[#FAFAFA] text-[#111827] overflow-hidden font-inter selection:bg-[#7C3AED]/15 selection:text-[#6D3DF5]">
      {/* Soft Ambient Background Glows */}
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_15%_15%,rgba(109,61,245,0.07)_0%,transparent_45%),radial-gradient(circle_at_85%_85%,rgba(168,85,247,0.07)_0%,transparent_45%)]" />

      {/* Subtle Radial Dot Grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(#6D3DF5 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          opacity: 0.14,
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 40%, black 0%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 40%, black 0%, transparent 75%)",
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 pt-32 sm:pt-40 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16 sm:mb-20"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6D3DF5]/[0.06] border border-[#6D3DF5]/15 mb-6 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6D3DF5] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6D3DF5]"></span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6D3DF5] font-exo">
              Knowledge Repository
            </span>
          </div>

          <h1 className="font-geist text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#111827] mb-6 leading-[1.1]">
            Curated High-Impact{" "}
            <span className="bg-gradient-to-r from-[#6D3DF5] via-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent font-iowan italic font-normal">
              Resources.
            </span>
          </h1>

          <p className="text-[#64748B] font-inter text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Zero noise. Every guide, documentation cheatsheet, and starter repository is verified for signal and modern industry relevance.
          </p>
        </motion.div>

        {/* Coming Soon Teaser Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative rounded-[28px] border border-stone-200/90 bg-white/90 backdrop-blur-xl p-8 sm:p-12 mb-20 overflow-hidden shadow-[0_20px_50px_-15px_rgba(17,24,39,0.06)]"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#6D3DF5]/10 to-transparent blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="text-left max-w-xl">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#6D3DF5] mb-2 font-exo">
                {isAuthenticated ? "Curated Vault • Member Access" : "Curated Vault • Launching Soon"}
              </span>
              <h2 className="font-geist text-2xl sm:text-3xl font-bold text-[#111827] mb-3">
                Interactive Search & Resource Bookmarking
              </h2>
              <p className="text-[#64748B] text-sm sm:text-base leading-relaxed font-inter">
                {isAuthenticated
                  ? "Explore all role-aligned learning paths, bookmark curated cheat-sheets to your profile, and track completion."
                  : "Filter resources by tech stack, difficulty, and format. Save items directly to your profile and track completion alongside your roadmap."}
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              {isAuthenticated ? (
                <Link
                  to="/explore"
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#6D3DF5] to-[#9577F4] px-6 py-3.5 text-sm font-semibold text-white tracking-wide shadow-[0_8px_20px_-4px_rgba(109,61,245,0.4)] transition-all duration-300 hover:shadow-[0_12px_25px_-4px_rgba(109,61,245,0.55)] hover:-translate-y-0.5 active:scale-[0.98] font-geist"
                >
                  <span>Explore Roadmaps</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              ) : (
                <Link
                  to="/signup"
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#6D3DF5] to-[#9577F4] px-6 py-3.5 text-sm font-semibold text-white tracking-wide shadow-[0_8px_20px_-4px_rgba(109,61,245,0.4)] transition-all duration-300 hover:shadow-[0_12px_25px_-4px_rgba(109,61,245,0.55)] hover:-translate-y-0.5 active:scale-[0.98] font-geist"
                >
                  <span>Create Account to Access</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              )}
            </div>
          </div>
        </motion.div>

        {/* Resources Collections Preview */}
        <div className="mb-24">
          <h3 className="font-geist text-xl sm:text-2xl font-bold text-[#111827] mb-8">
            Featured Resource Categories
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resourceCollections.map((col, i) => (
              <motion.div
                key={col.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * i + 0.2 }}
                className="relative rounded-2xl border border-stone-200/90 bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:border-[#6D3DF5]/30 hover:shadow-[0_20px_40px_-15px_rgba(109,61,245,0.12)]"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6D3DF5]/[0.08] text-[#6D3DF5]">
                    <col.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#6D3DF5]/[0.08] text-[#6D3DF5] font-exo uppercase tracking-wider font-semibold">
                    {col.count}
                  </span>
                </div>

                <h4 className="font-geist text-xl font-bold text-[#111827] mb-2">
                  {col.category}
                </h4>

                <p className="text-[#64748B] text-sm leading-relaxed mb-6 font-inter">
                  {col.desc}
                </p>

                <div className="flex flex-wrap gap-2">
                  {col.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-semibold px-3 py-1 rounded-lg bg-[#FAFAFA] text-[#111827] border border-stone-200/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Resources;
