import React, { useState, useEffect } from "react";
import ButtonOne from "./ButtonOne";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = ["Home", "Explore", "Roadmap", "Progress", "Resources"];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out px-4 sm:px-6 md:px-10 py-3 sm:py-4 ${
        isScrolled
          ? "bg-white/85 backdrop-blur-md border-b border-stone-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]"
          : "bg-white/60 backdrop-blur-sm border-b border-stone-100"
      }`}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="shrink-0 cursor-pointer flex items-center gap-2">
          <img
            className="w-20 sm:w-24 md:w-28 object-contain transition-transform duration-300 hover:scale-105"
            src="/images/logo.webp"
            alt="TRAIL Logo"
          />
        </div>

        <div className="hidden md:flex items-center gap-8 lg:gap-10 text-stone-600 font-medium">
          {navLinks.map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm tracking-wide flex items-center gap-2 font-medium hover:text-[#7C3AED] transition-colors relative group py-1"
            >
              {item === "Roadmap" && (
                <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)] animate-pulse"></span>
              )}
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#7C3AED] transition-all duration-300 group-hover:w-full rounded-full" />
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-6">
          <div className="transition-transform duration-300 hover:scale-[1.03] active:scale-95">
            <ButtonOne text="Get Started" />
          </div>
        </div>

        <div className="flex md:hidden items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-stone-800 rounded-xl bg-stone-100/80 hover:bg-stone-200/80 focus:outline-none transition-colors"
            aria-label="Toggle Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-stone-200/80 shadow-2xl py-6 px-6 flex flex-col gap-3 md:hidden transition-all duration-300">
          {navLinks.map((item) => (
            <a
              key={item}
              href="#"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-stone-700 hover:text-[#7C3AED] flex items-center justify-between py-3 px-4 rounded-xl hover:bg-purple-50/50 transition-all"
            >
              <span className="flex items-center gap-2.5">
                {item === "Roadmap" && (
                  <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span>
                )}
                {item}
              </span>
              <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          ))}
          <div className="pt-3 w-full">
            <ButtonOne text="Get Started" />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;