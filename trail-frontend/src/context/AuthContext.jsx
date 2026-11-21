import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

const STORAGE_TOKEN_KEY = "trail_auth_token";
const STORAGE_USER_KEY = "trail_auth_user";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://trail-backend-agdl.onrender.com/api/v1";

// Authentication API client
const authService = {
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Invalid email or password");
    }

    return { token: data.token, user: data.user };
  },

  async signup({ name, email, password }) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to create account");
    }

    return { token: data.token, user: data.user };
  },

  async googleLogin(credential) {
    const res = await fetch(`${API_BASE}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Google authentication failed");
    }

    return { token: data.token, user: data.user };
  },

  async getMe(token) {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Session expired");
    const data = await res.json();
    return data.user;
  },

  async updateProfile(token, updates) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to update profile");
    }

    return data.user;
  },
};

// Auth context provider component
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
  const [loading, setLoading] = useState(true);

  const persistSession = useCallback((tok, usr) => {
    if (tok) {
      localStorage.setItem(STORAGE_TOKEN_KEY, tok);
      setToken(tok);
    } else {
      localStorage.removeItem(STORAGE_TOKEN_KEY);
      setToken(null);
    }

    if (usr) {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(usr));
      setUser(usr);
    } else {
      localStorage.removeItem(STORAGE_USER_KEY);
      setUser(null);
    }
  }, []);

  const logout = useCallback(() => {
    persistSession(null, null);
  }, [persistSession]);

  // Validate and hydrate user session from backend on mount
  useEffect(() => {
    let isMounted = true;
    const existingToken = localStorage.getItem(STORAGE_TOKEN_KEY);

    if (existingToken) {
      authService
        .getMe(existingToken)
        .then((freshUser) => {
          if (isMounted) {
            persistSession(existingToken, freshUser);
            setLoading(false);
          }
        })
        .catch(() => {
          if (isMounted) {
            // Token is invalid or expired
            logout();
            setLoading(false);
          }
        });
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [persistSession, logout]);

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

  const googleLogin = useCallback(
    async (credential) => {
      const { token: tok, user: usr } = await authService.googleLogin(credential);
      persistSession(tok, usr);
      return usr;
    },
    [persistSession],
  );

  const updateProfile = useCallback(
    async (updates) => {
      if (!token) throw new Error("Not authenticated");
      const updatedUser = await authService.updateProfile(token, updates);
      persistSession(token, updatedUser);
      return updatedUser;
    },
    [token, persistSession],
  );

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    login,
    signup,
    googleLogin,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthContext;
