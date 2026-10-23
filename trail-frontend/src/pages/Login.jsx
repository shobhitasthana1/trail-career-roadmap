import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = ({ initialMode }) => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  // Check if opened via /signup or /login
  const [isRegisterMode, setIsRegisterMode] = useState(
    initialMode === "register" || location.pathname === "/signup"
  );

  useEffect(() => {
    setIsRegisterMode(
      initialMode === "register" || location.pathname === "/signup"
    );
  }, [location.pathname, initialMode]);

  // Smoothly toggle mode and sync URL without remounting component
  const handleToggleMode = (toRegister) => {
    setIsRegisterMode(toRegister);
    setApiError("");
    setLoginErrors({});
    setSignupErrors({});
    const targetPath = toRegister ? "/signup" : "/login";
    if (window.location.pathname !== targetPath) {
      window.history.replaceState(null, "", targetPath);
    }
  };

  /* ── Login State & Logic ── */
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginErrors, setLoginErrors] = useState({});
  const [showLoginPass, setShowLoginPass] = useState(false);

  /* ── Signup State & Logic ── */
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [signupErrors, setSignupErrors] = useState({});
  const [showSignupPass, setShowSignupPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  /* ── Shared API State ── */
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const setLoginField = (field) => (e) => {
    setLoginForm((p) => ({ ...p, [field]: e.target.value }));
    setLoginErrors((p) => ({ ...p, [field]: undefined }));
    setApiError("");
  };

  const setSignupField = (field) => (e) => {
    setSignupForm((p) => ({ ...p, [field]: e.target.value }));
    setSignupErrors((p) => ({ ...p, [field]: undefined }));
    setApiError("");
  };

  const validateLogin = () => {
    const e = {};
    if (!loginForm.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.email))
      e.email = "Enter a valid email";
    if (!loginForm.password) e.password = "Password is required";
    return e;
  };

  const validateSignup = () => {
    const e = {};
    if (!signupForm.name.trim()) e.name = "Full name is required";
    if (!signupForm.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupForm.email))
      e.email = "Enter a valid email";
    if (!signupForm.password) e.password = "Password is required";
    else if (signupForm.password.length < 8)
      e.password = "Min. 8 characters required";
    if (!signupForm.confirmPassword)
      e.confirmPassword = "Confirm your password";
    else if (signupForm.password !== signupForm.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    return e;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    const v = validateLogin();
    setLoginErrors(v);
    if (Object.keys(v).length) return;

    setLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
      navigate(from, { replace: true });
    } catch (err) {
      setApiError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    const v = validateSignup();
    setSignupErrors(v);
    if (Object.keys(v).length) return;

    setLoading(true);
    try {
      await signup({
        name: signupForm.name,
        email: signupForm.email,
        password: signupForm.password,
      });
      navigate("/", { replace: true });
    } catch (err) {
      setApiError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // Password strength helper
  const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/\d/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };
  const passwordStrength = getPasswordStrength(signupForm.password);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#F4F3FF] via-[#FAFAFA] to-[#EAE6FF] px-4 pt-24 pb-12 overflow-hidden font-inter selection:bg-[#7C3AED]/15 selection:text-[#6D3DF5]">
      {/* Scoped Styles for the Curved Sliding Animation */}
      <style>{`
        .trail-auth-wrapper {
          position: relative;
          width: 930px;
          max-width: 94vw;
          height: 550px;
          background: #ffffff;
          border-radius: 32px;
          box-shadow: 0 25px 70px -15px rgba(109, 61, 245, 0.16), 0 0 0 1px rgba(109, 61, 245, 0.08);
          overflow: hidden;
        }

        .trail-form-panel {
          position: absolute;
          right: 0;
          width: 50%;
          height: 100%;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 28px 40px;
          z-index: 1;
          transition: right 0.65s ease-in-out 1.1s, visibility 0s 0.95s, opacity 0.35s ease 0.95s;
        }

        .trail-auth-wrapper.is-active .trail-form-panel {
          right: 50%;
        }

        .trail-form-panel.is-register {
          visibility: hidden;
          opacity: 0;
          pointer-events: none;
        }

        .trail-auth-wrapper.is-active .trail-form-panel.is-register {
          visibility: visible;
          opacity: 1;
          pointer-events: auto;
        }

        .trail-auth-wrapper.is-active .trail-form-panel.is-login {
          visibility: hidden;
          opacity: 0;
          pointer-events: none;
        }

        .trail-curve-box {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .trail-curve-box::before {
          content: "";
          position: absolute;
          left: -250%;
          width: 300%;
          height: 100%;
          background: linear-gradient(135deg, #5A2EDD 0%, #6D3DF5 45%, #8B5CF6 80%, #A855F7 100%);
          border-radius: 150px;
          z-index: 2;
          box-shadow: 0 0 50px rgba(109, 61, 245, 0.35);
          transition: 1.7s cubic-bezier(0.68, -0.05, 0.265, 1.05);
        }

        .trail-auth-wrapper.is-active .trail-curve-box::before {
          left: 50%;
        }

        .trail-side-panel {
          position: absolute;
          width: 50%;
          height: 100%;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 0 38px;
          z-index: 3;
          pointer-events: auto;
          transition: 0.65s ease-in-out;
        }

        .trail-side-panel.side-left {
          left: 0;
          transition-delay: 1.1s;
        }

        .trail-auth-wrapper.is-active .trail-side-panel.side-left {
          left: -50%;
          transition-delay: 0.55s;
        }

        .trail-side-panel.side-right {
          right: -50%;
          transition-delay: 0.55s;
        }

        .trail-auth-wrapper.is-active .trail-side-panel.side-right {
          right: 0;
          transition-delay: 1.1s;
        }

        @media screen and (max-width: 768px) {
          .trail-auth-wrapper {
            height: 740px;
            border-radius: 26px;
          }

          .trail-form-panel {
            bottom: 0;
            width: 100%;
            height: 72%;
            padding: 20px 22px;
            transition: bottom 0.65s ease-in-out 1.05s, visibility 0s 0.9s, opacity 0.35s ease 0.9s;
          }

          .trail-auth-wrapper.is-active .trail-form-panel {
            right: 0;
            bottom: 28%;
          }

          .trail-curve-box::before {
            left: 0;
            top: -272%;
            width: 100%;
            height: 300%;
            border-radius: 22vw;
          }

          .trail-auth-wrapper.is-active .trail-curve-box::before {
            left: 0;
            top: 72%;
          }

          .trail-side-panel {
            width: 100%;
            height: 28%;
            padding: 0 24px;
          }

          .trail-side-panel.side-left {
            top: 0;
            left: 0;
          }

          .trail-auth-wrapper.is-active .trail-side-panel.side-left {
            left: 0;
            top: -28%;
          }

          .trail-side-panel.side-right {
            right: 0;
            bottom: -28%;
          }

          .trail-auth-wrapper.is-active .trail-side-panel.side-right {
            bottom: 0;
          }
        }
      `}</style>

      {/* Subtle Radial Dot Grid (Matches Home Page) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(#6D3DF5 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.14,
          maskImage:
            "radial-gradient(ellipse 65% 60% at 50% 50%, black 10%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 65% 60% at 50% 50%, black 10%, transparent 75%)",
        }}
      />

      {/* Main Sliding Container */}
      <div
        className={`trail-auth-wrapper relative z-10 ${
          isRegisterMode ? "is-active" : ""
        }`}
      >
        {/* ==================== 1. LOGIN FORM PANEL (RIGHT SIDE) ==================== */}
        <div className="trail-form-panel is-login">
          <form
            onSubmit={handleLoginSubmit}
            className="w-full max-w-[340px]"
            noValidate
          >
            <div className="mb-5 text-center">
              <h1 className="font-geist text-3xl sm:text-[34px] font-bold text-[#111827] tracking-[-0.04em]">
                Login
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-[#64748B]">
                Sign in to continue your career roadmap
              </p>
            </div>

            {apiError && !isRegisterMode && (
              <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-600 text-left">
                {apiError}
              </div>
            )}

            {/* Email Input */}
            <div className="mb-3.5 text-left">
              <div className="relative">
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={setLoginField("email")}
                  placeholder="Email Address"
                  className={`w-full rounded-xl bg-[#F3F4F8] pl-4 pr-11 py-3 text-sm font-medium text-[#111827] placeholder-[#8E96A8] border outline-none transition-all duration-300 focus:bg-white ${
                    loginErrors.email
                      ? "border-red-400 focus:ring-4 focus:ring-red-500/10"
                      : "border-transparent focus:border-[#6D3DF5] focus:ring-4 focus:ring-[#6D3DF5]/10"
                  }`}
                />
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-[#64748B]">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </span>
              </div>
              {loginErrors.email && (
                <p className="mt-1 text-[11px] font-medium text-red-500">
                  {loginErrors.email}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="mb-3 text-left">
              <div className="relative">
                <input
                  type={showLoginPass ? "text" : "password"}
                  value={loginForm.password}
                  onChange={setLoginField("password")}
                  placeholder="Password"
                  className={`w-full rounded-xl bg-[#F3F4F8] pl-4 pr-11 py-3 text-sm font-medium text-[#111827] placeholder-[#8E96A8] border outline-none transition-all duration-300 focus:bg-white ${
                    loginErrors.password
                      ? "border-red-400 focus:ring-4 focus:ring-red-500/10"
                      : "border-transparent focus:border-[#6D3DF5] focus:ring-4 focus:ring-[#6D3DF5]/10"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPass((p) => !p)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#64748B] hover:text-[#6D3DF5] transition-colors cursor-pointer"
                  aria-label="Toggle password"
                >
                  {showLoginPass ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                    </svg>
                  )}
                </button>
              </div>
              {loginErrors.password && (
                <p className="mt-1 text-[11px] font-medium text-red-500">
                  {loginErrors.password}
                </p>
              )}
            </div>

            <div className="mb-4 text-center">
              <Link
                to="/explore"
                className="text-xs font-medium text-[#64748B] hover:text-[#6D3DF5] transition-colors"
              >
                Explore roadmaps as guest?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-[#6D3DF5] via-[#7C3AED] to-[#9577F4] text-white font-geist text-sm font-semibold tracking-wide shadow-[0_10px_25px_-5px_rgba(109,61,245,0.45)] transition-all duration-300 hover:shadow-[0_14px_30px_-5px_rgba(109,61,245,0.6)] hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
            >
              {loading && !isRegisterMode ? "Signing in..." : "Login"}
            </button>

            <p className="mt-4 mb-2.5 text-xs text-[#94A3B8] text-center">
              or continue with social platforms
            </p>

            <div className="flex justify-center gap-3">
              {[
                {
                  label: "Google",
                  svg: (
                    <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81Z" />
                  ),
                },
                {
                  label: "GitHub",
                  svg: (
                    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" />
                  ),
                },
                {
                  label: "LinkedIn",
                  svg: (
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z" />
                  ),
                },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => navigate("/explore")}
                  title={item.label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-white text-[#334155] shadow-sm transition-all duration-200 hover:border-[#6D3DF5] hover:text-[#6D3DF5] hover:-translate-y-0.5 cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    {item.svg}
                  </svg>
                </button>
              ))}
            </div>
          </form>
        </div>

        {/* ==================== 2. REGISTRATION FORM PANEL (LEFT SIDE WHEN ACTIVE) ==================== */}
        <div className="trail-form-panel is-register">
          <form
            onSubmit={handleSignupSubmit}
            className="w-full max-w-[340px]"
            noValidate
          >
            <div className="mb-3 text-center">
              <h1 className="font-geist text-2xl sm:text-[30px] font-bold text-[#111827] tracking-[-0.04em]">
                Registration
              </h1>
              <p className="mt-1 text-xs text-[#64748B]">
                Build your personalized career roadmap
              </p>
            </div>

            {apiError && isRegisterMode && (
              <div className="mb-2.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 text-left">
                {apiError}
              </div>
            )}

            {/* Full Name */}
            <div className="mb-2.5 text-left">
              <div className="relative">
                <input
                  type="text"
                  value={signupForm.name}
                  onChange={setSignupField("name")}
                  placeholder="Full Name"
                  className={`w-full rounded-xl bg-[#F3F4F8] pl-4 pr-11 py-2.5 text-sm font-medium text-[#111827] placeholder-[#8E96A8] border outline-none transition-all duration-300 focus:bg-white ${
                    signupErrors.name
                      ? "border-red-400 focus:ring-4 focus:ring-red-500/10"
                      : "border-transparent focus:border-[#6D3DF5] focus:ring-4 focus:ring-[#6D3DF5]/10"
                  }`}
                />
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-[#64748B]">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </span>
              </div>
              {signupErrors.name && (
                <p className="mt-0.5 text-[11px] font-medium text-red-500">
                  {signupErrors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="mb-2.5 text-left">
              <div className="relative">
                <input
                  type="email"
                  value={signupForm.email}
                  onChange={setSignupField("email")}
                  placeholder="Email Address"
                  className={`w-full rounded-xl bg-[#F3F4F8] pl-4 pr-11 py-2.5 text-sm font-medium text-[#111827] placeholder-[#8E96A8] border outline-none transition-all duration-300 focus:bg-white ${
                    signupErrors.email
                      ? "border-red-400 focus:ring-4 focus:ring-red-500/10"
                      : "border-transparent focus:border-[#6D3DF5] focus:ring-4 focus:ring-[#6D3DF5]/10"
                  }`}
                />
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-[#64748B]">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </span>
              </div>
              {signupErrors.email && (
                <p className="mt-0.5 text-[11px] font-medium text-red-500">
                  {signupErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="mb-2.5 text-left">
              <div className="relative">
                <input
                  type={showSignupPass ? "text" : "password"}
                  value={signupForm.password}
                  onChange={setSignupField("password")}
                  placeholder="Password (Min. 8 chars)"
                  className={`w-full rounded-xl bg-[#F3F4F8] pl-4 pr-11 py-2.5 text-sm font-medium text-[#111827] placeholder-[#8E96A8] border outline-none transition-all duration-300 focus:bg-white ${
                    signupErrors.password
                      ? "border-red-400 focus:ring-4 focus:ring-red-500/10"
                      : "border-transparent focus:border-[#6D3DF5] focus:ring-4 focus:ring-[#6D3DF5]/10"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowSignupPass((p) => !p)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#64748B] hover:text-[#6D3DF5] cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                  </svg>
                </button>
              </div>
              {signupForm.password.length > 0 && (
                <div className="mt-1 flex items-center gap-1">
                  {[1, 2, 3].map((lvl) => (
                    <span
                      key={lvl}
                      className={`h-1 flex-1 rounded-full ${
                        passwordStrength >= lvl ? "bg-[#6D3DF5]" : "bg-stone-200"
                      }`}
                    />
                  ))}
                </div>
              )}
              {signupErrors.password && (
                <p className="mt-0.5 text-[11px] font-medium text-red-500">
                  {signupErrors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-3 text-left">
              <div className="relative">
                <input
                  type={showConfirmPass ? "text" : "password"}
                  value={signupForm.confirmPassword}
                  onChange={setSignupField("confirmPassword")}
                  placeholder="Confirm Password"
                  className={`w-full rounded-xl bg-[#F3F4F8] pl-4 pr-11 py-2.5 text-sm font-medium text-[#111827] placeholder-[#8E96A8] border outline-none transition-all duration-300 focus:bg-white ${
                    signupErrors.confirmPassword
                      ? "border-red-400 focus:ring-4 focus:ring-red-500/10"
                      : "border-transparent focus:border-[#6D3DF5] focus:ring-4 focus:ring-[#6D3DF5]/10"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass((p) => !p)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#64748B] hover:text-[#6D3DF5] cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                  </svg>
                </button>
              </div>
              {signupErrors.confirmPassword && (
                <p className="mt-0.5 text-[11px] font-medium text-red-500">
                  {signupErrors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-[#6D3DF5] via-[#7C3AED] to-[#9577F4] text-white font-geist text-sm font-semibold tracking-wide shadow-[0_10px_25px_-5px_rgba(109,61,245,0.45)] transition-all duration-300 hover:shadow-[0_14px_30px_-5px_rgba(109,61,245,0.6)] hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
            >
              {loading && isRegisterMode ? "Creating Account..." : "Register"}
            </button>
          </form>
        </div>

        {/* ==================== 3. SLIDING CURVED TOGGLE OVERLAY ==================== */}
        <div className="trail-curve-box">
          {/* Left Panel (Shown during Login) */}
          <div className="trail-side-panel side-left">
            <h2 className="font-geist text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Hello,{" "}
              <span className="font-iowan italic font-normal text-[#E9D5FF]">
                Welcome!
              </span>
            </h2>
            <p className="mt-2.5 mb-6 text-xs sm:text-sm text-white/85 max-w-[260px] leading-relaxed">
              Don&apos;t have an account yet? Start building your personalized career roadmap today.
            </p>
            <button
              type="button"
              onClick={() => handleToggleMode(true)}
              className="w-40 h-11 rounded-xl border-2 border-white bg-transparent text-white font-geist text-sm font-semibold tracking-wide transition-all duration-300 hover:bg-white hover:text-[#6D3DF5] hover:shadow-lg active:scale-95 cursor-pointer"
            >
              Register
            </button>
          </div>

          {/* Right Panel (Shown during Registration) */}
          <div className="trail-side-panel side-right">
            <h2 className="font-geist text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Welcome{" "}
              <span className="font-iowan italic font-normal text-[#E9D5FF]">
                Back!
              </span>
            </h2>
            <p className="mt-2.5 mb-6 text-xs sm:text-sm text-white/85 max-w-[260px] leading-relaxed">
              Already have an account? Sign in to check your progress and daily learning streak.
            </p>
            <button
              type="button"
              onClick={() => handleToggleMode(false)}
              className="w-40 h-11 rounded-xl border-2 border-white bg-transparent text-white font-geist text-sm font-semibold tracking-wide transition-all duration-300 hover:bg-white hover:text-[#6D3DF5] hover:shadow-lg active:scale-95 cursor-pointer"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;