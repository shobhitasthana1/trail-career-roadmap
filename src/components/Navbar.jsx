import React, { useState, useEffect } from "react";
import ButtonOne from "./ButtonOne";

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      if (currentScrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navLinks = ["Home", "Explore", "Roadmap", "Progress", "Resources"];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out px-6 md:px-10 py-4 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${
        isScrolled
          ? "bg-white/70 backdrop-blur-lg border-b border-white/20 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="shrink-0 cursor-pointer">
          <img
            className="w-24 md:w-28 object-contain"
            src="/images/logo.webp"
            alt="TRAIL Logo"
          />
        </div>

        <div className="hidden md:flex items-center gap-10 text-gray-600 font-medium">
          {navLinks.map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm tracking-wide flex items-center gap-2 font-medium"
            >
              {item === "Roadmap" && (
                <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span>
              )}
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <ButtonOne text="Get Started" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;