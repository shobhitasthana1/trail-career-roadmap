import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import { FiCheck } from "react-icons/fi";

const POPULAR_GOALS = [
  "Frontend Developer",
  "Full Stack Developer",
  "Backend Developer",
  "AI / ML Engineer",
  "UI / UX Designer",
  "Data Analyst",
];

const Profile = () => {
  const { user, isAuthenticated, loading: authLoading, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    name: "",
    bio: "",
    phone: "",
    location: "",
    careerGoal: "",
    skills: "",
  });
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Sync form state whenever user object loads or updates
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        bio: user.bio || "",
        phone: user.phone || "",
        location: user.location || "",
        careerGoal: user.careerGoal || "",
        skills: Array.isArray(user.skills)
          ? user.skills.join(", ")
          : user.skills || "",
      });
      setAvatarPreview(user.avatar || null);
    }
  }, [user]);

  const initials = (form.name || user?.name || "U")
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const set = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    setErrorMsg("");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg("Image size must be under 2MB.");
      return;
    }

    setErrorMsg("");
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarPreview(ev.target.result);
      if (!editing) setEditing(true);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    if (fileRef.current) fileRef.current.value = "";
    if (!editing) setEditing(true);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg("");

    if (!form.name.trim()) {
      setErrorMsg("Full name cannot be empty.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        name: form.name.trim(),
        bio: form.bio.trim(),
        phone: form.phone.trim(),
        location: form.location.trim(),
        careerGoal: form.careerGoal.trim(),
        skills: form.skills.trim(),
        avatar: avatarPreview,
      };

      if (typeof updateProfile === "function") {
        await updateProfile(payload);
      }

      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setErrorMsg(err?.message || "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      name: user?.name || "",
      bio: user?.bio || "",
      phone: user?.phone || "",
      location: user?.location || "",
      careerGoal: user?.careerGoal || "",
      skills: Array.isArray(user?.skills)
        ? user.skills.join(", ")
        : user?.skills || "",
    });
    setAvatarPreview(user?.avatar || null);
    setErrorMsg("");
    setEditing(false);
  };

  // Profile completion calculation
  const completionFields = [
    form.name,
    form.bio,
    form.phone,
    form.location,
    form.careerGoal,
    form.skills,
  ];
  const filledCount = completionFields.filter(
    (val) => val && String(val).trim().length > 0
  ).length;
  const completionPct = Math.round((filledCount / completionFields.length) * 100);

  const skillList = form.skills
    ? form.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-2 border-[#6D3DF5] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#64748B] font-exo">
            Loading Profile...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !user) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center bg-[#FAFAFA] px-4 py-24 font-inter">
        <div className="max-w-md w-full rounded-[28px] border border-stone-200/90 bg-white p-8 text-center shadow-[0_24px_60px_-15px_rgba(17,24,39,0.07)]">
          <h2 className="font-geist text-2xl font-bold text-[#111827]">
            Sign in required
          </h2>
          <p className="mt-2 text-sm text-[#64748B] mb-6">
            Please sign in to view and customize your Trail profile.
          </p>
          <Link
            to="/login"
            state={{ from: "/profile" }}
            className="inline-block w-full rounded-xl bg-gradient-to-r from-[#6D3DF5] to-[#9577F4] px-6 py-3 text-sm font-semibold text-white shadow-md"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-[#FAFAFA] px-4 sm:px-6 md:px-12 lg:px-20 pt-28 sm:pt-32 pb-20 overflow-hidden font-inter selection:bg-[#7C3AED]/15 selection:text-[#6D3DF5]">
      {/* Soft Ambient Background Glows (Matches Home & Progress) */}
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

      <div className="relative z-10 max-w-[960px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Top Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="font-geist text-[clamp(2.1rem,4vw,3.2rem)] font-bold tracking-[-0.045em] leading-[0.98] text-[#111827]">
                Account{" "}
                <span className="bg-gradient-to-r from-[#6D3DF5] to-[#A855F7] bg-clip-text text-transparent font-iowan italic font-normal pr-1">
                  settings.
                </span>
              </h1>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                to="/progress"
                className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#111827] shadow-sm transition-all duration-300 hover:border-[#6D3DF5]/30 hover:text-[#6D3DF5]"
              >
                <span>View Progress</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Floating Alerts (Success & Error) */}
          <AnimatePresence>
            {saved && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/90 px-5 py-3.5 text-sm font-semibold text-emerald-700 shadow-sm"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white text-xs">
                  <FiCheck className="w-3.5 h-3.5" />
                </span>
                <span>Your profile changes have been saved!</span>
              </motion.div>
            )}

            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50/90 px-5 py-3.5 text-sm font-medium text-red-600 shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <svg className="w-5 h-5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{errorMsg}</span>
                </div>
                <button
                  onClick={() => setErrorMsg("")}
                  className="text-xs font-bold uppercase tracking-wider text-red-500 hover:text-red-700 cursor-pointer"
                >
                  Dismiss
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Profile Shell */}
          <div className="relative overflow-hidden rounded-[28px] border border-stone-200/90 bg-white/95 backdrop-blur-2xl shadow-[0_24px_60px_-15px_rgba(17,24,39,0.06)]">
            {/* Decorative Top Banner */}
            <div className="relative h-28 sm:h-36 w-full bg-gradient-to-r from-[#6D3DF5]/10 via-[#9577F4]/15 to-[#A855F7]/10 border-b border-stone-200/60 overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#6D3DF5] via-[#9577F4] to-[#A855F7]" />
              <div
                className="absolute inset-0 opacity-25"
                style={{
                  backgroundImage:
                    "radial-gradient(#6D3DF5 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />

              {/* Profile Completeness Pill inside Banner */}
              <div className="absolute top-4 right-4 sm:top-5 sm:right-6 flex items-center gap-3 rounded-full border border-white/80 bg-white/85 backdrop-blur-md px-3.5 py-1.5 shadow-sm">
                <div className="w-16 sm:w-20 h-1.5 rounded-full bg-stone-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#6D3DF5] to-[#A855F7] transition-all duration-500"
                    style={{ width: `${completionPct}%` }}
                  />
                </div>
                <span className="text-[11px] font-bold text-[#111827] font-exo">
                  {completionPct}% Complete
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8 md:p-10 -mt-14 sm:-mt-16 relative z-10">
              {/* Avatar & Action Row */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 pb-8 mb-8 border-b border-stone-200/80">
                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
                  {/* Avatar Wrapper */}
                  <div className="relative group shrink-0">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt={form.name || "Avatar"}
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white shadow-[0_12px_30px_-6px_rgba(109,61,245,0.25)] bg-white"
                      />
                    ) : (
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-[#6D3DF5] via-[#7C3AED] to-[#A855F7] flex items-center justify-center border-4 border-white shadow-[0_12px_30px_-6px_rgba(109,61,245,0.3)]">
                        <span className="font-geist text-2xl sm:text-3xl font-bold text-white tracking-tight">
                          {initials}
                        </span>
                      </div>
                    )}

                    {/* Camera Upload Button (Always works, auto-enables edit mode) */}
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      title="Upload profile photo"
                      className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-white text-[#111827] shadow-md transition-all duration-200 hover:border-[#6D3DF5] hover:text-[#6D3DF5] hover:scale-105 cursor-pointer"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
                        />
                      </svg>
                    </button>

                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </div>

                  {/* User Identity Info */}
                  <div className="pt-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h2 className="font-geist text-xl sm:text-2xl font-bold text-[#111827]">
                        {form.name || user?.name || "Learner"}
                      </h2>
                      {form.careerGoal && (
                        <span className="rounded-full border border-[#6D3DF5]/20 bg-[#6D3DF5]/[0.07] px-3 py-0.5 text-xs font-semibold text-[#6D3DF5]">
                          {form.careerGoal}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#64748B] font-inter mt-0.5">
                      {user?.email}
                    </p>
                    {editing && avatarPreview && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="mt-2 text-xs font-semibold text-red-500 hover:text-red-600 underline-offset-2 hover:underline cursor-pointer"
                      >
                        Remove photo
                      </button>
                    )}
                  </div>
                </div>

                {/* Edit / Save / Cancel Buttons */}
                <div className="flex items-center justify-center sm:justify-end gap-2.5 shrink-0">
                  {!editing ? (
                    <button
                      type="button"
                      onClick={() => setEditing(true)}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#111827] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#6D3DF5] hover:shadow-[0_10px_25px_-5px_rgba(109,61,245,0.4)] active:scale-[0.98] cursor-pointer font-geist"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                      <span>Edit Profile</span>
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={saving}
                        className="rounded-xl border border-stone-200 bg-[#F8FAFC] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#475569] transition-all duration-200 hover:bg-stone-100 hover:text-[#111827] active:scale-[0.98] cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6D3DF5] via-[#7C3AED] to-[#9577F4] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-[0_8px_20px_-4px_rgba(109,61,245,0.45)] transition-all duration-300 hover:shadow-[0_12px_25px_-4px_rgba(109,61,245,0.6)] active:scale-[0.98] disabled:opacity-60 cursor-pointer font-geist"
                      >
                        {saving ? (
                          <>
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <span>Save Changes</span>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Profile Form / View Grid */}
              <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[0.18em] text-[#475569] mb-2 font-exo">
                    Full Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={form.name}
                      onChange={set("name")}
                      placeholder="Your full name"
                      className="w-full rounded-xl border border-stone-200/90 bg-[#F8FAFC] px-4 py-3 text-sm text-[#111827] placeholder-[#94A3B8] outline-none transition-all duration-200 focus:bg-white focus:border-[#6D3DF5] focus:ring-4 focus:ring-[#6D3DF5]/10"
                    />
                  ) : (
                    <div className="rounded-xl border border-stone-200/60 bg-[#FAFAFA] px-4 py-3 text-sm font-medium text-[#111827]">
                      {form.name || <span className="text-[#94A3B8] italic">Not set</span>}
                    </div>
                  )}
                </div>

                {/* Email (Read-only badge) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-[11px] font-bold uppercase tracking-[0.18em] text-[#475569] font-exo">
                      Email Address
                    </label>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  </div>
                  <div className="rounded-xl border border-stone-200/60 bg-stone-100/70 px-4 py-3 text-sm font-medium text-[#64748B] select-all">
                    {user?.email || "Not available"}
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[0.18em] text-[#475569] mb-2 font-exo">
                    Phone Number
                  </label>
                  {editing ? (
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={set("phone")}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-stone-200/90 bg-[#F8FAFC] px-4 py-3 text-sm text-[#111827] placeholder-[#94A3B8] outline-none transition-all duration-200 focus:bg-white focus:border-[#6D3DF5] focus:ring-4 focus:ring-[#6D3DF5]/10"
                    />
                  ) : (
                    <div className="rounded-xl border border-stone-200/60 bg-[#FAFAFA] px-4 py-3 text-sm font-medium text-[#111827]">
                      {form.phone || <span className="text-[#94A3B8] italic">Not set</span>}
                    </div>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[0.18em] text-[#475569] mb-2 font-exo">
                    Location
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={form.location}
                      onChange={set("location")}
                      placeholder="City, Country"
                      className="w-full rounded-xl border border-stone-200/90 bg-[#F8FAFC] px-4 py-3 text-sm text-[#111827] placeholder-[#94A3B8] outline-none transition-all duration-200 focus:bg-white focus:border-[#6D3DF5] focus:ring-4 focus:ring-[#6D3DF5]/10"
                    />
                  ) : (
                    <div className="rounded-xl border border-stone-200/60 bg-[#FAFAFA] px-4 py-3 text-sm font-medium text-[#111827]">
                      {form.location || <span className="text-[#94A3B8] italic">Not set</span>}
                    </div>
                  )}
                </div>

                {/* Career Goal (Full Width) */}
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-[0.18em] text-[#475569] mb-2 font-exo">
                    Target Career Goal
                  </label>
                  {editing ? (
                    <div>
                      <input
                        type="text"
                        value={form.careerGoal}
                        onChange={set("careerGoal")}
                        placeholder="e.g. Full Stack Developer"
                        className="w-full rounded-xl border border-stone-200/90 bg-[#F8FAFC] px-4 py-3 text-sm text-[#111827] placeholder-[#94A3B8] outline-none transition-all duration-200 focus:bg-white focus:border-[#6D3DF5] focus:ring-4 focus:ring-[#6D3DF5]/10"
                      />
                      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-medium text-[#64748B] mr-1">
                          Quick select:
                        </span>
                        {POPULAR_GOALS.map((goal) => {
                          const active = form.careerGoal === goal;
                          return (
                            <button
                              key={goal}
                              type="button"
                              onClick={() =>
                                setForm((p) => ({ ...p, careerGoal: goal }))
                              }
                              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                                active
                                  ? "bg-[#6D3DF5] text-white shadow-sm"
                                  : "border border-stone-200 bg-white text-[#475569] hover:border-[#6D3DF5]/40 hover:text-[#6D3DF5]"
                              }`}
                            >
                              {goal}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-stone-200/60 bg-[#FAFAFA] px-4 py-3 text-sm font-medium text-[#111827]">
                      {form.careerGoal || (
                        <span className="text-[#94A3B8] italic">Not set</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Bio (Full Width) */}
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-[0.18em] text-[#475569] mb-2 font-exo">
                    Bio & About
                  </label>
                  {editing ? (
                    <textarea
                      value={form.bio}
                      onChange={set("bio")}
                      placeholder="Share a short bio, your current studies, or what you're building..."
                      rows={3}
                      className="w-full rounded-xl border border-stone-200/90 bg-[#F8FAFC] px-4 py-3 text-sm text-[#111827] placeholder-[#94A3B8] outline-none transition-all duration-200 focus:bg-white focus:border-[#6D3DF5] focus:ring-4 focus:ring-[#6D3DF5]/10 resize-none"
                    />
                  ) : (
                    <div className="rounded-xl border border-stone-200/60 bg-[#FAFAFA] px-4 py-3.5 text-sm leading-relaxed text-[#334155] min-h-[72px]">
                      {form.bio || (
                        <span className="text-[#94A3B8] italic">
                          No bio added yet. Click &ldquo;Edit Profile&rdquo; to introduce yourself!
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Skills & Interests (Full Width with Tag Pills) */}
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-[11px] font-bold uppercase tracking-[0.18em] text-[#475569] font-exo">
                      Skills & Interests
                    </label>
                    {editing && (
                      <span className="text-[11px] text-[#64748B]">
                        Separate skills with commas
                      </span>
                    )}
                  </div>
                  {editing ? (
                    <textarea
                      value={form.skills}
                      onChange={set("skills")}
                      placeholder="React, JavaScript, Node.js, Three.js, GSAP, UI Design..."
                      rows={2}
                      className="w-full rounded-xl border border-stone-200/90 bg-[#F8FAFC] px-4 py-3 text-sm text-[#111827] placeholder-[#94A3B8] outline-none transition-all duration-200 focus:bg-white focus:border-[#6D3DF5] focus:ring-4 focus:ring-[#6D3DF5]/10 resize-none"
                    />
                  ) : (
                    <div className="rounded-xl border border-stone-200/60 bg-[#FAFAFA] p-4 min-h-[60px] flex items-center">
                      {skillList.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {skillList.map((skill, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center rounded-lg border border-[#6D3DF5]/20 bg-white px-3 py-1.5 text-xs font-semibold text-[#111827] shadow-[0_2px_8px_rgba(109,61,245,0.06)]"
                            >
                              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-[#6D3DF5]" />
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-[#94A3B8] italic">
                          No skills listed yet
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </form>

              {/* Footer Sign Out Strip */}
              <div className="mt-10 pt-6 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-[#64748B]">
                  Need to switch accounts or end your current session?
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof logout === "function") logout();
                    navigate("/");
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/60 px-4 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100/80 cursor-pointer"
                >
                  <span>Log Out of Trail</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;