import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, setTokens, clearTokens, getToken } from "@/api/client";
import { EP } from "@/api/endpoints";

const AuthCtx = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMe = useCallback(async () => {
    if (!getToken()) { setUser(null); setLoading(false); return; }
    try {
      const res = await api.get(EP.auth.me);
      const u = res.data?.data || res.data;
      setUser(u);
    } catch {
      clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadMe(); }, [loadMe]);

  const login = async (email, password) => {
    const res = await api.post(EP.auth.login, { email, password });
    const payload = res.data?.data || res.data;
    setTokens({ accessToken: payload.accessToken, refreshToken: payload.refreshToken });
    setUser(payload.user);
    return payload.user;
  };

  const register = async (form) => {
    const res = await api.post(EP.auth.register, form);
    const payload = res.data?.data || res.data;
    if (payload.accessToken) setTokens({ accessToken: payload.accessToken, refreshToken: payload.refreshToken });
    if (payload.user) setUser(payload.user);
    return payload;
  };

  const logout = () => { clearTokens(); setUser(null); };

  return (
    <AuthCtx.Provider value={{ user, loading, login, logout, register, reload: loadMe }}>
      {children}
    </AuthCtx.Provider>
  );
};

export const useAuth = () => useContext(AuthCtx);
