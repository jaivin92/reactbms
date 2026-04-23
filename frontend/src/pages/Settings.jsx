import React, { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { DEFAULT_API, getApiUrl, setApiUrl } from "@/api/client";
import { isDemo, resetMockDb } from "@/api/mockAdapter";
import { toast } from "sonner";
import { Server, Zap, RotateCcw, CheckCircle2, XCircle } from "lucide-react";

export default function Settings() {
  const [url, setUrl] = useState(getApiUrl());
  const [demo, setDemo] = useState(isDemo());
  const [ping, setPing] = useState(null); // null | "ok" | "fail" | "checking"

  const save = () => {
    setApiUrl(url);
    localStorage.setItem("bms_demo_mode", demo ? "true" : "false");
    toast.success("Settings saved — reloading");
    setTimeout(() => window.location.reload(), 700);
  };

  const test = async () => {
    setPing("checking");
    try {
      const res = await fetch(url.replace(/\/api$/, "") + "/health", { method: "GET" });
      setPing(res.ok ? "ok" : "fail");
    } catch { setPing("fail"); }
  };

  const reset = () => {
    resetMockDb();
    toast.success("Demo data reset");
  };

  return (
    <div className="space-y-8 max-w-3xl" data-testid="settings-page">
      <PageHeader eyebrow="Configuration" title="Settings" description="Point the frontend at your BMS backend, toggle demo mode, and manage local data." />

      <section className="bms-card p-6 space-y-5">
        <div className="flex items-center gap-3">
          <Server className="w-5 h-5 text-brand" />
          <h2 className="font-display text-xl">API Connection</h2>
        </div>
        <div>
          <label className="bms-label">BMS API Base URL</label>
          <input value={url} onChange={(e)=>setUrl(e.target.value)} className="bms-input font-mono text-xs" data-testid="settings-api-url" />
          <div className="text-xs text-slate-500 mt-2">Default: <span className="font-mono">{DEFAULT_API}</span></div>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary" onClick={test} data-testid="settings-test-btn">Test connection</button>
          {ping === "ok" && <span className="flex items-center gap-1.5 text-sm text-emerald-700"><CheckCircle2 className="w-4 h-4"/> Online</span>}
          {ping === "fail" && <span className="flex items-center gap-1.5 text-sm text-safety"><XCircle className="w-4 h-4"/> Unreachable</span>}
          {ping === "checking" && <span className="text-sm text-slate-500 font-mono">checking…</span>}
        </div>
      </section>

      <section className="bms-card p-6 space-y-5">
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-safety" />
          <h2 className="font-display text-xl">Demo Mode</h2>
        </div>
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input type="checkbox" checked={demo} onChange={(e)=>setDemo(e.target.checked)} className="w-4 h-4 mt-1 accent-brand" data-testid="settings-demo-toggle" />
          <div>
            <div className="font-medium text-slate-900">Use local in-memory data</div>
            <div className="text-sm text-slate-600 mt-1">Ideal when your BMS backend isn't reachable from this environment. All writes persist in localStorage.</div>
          </div>
        </label>
        {demo && <button onClick={reset} className="btn-secondary text-xs" data-testid="settings-reset-btn"><RotateCcw className="w-3.5 h-3.5"/> Reset demo data</button>}
      </section>

      <div className="flex justify-end">
        <button className="btn-primary h-12 px-8" onClick={save} data-testid="settings-save-btn">Save Changes</button>
      </div>
    </div>
  );
}
