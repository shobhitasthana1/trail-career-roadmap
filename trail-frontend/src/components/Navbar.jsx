import { useState, useEffect } from "react";
import ButtonOne from "./buttons/ButtonOne";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navLinks = ["Home", "Explore", "Roadmap", "Progress", "Resources"];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] px-5 sm:px-8 md:px-12 lg:px-16 ${
          isScrolled && !mobileMenuOpen
            ? "py-3 lg:py-4 bg-white/80 backdrop-blur-xl border-b border-stone-200/50 shadow-sm"
            : "py-5 lg:py-8 bg-transparent border-b border-transparent"
        }`}
      >
        <div className="flex items-center justify-between w-full max-w-[1400px] mx-auto">
          {/* Logo */}
          <div className="shrink-0 cursor-pointer flex items-center gap-2 z-50">
            <img
              className="w-24 sm:w-28 lg:w-36 xl:w-40 object-contain transition-transform duration-500 hover:scale-105"
              src="/images/traiilhd.webp"
              alt="TRAIL Logo"
            />
          </div>

          {/* Desktop Nav Links - Ultra Premium Animation */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-12">
            {navLinks.map((item) => (
              <a
                key={item}
                href="#"
                className="group relative flex items-center gap-2 px-1 py-2 font-medium text-[15px] xl:text-[16px] overflow-hidden"
              >
                {/* Explore Ping Dot */}
                {item === "Explore" && (
                  <span className="relative flex h-1.5 w-1.5 xl:h-2 xl:w-2 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#7C3AED] opacity-75"></span>
                    <span className="relative inline-flex h-1.5 w-1.5 xl:h-2 xl:w-2 rounded-full bg-[#7C3AED]"></span>
                  </span>
                )}
                
                {/* 3D Rolling Text Magic */}
                <span className="relative block h-[24px] overflow-hidden leading-[24px]">
                  <span className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-[24px]">
                    <span className="h-[24px] flex items-center text-stone-600">
                      {item}
                    </span>
                    <span className="h-[24px] flex items-center text-[#7C3AED]">
                      {item}
                    </span>
                  </span>
                </span>

                {/* Sweeping Underline */}
                <span className="absolute bottom-1 left-0 h-[2px] w-full origin-right scale-x-0 rounded-full bg-[#7C3AED] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:origin-left group-hover:scale-x-100" />
              </a>
            ))}
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden lg:flex items-center gap-6 xl:scale-110 origin-right transition-transform">
            <div className="transition-transform duration-300 hover:scale-[1.05] active:scale-95">
              <ButtonOne text="Get Started" />
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center z-50">
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="relative w-12 h-12 flex items-center justify-center rounded-full bg-stone-900 text-white hover:bg-[#7C3AED] transition-colors duration-300 active:scale-90 cursor-pointer"
              aria-label="Toggle Menu"
            >
              <div className="w-5 h-5 flex flex-col justify-center items-center gap-[5px]">
                <span
                  className={`block h-[2px] w-full bg-current transition-all duration-300 ease-out ${
                    mobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""
                  }`}
                />
                <span
                  className={`block h-[2px] w-full bg-current transition-all duration-300 ease-out ${
                    mobileMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`block h-[2px] w-full bg-current transition-all duration-300 ease-out ${
                    mobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-[#050505] lg:hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto clip-path-full"
            : "opacity-0 pointer-events-none clip-path-top"
        }`}
        style={{
          clipPath: mobileMenuOpen
            ? "circle(150% at 90% 10%)"
            : "circle(0% at 90% 10%)",
        }}
      >
        <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-[#7C3AED] opacity-20 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
        
        <div className="flex flex-col justify-center h-full px-6 sm:px-10 pt-24 pb-12 relative z-10">
          <div className="flex flex-col gap-6 sm:gap-8">
            {navLinks.map((item, index) => (
              <a
                key={item}
                href="#"
                onClick={() => setMobileMenuOpen(false)}
                className={`group flex items-center text-4xl sm:text-5xl font-semibold tracking-tight text-stone-300 hover:text-white transition-all duration-500 ease-out`}
                style={{
                  transform: mobileMenuOpen ? "translateY(0)" : "translateY(40px)",
                  opacity: mobileMenuOpen ? 1 : 0,
                  transitionDelay: `${index * 75 + 100}ms`,
                }}
              >
                {item === "Explore" && (
                  <span className="w-3 h-3 sm:w-4 sm:h-4 mr-4 sm:mr-6 rounded-full bg-[#7C3AED] shadow-[0_0_20px_rgba(124,58,237,1)]"></span>
                )}
                <span className="bg-clip-text transition-colors duration-300 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-[#7C3AED]">
                  {item}
                </span>
              </a>
            ))}
          </div>

          <div 
            className="mt-auto pt-10"
            style={{
              transform: mobileMenuOpen ? "translateY(0)" : "translateY(40px)",
              opacity: mobileMenuOpen ? 1 : 0,
              transitionDelay: "500ms",
              transitionDuration: "700ms",
            }}
          >
            <div className="w-full h-[1px] bg-white/10 mb-8" />
            <div className="flex items-center justify-between">
              <span className="text-stone-400 font-medium tracking-wide uppercase text-sm">Start your journey</span>
              <ButtonOne text="Get Started" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;