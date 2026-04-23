import axios from "axios";
import { mockAdapter, isDemo } from "./mockAdapter";

export const DEFAULT_API = "http://localhost:3000/api";
const LS_API = "bms_api_url";
const LS_TOKEN = "bms_access_token";
const LS_REFRESH = "bms_refresh_token";

export const getApiUrl = () => localStorage.getItem(LS_API) || DEFAULT_API;
export const setApiUrl = (u) => localStorage.setItem(LS_API, u);

export const getToken = () => localStorage.getItem(LS_TOKEN);
export const setTokens = ({ accessToken, refreshToken }) => {
  if (accessToken) localStorage.setItem(LS_TOKEN, accessToken);
  if (refreshToken) localStorage.setItem(LS_REFRESH, refreshToken);
};
export const clearTokens = () => {
  localStorage.removeItem(LS_TOKEN);
  localStorage.removeItem(LS_REFRESH);
};

export const api = axios.create({
  baseURL: getApiUrl(),
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Before every request: refresh baseURL (user may change it), attach token, route to mock if demo.
api.interceptors.request.use((config) => {
  config.baseURL = getApiUrl();
  const t = getToken();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  if (isDemo()) config.adapter = mockAdapter;
  return config;
});

let refreshing = null;
api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config || {};
    if (error.response?.status === 401 && !original._retry && !isDemo()) {
      original._retry = true;
      try {
        if (!refreshing) {
          const refreshToken = localStorage.getItem(LS_REFRESH);
          if (!refreshToken) throw error;
          refreshing = axios.post(`${getApiUrl()}/auth/refresh`, { refreshToken }).finally(() => { refreshing = null; });
        }
        const res = await refreshing;
        const newAccess = res.data?.data?.accessToken || res.data?.accessToken;
        if (newAccess) {
          setTokens({ accessToken: newAccess });
          original.headers.Authorization = `Bearer ${newAccess}`;
          return api(original);
        }
      } catch (e) {
        clearTokens();
      }
    }
    return Promise.reject(error);
  }
);

// Helper: unwrap { success, data } envelope.
export const unwrap = (res) => {
  const payload = res?.data;
  if (payload && typeof payload === "object" && "data" in payload) return payload.data;
  return payload;
};
