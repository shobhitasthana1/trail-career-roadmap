import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ButtonOne from "./buttons/ButtonOne";
import { useAuth } from "../context/AuthContext";
import { FiTrendingUp, FiUser, FiLogOut } from "react-icons/fi";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Explore", path: "/explore" },
  { name: "Roadmap", path: "/roadmap" },
  { name: "Progress", path: "/progress" },
  { name: "Resources", path: "/resources" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

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

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu & dropdown on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const isLinkActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/progress");
    } else {
      navigate("/signup");
    }
  };

  const initials = (user?.name || "U")
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

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
          <Link
            to="/"
            className="shrink-0 cursor-pointer flex items-center gap-2 z-50 group"
          >
            <img
              className="w-24 sm:w-28 lg:w-36 xl:w-40 object-contain transition-transform duration-500 group-hover:scale-105"
              src="/images/traiilhd.webp"
              alt="TRAIL Logo"
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-12">
            {navItems.map((item) => {
              const active = isLinkActive(item.path);

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className="group relative flex items-center gap-2 px-1 py-2 font-medium text-[15px] xl:text-[16px] overflow-hidden"
                >
                  {/* Glowing active indicator dot */}
                  {active && (
                    <span className="relative flex h-2 w-2 items-center justify-center">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#7C3AED] opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#7C3AED] shadow-[0_0_10px_#7C3AED]"></span>
                    </span>
                  )}

                  {/* 3D Rolling Text Effect */}
                  <span className="relative block h-[24px] overflow-hidden leading-[24px]">
                    <span className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-[24px]">
                      <span
                        className={`h-[24px] flex items-center transition-colors duration-300 ${
                          active
                            ? "text-[#7C3AED] font-semibold"
                            : "text-stone-600"
                        }`}
                      >
                        {item.name}
                      </span>
                      <span className="h-[24px] flex items-center text-[#7C3AED]">
                        {item.name}
                      </span>
                    </span>
                  </span>

                  {/* Sweeping Underline indicator */}
                  <span
                    className={`absolute bottom-1 left-0 h-[2px] w-full rounded-full bg-[#7C3AED] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                      active
                        ? "scale-x-100"
                        : "origin-right scale-x-0 group-hover:origin-left group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA Button / User Profile Dropdown */}
          <div className="hidden lg:flex items-center gap-6 xl:scale-110 origin-right transition-transform">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2.5 rounded-full bg-white/80 hover:bg-white border border-stone-200/90 px-3.5 py-1.5 transition-all duration-300 cursor-pointer shadow-sm hover:shadow"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover border border-[#7C3AED]/40"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#9D4EDD] flex items-center justify-center text-[11px] font-bold text-white shadow-sm">
                      {initials}
                    </div>
                  )}
                  <span className="text-sm font-semibold text-stone-800 max-w-[110px] truncate font-inter">
                    {user?.name || "Account"}
                  </span>
                  <svg
                    className={`w-3.5 h-3.5 text-stone-500 transition-transform duration-300 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu (Light Homepage Glass Style) */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white/95 backdrop-blur-2xl border border-stone-200/90 p-2 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.12)] z-50">
                    <div className="px-3 py-2.5 border-b border-stone-100 mb-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-exo">
                        Signed in as
                      </p>
                      <p className="text-sm font-bold text-stone-900 truncate font-geist">
                        {user?.name}
                      </p>
                      <p className="text-xs text-stone-500 truncate font-inter">
                        {user?.email}
                      </p>
                    </div>

                    <Link
                      to="/progress"
                      onClick={() => setDropdownOpen(false)}
                      className="group flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-stone-700 hover:text-[#6D3DF5] hover:bg-[#6D3DF5]/[0.06] rounded-xl transition-colors font-inter"
                    >
                      <FiTrendingUp className="w-[17px] h-[17px] text-stone-500 group-hover:text-[#6D3DF5] transition-colors shrink-0" />
                      <span>My Progress</span>
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="group flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-stone-700 hover:text-[#6D3DF5] hover:bg-[#6D3DF5]/[0.06] rounded-xl transition-colors font-inter"
                    >
                      <FiUser className="w-[17px] h-[17px] text-stone-500 group-hover:text-[#6D3DF5] transition-colors shrink-0" />
                      <span>My Profile</span>
                    </Link>

                    <div className="my-1.5 border-t border-stone-100" />

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                        navigate("/");
                      }}
                      className="group w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors text-left cursor-pointer font-inter"
                    >
                      <FiLogOut className="w-[17px] h-[17px] text-red-500 group-hover:text-red-600 transition-colors shrink-0" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="transition-transform duration-300 hover:scale-[1.05] active:scale-95">
                <ButtonOne text="Get Started" onClick={handleGetStarted} />
              </div>
            )}
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
            {navItems.map((item, index) => {
              const active = isLinkActive(item.path);

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="group flex items-center text-4xl sm:text-5xl font-semibold tracking-tight transition-all duration-500 ease-out font-satoshi"
                  style={{
                    transform: mobileMenuOpen
                      ? "translateY(0)"
                      : "translateY(40px)",
                    opacity: mobileMenuOpen ? 1 : 0,
                    transitionDelay: `${index * 75 + 100}ms`,
                  }}
                >
                  {active && (
                    <span className="w-3 h-3 sm:w-4 sm:h-4 mr-4 sm:mr-6 rounded-full bg-[#7C3AED] shadow-[0_0_20px_rgba(124,58,237,1)]" />
                  )}
                  <span
                    className={`transition-colors duration-300 ${
                      active
                        ? "text-transparent bg-gradient-to-r from-white to-[#7C3AED] bg-clip-text"
                        : "text-stone-300 group-hover:text-white"
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
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
            {isAuthenticated ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#7C3AED]"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#9D4EDD] flex items-center justify-center text-sm font-bold text-white">
                      {initials}
                    </div>
                  )}
                  <div>
                    <p className="text-white font-medium">{user?.name}</p>
                    <p className="text-xs text-white/50">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-white/15 bg-white/[0.04] text-white text-center text-sm font-medium"
                  >
                    My Profile
                  </Link>
                  <ButtonOne
                    text="My Progress"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/progress");
                    }}
                  />
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    navigate("/");
                  }}
                  className="text-left text-xs text-red-400 hover:text-red-300 pt-1 cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-stone-400 font-medium tracking-wide uppercase text-xs">
                    Start your journey
                  </span>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs text-[#C4B5FD] hover:underline"
                  >
                    Already have an account? Sign In
                  </Link>
                </div>
                <ButtonOne
                  text="Get Started"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleGetStarted();
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;