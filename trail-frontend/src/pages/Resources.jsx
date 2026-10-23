import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  FiSearch,
  FiX,
  FiExternalLink,
  FiBookmark,
  FiCompass,
  FiLayers,
  FiCpu,
  FiDatabase,
  FiServer,
  FiTerminal,
  FiCode,
  FiBookOpen,
  FiCheck,
} from "react-icons/fi";
import { FaBookmark } from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import Footer from "../components/footer/Footer";
import {
  RESOURCES_DATA,
  RESOURCE_CATEGORIES,
  RESOURCE_TYPES,
} from "../data/resourcesData";
import {
  fetchBookmarkedResourceIds,
  toggleBookmarkResource,
} from "../services/api";

const CATEGORY_ICONS = {
  All: FiLayers,
  Frontend: FiCode,
  Backend: FiServer,
  "Data & AI": FiDatabase,
  DevOps: FiTerminal,
  "DSA & Interview": FiCpu,
  "CS Core": FiBookOpen,
};

const DIFFICULTY_STYLES = {
  Beginner: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  Intermediate: "bg-amber-50 text-amber-700 border-amber-200/80",
  Advanced: "bg-purple-50 text-purple-700 border-purple-200/80",
};

const TYPE_STYLES = {
  Docs: "bg-blue-50 text-blue-700 border-blue-200/80",
  Course: "bg-violet-50 text-violet-700 border-violet-200/80",
  Interactive: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  Practice: "bg-orange-50 text-orange-700 border-orange-200/80",
  Video: "bg-rose-50 text-rose-700 border-rose-200/80",
  Book: "bg-stone-100 text-stone-700 border-stone-200/80",
};

