import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { getApiUrl, setApiUrl } from "@/api/client";
import { isDemo } from "@/api/mockAdapter";
import { ArrowRight, Loader2, Server, Zap } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [email, setEmail] = useState(isDemo() ? "superadmin@bms.com" : "");
  const [password, setPassword] = useState(isDemo() ? "Admin@123" : "");
  const [loading, setLoading] = useState(false);
  const [apiUrl, setApiUrlLocal] = useState(getApiUrl());
  const [demo, setDemo] = useState(isDemo());

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      setApiUrl(apiUrl);
      localStorage.setItem("bms_demo_mode", demo ? "true" : "false");
      const user = await login(email, password);
      toast.success(`Welcome, ${user.firstName || user.email}`);
      nav(loc.state?.from?.pathname || "/app/dashboard", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.1fr_1fr] bg-white" data-testid="login-page">
      <div className="flex items-center justify-center p-6 sm:p-12 order-2 lg:order-1">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-block mb-12">
            <div className="font-display text-2xl font-semibold tracking-tight">BMS<span className="text-brand">.</span></div>
            <div className="text-[10px] tracking-[0.25em] uppercase text-slate-500">Building Management System</div>
          </Link>

          <div className="eyebrow mb-3">Secure Login</div>
          <h1 className="font-display text-4xl sm:text-5xl font-light tracking-tight mb-3">Sign in to your control room.</h1>
          <p className="text-sm text-slate-600 mb-10">Access your buildings, residents, operations and reports in one interface.</p>

          <form onSubmit={submit} className="space-y-5" data-testid="login-form">
            <div>
              <label className="bms-label">Email</label>
              <input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@domain.com" className="bms-input" data-testid="login-email" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="bms-label mb-0">Password</label>
                <Link to="/forgot-password" className="text-[11px] tracking-wider uppercase text-brand hover:underline" data-testid="forgot-link">Forgot?</Link>
              </div>
              <input type="password" required value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" className="bms-input" data-testid="login-password" />
            </div>

            <details className="border border-slate-200 bg-slate-50">
              <summary className="cursor-pointer px-4 py-3 text-xs tracking-[0.14em] uppercase font-semibold text-slate-600 flex items-center gap-2">
                <Server className="w-3.5 h-3.5" /> API Configuration
              </summary>
              <div className="p-4 space-y-3 bg-white border-t border-slate-200">
                <div>
                  <label className="bms-label">BMS API URL</label>
                  <input value={apiUrl} onChange={(e)=>setApiUrlLocal(e.target.value)} className="bms-input font-mono text-xs" data-testid="login-api-url" />
                </div>
                <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                  <input type="checkbox" checked={demo} onChange={(e)=>setDemo(e.target.checked)} className="w-4 h-4 accent-brand" data-testid="login-demo-toggle" />
                  <Zap className="w-4 h-4 text-safety" />
                  <span className="text-slate-700">Demo mode (use local in-memory data)</span>
                </label>
                {demo && (
                  <div className="text-[11px] font-mono text-slate-500 bg-slate-50 border border-slate-200 p-2">
                    Try: <span className="text-brand">superadmin@bms.com</span> / <span className="text-brand">Admin@123</span>
                  </div>
                )}
              </div>
            </details>

            <button type="submit" disabled={loading} className="btn-primary w-full h-12" data-testid="login-submit">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Sign in <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="mt-8 text-sm text-slate-600">
            New here? <Link to="/register" className="text-brand font-medium hover:underline" data-testid="register-link">Create an account</Link>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden bg-slate-900 order-1 lg:order-2 min-h-[200px] lg:min-h-0">
        <div className="absolute inset-0">
          <img src="https://static.prod-images.emergentagent.com/jobs/4a496967-f19a-4ed0-804e-895dcea6a9dc/images/f5c81c64001480b18be5417e105ced8a410537c01ea8b5ef1eca3cb347dce7d9.png" alt="Architectural blueprint" className="w-full h-full object-cover opacity-70" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 to-slate-900/20" />
        <div className="relative h-full p-8 lg:p-16 flex flex-col justify-between text-white">
          <div className="eyebrow text-white/70">v 1.0 · Engineered for scale</div>
          <div>
            <h2 className="font-display text-2xl lg:text-4xl font-light leading-tight max-w-md">One platform for every tenant, every complaint, every invoice.</h2>
            <div className="mt-6 flex items-center gap-3 font-mono text-[11px] tracking-[0.18em] uppercase text-white/80">
              <span className="w-6 h-px bg-safety" /> BMS · Control Room
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
