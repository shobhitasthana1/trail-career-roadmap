import React, { useEffect, useRef } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Roadmap from "./pages/Roadmap";
import Progress from "./pages/Progress";
import Resources from "./pages/Resources";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

gsap.registerPlugin(ScrollTrigger);

const AppContent = () => {
  const scrollRef = useRef(null);
  const location = useLocation();
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.2,
    });
    lenisRef.current = lenis;
    window.__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const rafCallback = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    const finalRefresh = () => ScrollTrigger.refresh();

    if (document.readyState === "complete") {
      setTimeout(finalRefresh, 500);
    } else {
      window.addEventListener("load", finalRefresh);
    }

    return () => {
      window.removeEventListener("load", finalRefresh);
      gsap.ticker.remove(rafCallback);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  return (
    <div
      ref={scrollRef}
      className="w-full min-h-screen overflow-x-hidden bg-[#FAFAFA]"
    >
      <ScrollToTop lenisRef={lenisRef} />

      <Navbar />

      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/explore/:slug" element={<Explore />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/roadmap/:slug" element={<Navigate to="/explore/:slug" replace />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/resources" element={<Resources />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;