const Resources = () => {
  const { isAuthenticated, user } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [guestPrompt, setGuestPrompt] = useState(false);

  const searchInputRef = useRef(null);
  const catalogRef = useRef(null);

  // Load bookmarks for authenticated user
  useEffect(() => {
    if (isAuthenticated) {
      fetchBookmarkedResourceIds().then((ids) => {
        setBookmarkedIds(ids || []);
      });
    } else {
      setBookmarkedIds([]);
      setShowSavedOnly(false);
    }
  }, [isAuthenticated, user]);

  // Handle bookmark click
  const handleToggleBookmark = async (e, resourceId) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setGuestPrompt(true);
      setTimeout(() => setGuestPrompt(false), 4000);
      return;
    }

    try {
      const { bookmarkedIds: updated } = await toggleBookmarkResource(resourceId);
      setBookmarkedIds(updated);
    } catch {
      // handled
    }
  };

  // Scroll smoothly to catalog
  const scrollToCatalog = () => {
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Category counts computed from real data
  const categoryCounts = useMemo(() => {
    const counts = { All: RESOURCES_DATA.length };
    RESOURCE_CATEGORIES.forEach((cat) => {
      if (cat !== "All") {
        counts[cat] = RESOURCES_DATA.filter((r) => r.category === cat).length;
      }
    });
    return counts;
  }, []);

  // Filtered resources
  const filteredResources = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return RESOURCES_DATA.filter((item) => {
      // Category filter
      if (selectedCategory !== "All" && item.category !== selectedCategory) {
        return false;
      }

      // Type filter
      if (selectedType !== "All" && item.type !== selectedType) {
        return false;
      }

      // Saved only filter
      if (showSavedOnly && !bookmarkedIds.includes(item.id)) {
        return false;
      }

      // Text query match: title, provider, description, skills, category
      if (q) {
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesProvider = item.provider.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        const matchesSkill = item.skills.some((s) => s.toLowerCase().includes(q));

        if (
          !matchesTitle &&
          !matchesProvider &&
          !matchesDesc &&
          !matchesCategory &&
          !matchesSkill
        ) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedType, showSavedOnly, bookmarkedIds]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedType("All");
    setShowSavedOnly(false);
  };

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

      {/* Guest Bookmark Prompt Toast */}
      <AnimatePresence>
        {guestPrompt && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 right-5 sm:right-8 z-50 flex items-center gap-3 bg-[#111827] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-md"
          >
            <FiBookmark className="w-5 h-5 text-[#9577F4]" />
            <div className="text-xs sm:text-sm">
              <span className="font-semibold block">Save to Library</span>
              <span className="text-stone-300">Log in to bookmark free resources</span>
            </div>
            <Link
              to="/login"
              className="ml-2 px-3 py-1 bg-gradient-to-r from-[#6D3DF5] to-[#9577F4] text-white text-xs font-semibold rounded-lg hover:brightness-110 transition-all"
            >
              Log In
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 pt-32 sm:pt-40 pb-20">
        {/* ── 1. HERO ──────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6D3DF5]/[0.06] border border-[#6D3DF5]/15 mb-6 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6D3DF5] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6D3DF5]"></span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6D3DF5] font-exo">
              Curated Knowledge Vault · {RESOURCES_DATA.length} Verified Sources
            </span>
          </div>

          <h1 className="font-geist text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#111827] mb-6 leading-[1.08]">
            Curated High-Impact{" "}
            <span className="bg-gradient-to-r from-[#6D3DF5] via-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent font-iowan italic font-normal">
              Resources.
            </span>
          </h1>

          <p className="text-[#64748B] font-inter text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Zero noise. Every guide, documentation cheatsheet, interactive tutorial, and problem set is 100% free and handpicked for real industry engineering skills.
          </p>
        </motion.div>

        {/* ── 2. SEARCH & FILTER HUB CARD ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative rounded-[28px] border border-stone-200/90 bg-white/95 backdrop-blur-2xl p-6 sm:p-8 md:p-10 mb-14 shadow-[0_20px_50px_-15px_rgba(17,24,39,0.06)]"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#6D3DF5]/10 to-transparent blur-3xl pointer-events-none" />

          {/* Top Row: Context & Auth-aware CTA */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-stone-100 relative z-10">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#6D3DF5] mb-1 font-exo">
                {isAuthenticated ? "Curated Vault • Member Access" : "Curated Vault • Free Access"}
              </span>
              <h2 className="font-geist text-xl sm:text-2xl font-bold text-[#111827]">
                Search & Filter Verified Libraries
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    setShowSavedOnly((prev) => !prev);
                    scrollToCatalog();
                  }}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all font-geist ${
                    showSavedOnly
                      ? "bg-[#6D3DF5] text-white shadow-[0_6px_20px_rgba(109,61,245,0.35)]"
                      : "bg-[#6D3DF5]/10 text-[#6D3DF5] hover:bg-[#6D3DF5]/15 border border-[#6D3DF5]/20"
                  }`}
                >
                  <FaBookmark className="w-3.5 h-3.5" />
                  <span>
                    {showSavedOnly
                      ? "Showing Saved"
                      : `My Saved (${bookmarkedIds.length})`}
                  </span>
                </button>
              ) : (
                <Link
                  to="/signup"
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#6D3DF5] to-[#9577F4] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white tracking-wide shadow-[0_8px_20px_-4px_rgba(109,61,245,0.4)] transition-all duration-300 hover:shadow-[0_12px_25px_-4px_rgba(109,61,245,0.55)] hover:-translate-y-0.5 active:scale-[0.98] font-geist"
                >
                  <span>Create Account to Access</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              )}
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="relative mt-6 z-10">
            <div className="relative flex items-center w-full rounded-2xl border-2 border-stone-200/80 bg-[#FAFAFA] transition-all duration-300 focus-within:border-[#6D3DF5] focus-within:bg-white focus-within:shadow-[0_8px_30px_rgba(109,61,245,0.12)]">
              <div className="pl-4 sm:pl-5 text-stone-400">
                <FiSearch className="w-5 h-5 text-stone-400" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, technology, skill (e.g. React, SQL, Docker, LeetCode, Git)..."
                className="w-full bg-transparent px-4 py-3.5 sm:py-4 text-sm sm:text-base text-[#111827] placeholder:text-stone-400 focus:outline-none font-inter"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="p-2 mr-3 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-200/60 transition-colors"
                  aria-label="Clear search"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs (Pills) */}
          <div className="mt-6 pt-5 border-t border-stone-100 z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 font-exo">
                Filter By Domain
              </span>
              <span className="text-xs text-stone-400 font-medium">
                {filteredResources.length} of {RESOURCES_DATA.length} resources
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {RESOURCE_CATEGORIES.map((category) => {
                const isSelected = selectedCategory === category;
                const Icon = CATEGORY_ICONS[category] || FiLayers;
                const count = categoryCounts[category] || 0;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(category);
                      scrollToCatalog();
                    }}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all font-geist cursor-pointer ${
                      isSelected
                        ? "bg-[#6D3DF5] text-white shadow-[0_6px_18px_rgba(109,61,245,0.3)] scale-[1.02]"
                        : "bg-stone-100/80 text-stone-600 hover:bg-stone-200/80 hover:text-stone-900 border border-stone-200/60"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-[#6D3DF5]"}`} />
                    <span>{category}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        isSelected
                          ? "bg-white/25 text-white"
                          : "bg-white text-stone-500 border border-stone-200"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Secondary Filter: Resource Type Tabs */}
          <div className="mt-4 pt-3 flex flex-wrap items-center gap-2 z-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 font-exo mr-2">
              Type:
            </span>
            {RESOURCE_TYPES.map((type) => {
              const isSelected = selectedType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-[#111827] text-white"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200/70"
                  }`}
                >
                  {type === "All" ? "All Types" : type}
                </button>
              );
            })}

            {(searchQuery || selectedCategory !== "All" || selectedType !== "All" || showSavedOnly) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-[#6D3DF5] hover:text-[#5b30d6] transition-colors py-1 px-2.5 rounded-lg hover:bg-[#6D3DF5]/[0.06]"
              >
                <FiX className="w-3.5 h-3.5" />
                Reset Filters
              </button>
            )}
          </div>
        </motion.div>

        {/* ── 3. RESOURCE CARDS GRID ───────────────────────────────────────── */}
        <div ref={catalogRef} className="pt-2">
          {/* Header count indicator */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <h3 className="font-geist text-xl sm:text-2xl font-bold text-[#111827]">
                {showSavedOnly
                  ? "My Bookmarked Resources"
                  : selectedCategory === "All"
                  ? "All Curated Resources"
                  : `${selectedCategory} Library`}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#6D3DF5]/10 text-[#6D3DF5] font-exo border border-[#6D3DF5]/20">
                {filteredResources.length} items
              </span>
            </div>

            {filteredResources.length > 0 && (
              <p className="text-xs text-stone-500 hidden sm:block">
                Click any resource card to launch in new tab
              </p>
            )}
          </div>

          {/* Empty State */}
          {filteredResources.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-stone-200 bg-white p-12 sm:p-16 text-center max-w-xl mx-auto shadow-sm"
            >
              <div className="mx-auto w-16 h-16 rounded-2xl bg-[#6D3DF5]/10 flex items-center justify-center text-[#6D3DF5] mb-5">
                <FiCompass className="w-8 h-8" />
              </div>
              <h4 className="font-geist text-xl font-bold text-[#111827] mb-2">
                No resources found
              </h4>
              <p className="text-stone-500 text-sm mb-6">
                {showSavedOnly
                  ? "You haven't bookmarked any resources yet. Browse the categories and click the bookmark icon on any card."
                  : "No resources matched your current search filters. Try using a different keyword or reset filters."}
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6D3DF5] to-[#9577F4] text-white text-xs font-semibold hover:shadow-lg transition-all"
              >
                Clear All Filters
              </button>
            </motion.div>
          ) : (
            /* Resource Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((item, index) => {
                const isBookmarked = bookmarkedIds.includes(item.id);

                return (
                  <motion.a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: Math.min(index * 0.03, 0.3),
                      ease: "easeOut",
                    }}
                    className="group relative flex flex-col justify-between rounded-2xl border border-stone-200/90 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_-8px_rgba(109,61,245,0.14)] hover:border-[#6D3DF5]/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  >
                    <div>
                      {/* Top Header: Provider + Bookmark */}
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 font-exo">
                            {item.provider}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {/* Bookmark button */}
                          <button
                            type="button"
                            onClick={(e) => handleToggleBookmark(e, item.id)}
                            title={
                              isBookmarked
                                ? "Remove bookmark"
                                : isAuthenticated
                                ? "Save resource"
                                : "Log in to save"
                            }
                            className={`p-1.5 rounded-lg transition-colors ${
                              isBookmarked
                                ? "text-[#6D3DF5] bg-[#6D3DF5]/10 hover:bg-[#6D3DF5]/20"
                                : "text-stone-300 hover:text-[#6D3DF5] hover:bg-stone-100"
                            }`}
                          >
                            {isBookmarked ? (
                              <FaBookmark className="w-4 h-4" />
                            ) : (
                              <FiBookmark className="w-4 h-4" />
                            )}
                          </button>

                          {/* External link indicator */}
                          <div className="p-1.5 text-stone-300 group-hover:text-[#6D3DF5] transition-colors">
                            <FiExternalLink className="w-4 h-4" />
                          </div>
                        </div>
                      </div>

                      {/* Title */}
                      <h4 className="font-geist text-lg font-bold text-[#111827] group-hover:text-[#6D3DF5] transition-colors leading-snug mb-2">
                        {item.title}
                      </h4>

                      {/* Description */}
                      <p className="text-[#64748B] text-xs sm:text-[13px] leading-relaxed line-clamp-2 mb-4 font-inter">
                        {item.description}
                      </p>

                      {/* Skill tags */}
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {item.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 rounded-md bg-stone-100/70 border border-stone-200/60 text-[11px] font-medium text-stone-600 font-inter"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Metadata Badges */}
                    <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        {/* Type badge */}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            TYPE_STYLES[item.type] || "bg-stone-100 text-stone-700 border-stone-200"
                          }`}
                        >
                          {item.type}
                        </span>

                        {/* Difficulty badge */}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            DIFFICULTY_STYLES[item.difficulty] || "bg-stone-100 text-stone-700"
                          }`}
                        >
                          {item.difficulty}
                        </span>
                      </div>

                      {/* Free Tag */}
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 font-exo">
                        <FiCheck className="w-3 h-3 text-emerald-600 stroke-[3]" />
                        100% Free
                      </span>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Resources;
