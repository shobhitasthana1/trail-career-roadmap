import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

/* ─── Mock Auth Service ─────────────────────────────────────────────
   Replace the functions below with real API calls when the backend
   auth endpoints are ready. The UI layer never touches these directly;
   everything goes through the AuthProvider actions.
   ─────────────────────────────────────────────────────────────────── */

const STORAGE_TOKEN_KEY = "trail_auth_token";
const STORAGE_USER_KEY = "trail_auth_user";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// Simulated user store (lives in memory for the session)
let mockUsers = JSON.parse(localStorage.getItem("trail_mock_users") || "[]");
const persistMockUsers = () =>
  localStorage.setItem("trail_mock_users", JSON.stringify(mockUsers));

const authService = {
  async login(email, password) {
    await delay(800);
    const user = mockUsers.find(
      (u) => u.email === email && u.password === password,
    );
    if (!user) throw new Error("Invalid email or password");
    const token = btoa(JSON.stringify({ id: user.id, ts: Date.now() }));
    const { password: _, ...safeUser } = user;
    return { token, user: safeUser };
  },

  async signup({ name, email, password }) {
    await delay(900);
    if (mockUsers.some((u) => u.email === email))
      throw new Error("An account with this email already exists");
    const user = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      avatar: null,
      bio: "",
      phone: "",
      location: "",
      careerGoal: "",
      skills: "",
      progress: {
        completedSteps: [],
        streak: 0,
        lastActive: null,
      },
    };
    mockUsers.push(user);
    persistMockUsers();
    const token = btoa(JSON.stringify({ id: user.id, ts: Date.now() }));
    const { password: _, ...safeUser } = user;
    return { token, user: safeUser };
  },

  async updateProfile(userId, updates) {
    await delay(600);
    const idx = mockUsers.findIndex((u) => u.id === userId);
    if (idx === -1) throw new Error("User not found");
    mockUsers[idx] = { ...mockUsers[idx], ...updates };
    persistMockUsers();
    const { password: _, ...safeUser } = mockUsers[idx];
    return safeUser;
  },

  async getProgress(userId) {
    await delay(500);
    const idx = mockUsers.findIndex((u) => u.id === userId);
    if (idx === -1) throw new Error("User not found");
    const user = mockUsers[idx];

    // Seed some demo progress if empty
    if (!user.progress || !user.progress.completedSteps || user.progress.completedSteps.length === 0) {
      const demoProgress = {
        completedSteps: [
          { id: "s1", name: "HTML & CSS Basics", completedAt: new Date(Date.now() - 86400000 * 12).toISOString() },
          { id: "s2", name: "JavaScript Fundamentals", completedAt: new Date(Date.now() - 86400000 * 9).toISOString() },
          { id: "s3", name: "React Foundations", completedAt: new Date(Date.now() - 86400000 * 5).toISOString() },
          { id: "s4", name: "State Management", completedAt: new Date(Date.now() - 86400000 * 2).toISOString() },
        ],
        totalSteps: 12,
        streak: 5,
        lastActive: new Date().toISOString(),
        roadmapTitle: user.careerGoal || "Frontend Developer",
        milestones: [
          { name: "Foundations", steps: 3, completed: 3 },
          { name: "Core Skills", steps: 3, completed: 1 },
          { name: "Advanced", steps: 3, completed: 0 },
          { name: "Professional", steps: 3, completed: 0 },
        ],
        weeklyActivity: [2, 3, 1, 4, 2, 3, 1],
      };
      mockUsers[idx] = { ...user, progress: demoProgress };
      persistMockUsers();
      return demoProgress;
    }
    return user.progress;
  },
};

/* ─── Provider ──────────────────────────────────────────────────── */

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_TOKEN_KEY));
  const [loading, _setLoading] = useState(false);

  const persistSession = useCallback((tok, usr) => {
    localStorage.setItem(STORAGE_TOKEN_KEY, tok);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(usr));
    setToken(tok);
    setUser(usr);
  }, []);

  const login = useCallback(
    async (email, password) => {
      const { token: tok, user: usr } = await authService.login(email, password);
      persistSession(tok, usr);
      return usr;
    },
    [persistSession],
  );

  const signup = useCallback(
    async ({ name, email, password }) => {
      const { token: tok, user: usr } = await authService.signup({
        name,
        email,
        password,
      });
      persistSession(tok, usr);
      return usr;
    },
    [persistSession],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    async (updates) => {
      if (!user) throw new Error("Not authenticated");
      const updated = await authService.updateProfile(user.id, updates);
      persistSession(token, updated);
      return updated;
    },
    [user, token, persistSession],
  );

  const getProgress = useCallback(async () => {
    if (!user) throw new Error("Not authenticated");
    return authService.getProgress(user.id);
  }, [user]);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    updateProfile,
    getProgress,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthContext;
