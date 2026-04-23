import React, { useEffect, useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { getApiUrl } from "@/api/client";
import { isDemo } from "@/api/mockAdapter";
import { Link } from "react-router-dom";

export default function ConnectionBanner() {
  const [status, setStatus] = useState("checking"); // checking | online | offline | demo
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (isDemo()) { setStatus("demo"); return; }
    let alive = true;
    const url = getApiUrl().replace(/\/api$/, "") + "/health";
    fetch(url, { method: "GET", mode: "cors" })
      .then((r) => { if (alive) setStatus(r.ok ? "online" : "offline"); })
      .catch(() => { if (alive) setStatus("offline"); });
    return () => { alive = false; };
  }, []);

  if (status === "online" || status === "demo" || dismissed) return null;

  return (
    <div className="bg-safety/10 border-b border-safety/40 px-4 sm:px-6 py-2.5 flex items-start sm:items-center gap-3 text-sm" data-testid="connection-banner">
      <AlertTriangle className="w-4 h-4 text-safety flex-shrink-0 mt-0.5 sm:mt-0" />
      <div className="flex-1 min-w-0">
        <span className="font-semibold text-slate-900">BMS API unreachable</span>
        <span className="text-slate-700"> — configure your backend URL or switch to demo mode. </span>
        <Link to="/app/settings" className="text-brand underline underline-offset-2 font-medium" data-testid="banner-settings-link">Open settings →</Link>
      </div>
      <button onClick={() => setDismissed(true)} className="p-1 hover:bg-white" data-testid="banner-dismiss">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
