import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  FiSearch,
  FiCompass,
  FiArrowRight,
  FiCheck,
  FiX,
  FiTrendingUp,
} from "react-icons/fi";

import { useAuth } from "../context/AuthContext";
import RoadmapCanvas from "../components/roadmap/RoadmapCanvas";
import Footer from "../components/footer/Footer";
import {
  PREBUILT_ROLES,
  generateRoadmap,
  fetchRoadmapBySlug,
} from "../services/api";

const Explore = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeRoleName, setActiveRoleName] = useState("");
  const [roadmapData, setRoadmapData] = useState(null);
  const [searchError, setSearchError] = useState("");

  const searchInputRef = useRef(null);

  // If slug is in URL (e.g. /explore/frontend-developer), auto-load that roadmap on mount.
  // If NO slug in URL (visiting /explore), do NOT pre-load anything; show empty state.
  useEffect(() => {
    if (!slug) {
      setRoadmapData(null);
      setActiveRoleName("");
      return;
    }

    let isMounted = true;
    setLoading(true);
    setSearchError("");

    fetchRoadmapBySlug(slug)
      .then((data) => {
        if (isMounted) {
          setRoadmapData(data);
          setActiveRoleName(data.roadmap.role);
          setLoading(false);
        }
      })
      .catch(() => {
        generateRoadmap(slug)
          .then((data) => {
            if (isMounted) {
              setRoadmapData(data);
              setActiveRoleName(data.roadmap.role);
              setLoading(false);
            }
          })
          .catch((err) => {
            if (isMounted) {
              setSearchError(err.message || "Failed to load roadmap");
              setLoading(false);
            }
          });
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Handle typing suggestions
  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (!val.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = PREBUILT_ROLES.filter((p) =>
      p.role.toLowerCase().includes(val.toLowerCase())
    );
    setSuggestions(filtered);
  };

  // Perform search / selection
  const handleSelectRole = async (roleName, roleSlug = null) => {
    setQuery("");
    setSuggestions([]);
    setIsFocused(false);
    setLoading(true);
    setSearchError("");
    setActiveRoleName(roleName);

    try {
      const data = await generateRoadmap(roleName);
      setRoadmapData(data);
      const newSlug = roleSlug || data.roadmap.slug;
      navigate(`/explore/${newSlug}`, { replace: false });
    } catch (err) {
      setSearchError(err.message || "Could not analyze role at this time.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    handleSelectRole(query.trim());
  };

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

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-12 pt-32 sm:pt-40 pb-20">
        {/* ── Intro Section ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-12"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6D3DF5]/[0.06] border border-[#6D3DF5]/15 mb-4 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6D3DF5] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6D3DF5]"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#6D3DF5] font-exo">
              Live Career Discovery
            </span>
          </div>

          <h1 className="font-geist text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#111827] mb-4 leading-[1.1]">
            Explore Tech Roadmaps &{" "}
            <span className="bg-gradient-to-r from-[#6D3DF5] via-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent font-iowan italic font-normal">
              Market Skills.
            </span>
          </h1>

          <p className="text-[#64748B] font-inter text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Search any tech role to instantly visualize prerequisite dependencies, real job-market demand, and curated learning modules.
          </p>
        </motion.div>

        {/* ── Prominent Search Bar Control ───────────────────────────────── */}
        <div className="max-w-3xl mx-auto mb-10 relative">
          <form
            onSubmit={handleFormSubmit}
            className={`relative flex items-center w-full rounded-2xl bg-white border transition-all duration-300 shadow-[0_12px_35px_-8px_rgba(109,61,245,0.08)] ${
              isFocused
                ? "border-[#7C3AED] ring-4 ring-[#6D3DF5]/10 shadow-[0_16px_40px_-6px_rgba(109,61,245,0.18)]"
                : "border-stone-200/90 hover:border-stone-300"
            }`}
          >
            <div className="pl-5 pr-2 text-stone-400">
              <FiSearch className="w-5 h-5 text-[#6D3DF5]" />
            </div>

            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              placeholder="Search any role — e.g. Frontend Developer, Backend Developer..."
              className="w-full py-4 pr-4 bg-transparent text-[#111827] placeholder-stone-400 font-inter text-sm sm:text-base outline-none"
            />

            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSuggestions([]);
                }}
                className="p-2 text-stone-400 hover:text-stone-600 mr-1"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}

            <div className="pr-2.5">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6D3DF5] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#9577F4] text-white text-xs sm:text-sm font-semibold tracking-wide shadow-md shadow-[#6D3DF5]/20 hover:shadow-lg transition-all active:scale-[0.98]"
              >
                <span>Search</span>
                <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Autocomplete dropdown */}
          <AnimatePresence>
            {isFocused && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 mt-2 z-40 bg-white rounded-2xl border border-stone-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.12)] overflow-hidden"
              >
                <div className="px-4 py-2 bg-stone-50 border-b border-stone-100 text-[11px] font-bold uppercase tracking-wider text-stone-500 font-exo">
                  Suggested Ready Roadmaps
                </div>
                <div className="py-1">
                  {suggestions.map((p) => (
                    <button
                      key={p.slug}
                      type="button"
                      onMouseDown={() => handleSelectRole(p.role, p.slug)}
                      className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[#6D3DF5]/[0.05] transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-[#6D3DF5]/10 flex items-center justify-center text-[#6D3DF5]">
                          <FiCompass className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#111827] group-hover:text-[#6D3DF5] transition-colors">
                            {p.role}
                          </p>
                          <p className="text-xs text-stone-500 line-clamp-1">
                            {p.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          {p.marketDemandAvg} Demand
                        </span>
                        <FiArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#6D3DF5] group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick-select chips for the 6 prebuilt roles */}
          <div className="flex items-center gap-2 mt-4 flex-wrap justify-center sm:justify-start">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400 font-exo mr-1">
              Popular:
            </span>
            {PREBUILT_ROLES.map((r) => {
              const isActive = (roadmapData?.roadmap?.slug || slug) === r.slug;
              return (
                <button
                  key={r.slug}
                  onClick={() => handleSelectRole(r.role, r.slug)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#6D3DF5] text-white shadow-md shadow-[#6D3DF5]/30"
                      : "bg-white border border-stone-200 text-stone-700 hover:border-[#6D3DF5]/40 hover:text-[#6D3DF5] hover:bg-[#6D3DF5]/[0.03]"
                  }`}
                >
                  <span>{r.role}</span>
                  {isActive && <FiCheck className="w-3 h-3" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Loading State ──────────────────────────────────────────────── */}
        {loading && (
          <div className="w-full py-24 flex flex-col items-center justify-center text-center">
            <div className="relative mb-5">
              <div className="w-16 h-16 rounded-full border-4 border-[#6D3DF5]/20 border-t-[#6D3DF5] animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <FiCompass className="w-6 h-6 text-[#6D3DF5]" />
              </div>
            </div>
            <h3 className="font-geist text-lg sm:text-xl font-bold text-[#111827] mb-1">
              Analyzing live job market for{" "}
              <span className="text-[#6D3DF5]">{activeRoleName || "role"}</span>…
            </h3>
            <p className="text-sm text-stone-500 font-inter">
              Synthesizing industry requirements, skill prerequisites, and graph hierarchy.
            </p>
          </div>
        )}

        {/* ── Error State ────────────────────────────────────────────────── */}
        {!loading && searchError && (
          <div className="max-w-xl mx-auto my-12 p-8 rounded-3xl bg-white border border-red-200/80 text-center shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4 border border-red-100">
              <FiCompass className="w-6 h-6" />
            </div>
            <h3 className="font-geist text-lg font-bold text-stone-800 mb-2">
              No roadmap generated yet
            </h3>
            <p className="text-sm text-stone-500 mb-6">{searchError}</p>
            <div className="flex flex-wrap justify-center gap-2">
              {PREBUILT_ROLES.map((r) => (
                <button
                  key={r.slug}
                  onClick={() => handleSelectRole(r.role, r.slug)}
                  className="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-[#6D3DF5] hover:text-white text-xs font-semibold text-stone-700 transition-colors"
                >
                  {r.role}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── 1) EMPTY STATE (When no role has been searched yet) ────────── */}
        {!loading && !searchError && !roadmapData && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full rounded-3xl border border-stone-200/90 bg-white/95 backdrop-blur-xl p-10 sm:p-16 text-center shadow-[0_12px_36px_-12px_rgba(17,24,39,0.05)]"
          >
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6D3DF5]/10 to-[#A855F7]/10 border border-[#6D3DF5]/20 flex items-center justify-center text-[#6D3DF5] mb-5 shadow-xs">
              <FiCompass className="w-8 h-8 text-[#6D3DF5]" />
            </div>

            <h2 className="font-geist text-2xl sm:text-3xl font-bold text-[#111827] mb-3 tracking-tight">
              Search any role above to generate its interactive roadmap
            </h2>

            <p className="text-stone-500 font-inter text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed">
              Discover foundational prerequisites, core technical frameworks, database architectures, and live hiring demand mapped into an interactive flowchart.
            </p>

            {/* Quick Suggestions Cards inside empty state */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto text-left">
              {PREBUILT_ROLES.slice(0, 3).map((roleItem) => (
                <button
                  key={roleItem.slug}
                  onClick={() => handleSelectRole(roleItem.role, roleItem.slug)}
                  className="group p-5 rounded-2xl border border-stone-200/80 bg-stone-50/70 hover:bg-white hover:border-[#6D3DF5]/40 hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#6D3DF5] font-exo uppercase tracking-wider">
                      {roleItem.totalSkills} Modules
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                      <FiTrendingUp className="w-3 h-3 text-emerald-600" />
                      {roleItem.marketDemandAvg}
                    </span>
                  </div>
                  <h3 className="font-geist font-bold text-base text-[#111827] group-hover:text-[#6D3DF5] transition-colors mb-1">
                    {roleItem.role}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2">
                    {roleItem.description}
                  </p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── 2) React Flow Interactive Roadmap Canvas (Visible after search) ─ */}
        {!loading && !searchError && roadmapData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full mt-4"
          >
            <RoadmapCanvas
              roadmapData={roadmapData}
              isLoggedIn={isLoggedIn}
            />
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Explore;
