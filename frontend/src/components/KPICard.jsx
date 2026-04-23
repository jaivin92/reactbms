import React from "react";
import { cn } from "@/lib/utils";

export default function KPICard({ label, value, hint, icon: Icon, accent = "brand", testId }) {
  const accentBar = {
    brand: "bg-brand",
    safety: "bg-safety",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    slate: "bg-slate-900",
  }[accent];
  return (
    <div className="bms-card p-6 relative overflow-hidden group hover:-translate-y-0.5 hover:shadow-md transition-all duration-200" data-testid={testId}>
      <div className={cn("absolute top-0 left-0 w-1 h-full", accentBar)} />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="eyebrow">{label}</div>
          <div className="font-display text-4xl font-light tracking-tight mt-2 text-slate-900 truncate">{value}</div>
          {hint && <div className="text-xs text-slate-500 mt-2">{hint}</div>}
        </div>
        {Icon && (
          <div className="w-10 h-10 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-brand transition-colors">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
