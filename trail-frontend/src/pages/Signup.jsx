import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "motion/react";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/progress";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8)
      e.password = "Password must be at least 8 characters";
    if (!form.confirmPassword) e.confirmPassword = "Confirm your password";
    else if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setLoading(true);
    try {
      await signup({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      navigate("/", { replace: true });
    } catch (err) {
      setApiError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    setErrors((p) => ({ ...p, [field]: undefined }));
    setApiError("");
  };

  // Password strength helper for visual feedback
  const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/\d/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const passwordStrength = getPasswordStrength(form.password);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#FAFAFA] px-4 pt-28 sm:pt-32 pb-16 overflow-hidden font-inter selection:bg-[#7C3AED]/15 selection:text-[#6D3DF5]">
      {/* Soft Ambient Background Glows (Matches Section2 & FAQ) */}
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_15%_20%,rgba(109,61,245,0.08)_0%,transparent_45%),radial-gradient(circle_at_85%_80%,rgba(168,85,247,0.08)_0%,transparent_45%)]" />
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[550px] h-[320px] bg-gradient-to-tr from-[#6D3DF5]/10 via-[#9577F4]/10 to-transparent blur-[90px] rounded-full" />

      {/* Subtle Radial Dot Grid (Matches Section2) */}
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

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[480px]"
      >
        {/* Main Card */}
        <div className="relative overflow-hidden rounded-[28px] border border-stone-200/90 bg-white/90 backdrop-blur-2xl p-7 sm:p-10 shadow-[0_24px_60px_-15px_rgba(17,24,39,0.07),0_0_0_1px_rgba(255,255,255,0.8)_inset]">
          {/* Top Decorative Gradient Accent Bar */}
          <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#6D3DF5] via-[#9577F4] to-[#A855F7]" />

          {/* Corner Soft Glow inside Card */}
          <div className="pointer-events-none absolute -right-12 -top-12 w-36 h-36 rounded-full bg-[#7C3AED]/[0.06] blur-2xl" />

          {/* Header */}
          <div className="mb-7 text-center flex flex-col items-center">
            <Link to="/" className="inline-block mb-3.5 group">
              <img
                src="/images/traiilhd.webp"
                alt="TRAIL"
                className="w-24 sm:w-28 mx-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-[#6D3DF5]/15 bg-[#6D3DF5]/[0.06] px-3 py-1 font-exo text-[10px] font-bold uppercase tracking-[0.22em] text-[#6D3DF5]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#6D3DF5]" />
              Start Here
            </span>

            <h1 className="font-geist text-[26px] sm:text-[32px] font-bold text-[#111827] tracking-[-0.04em] leading-[1.08] mt-1">
              Build your{" "}
              <span className="font-iowan italic font-normal bg-gradient-to-r from-[#6D3DF5] to-[#A855F7] bg-clip-text text-transparent pr-1">
                roadmap.
              </span>
            </h1>
            <p className="mt-1.5 text-sm text-[#64748B] font-inter">
              Create your account and start tracking skills that matter
            </p>
          </div>

          {/* API Error Banner */}
          <AnimatePresence>
            {apiError && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                className="mb-5 flex items-center gap-2.5 rounded-2xl border border-red-200 bg-red-50/90 px-4 py-3 text-xs sm:text-sm font-medium text-red-600 font-inter"
              >
                <svg className="w-4 h-4 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{apiError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.18em] text-[#475569] mb-1.5 font-exo">
                Full Name
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-stone-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={form.name}
                  onChange={set("name")}
                  placeholder="John Doe"
                  className={`w-full rounded-xl border bg-[#F8FAFC] pl-11 pr-4 py-3 text-sm text-[#111827] placeholder-[#94A3B8] font-inter outline-none transition-all duration-300 focus:bg-white ${
                    errors.name
                      ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                      : "border-stone-200/90 hover:border-stone-300 focus:border-[#6D3DF5] focus:ring-4 focus:ring-[#6D3DF5]/10"
                  }`}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs font-medium text-red-500 font-inter">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.18em] text-[#475569] mb-1.5 font-exo">
                Email Address
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-stone-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="you@example.com"
                  className={`w-full rounded-xl border bg-[#F8FAFC] pl-11 pr-4 py-3 text-sm text-[#111827] placeholder-[#94A3B8] font-inter outline-none transition-all duration-300 focus:bg-white ${
                    errors.email
                      ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                      : "border-stone-200/90 hover:border-stone-300 focus:border-[#6D3DF5] focus:ring-4 focus:ring-[#6D3DF5]/10"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs font-medium text-red-500 font-inter">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.18em] text-[#475569] mb-1.5 font-exo">
                Password
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-stone-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={set("password")}
                  placeholder="Min. 8 characters"
                  className={`w-full rounded-xl border bg-[#F8FAFC] pl-11 pr-11 py-3 text-sm text-[#111827] placeholder-[#94A3B8] font-inter outline-none transition-all duration-300 focus:bg-white ${
                    errors.password
                      ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                      : "border-stone-200/90 hover:border-stone-300 focus:border-[#6D3DF5] focus:ring-4 focus:ring-[#6D3DF5]/10"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-stone-400 hover:text-[#6D3DF5] transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Subtle Password Strength Bar */}
              {form.password.length > 0 && (
                <div className="mt-2 flex items-center gap-1.5">
                  {[1, 2, 3].map((level) => (
                    <span
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                        passwordStrength >= level
                          ? passwordStrength === 1
                            ? "bg-amber-400"
                            : passwordStrength === 2
                            ? "bg-[#9577F4]"
                            : "bg-[#6D3DF5]"
                          : "bg-stone-200"
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
                    {passwordStrength === 1
                      ? "Weak"
                      : passwordStrength === 2
                      ? "Good"
                      : "Strong"}
                  </span>
                </div>
              )}

              {errors.password && (
                <p className="mt-1 text-xs font-medium text-red-500 font-inter">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.18em] text-[#475569] mb-1.5 font-exo">
                Confirm Password
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-stone-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={set("confirmPassword")}
                  placeholder="Re-enter password"
                  className={`w-full rounded-xl border bg-[#F8FAFC] pl-11 pr-11 py-3 text-sm text-[#111827] placeholder-[#94A3B8] font-inter outline-none transition-all duration-300 focus:bg-white ${
                    errors.confirmPassword
                      ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                      : "border-stone-200/90 hover:border-stone-300 focus:border-[#6D3DF5] focus:ring-4 focus:ring-[#6D3DF5]/10"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-stone-400 hover:text-[#6D3DF5] transition-colors cursor-pointer"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs font-medium text-red-500 font-inter">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative mt-2 w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#6D3DF5] via-[#7C3AED] to-[#9577F4] px-6 py-3.5 text-sm font-semibold text-white tracking-wide shadow-[0_10px_25px_-5px_rgba(109,61,245,0.4)] transition-all duration-300 hover:shadow-[0_16px_32px_-6px_rgba(109,61,245,0.55)] hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer font-geist"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#7C3AED] via-[#6D3DF5] to-[#A855F7] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>
          </form>

          {/* Divider + Toggle Link */}
          <div className="mt-6 pt-5 border-t border-stone-200/80 text-center">
            <p className="text-sm text-[#64748B] font-inter">
              Already have an account?{" "}
              <Link
                to="/login"
                state={{ from }}
                className="font-semibold text-[#6D3DF5] hover:text-[#7C3AED] underline-offset-4 hover:underline transition-colors duration-200"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;