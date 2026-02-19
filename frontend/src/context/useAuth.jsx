// frontend/src/context/useAuth.jsx
import { createContext, useState, useEffect, useContext } from "react";
import api, { setTokens } from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Silent login при refresh
  useEffect(() => {
    const initUser = async () => {
      if (!localStorage.getItem("refreshToken")) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.post("token/refresh/", {
          refresh: localStorage.getItem("refreshToken"),
        });
        setTokens({ access: res.data.access, refresh: localStorage.getItem("refreshToken") });
        const profileRes = await api.get("me/");
        setUser(profileRes.data);
      } catch {
        setUser(null);
        localStorage.removeItem("refreshToken");
      } finally {
        setLoading(false);
      }
    };
    initUser();
  }, []);

  // Login
  const login = async (email, password) => {
    const res = await api.post("token/", { email, password });
    setTokens({ access: res.data.access, refresh: res.data.refresh });
    localStorage.setItem("refreshToken", res.data.refresh);

    const profileRes = await api.get("me/");
    setUser(profileRes.data);
  };

  // Logout
  const logout = () => {
    setTokens({ access: null, refresh: null });
    setUser(null);
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => useContext(AuthContext);
