import React from "react";
import { cn } from "@/lib/utils";

const COLOR_MAP = {
  open: "border-amber-500 text-amber-700 bg-amber-50",
  expected: "border-sky-500 text-sky-700 bg-sky-50",
  pending: "border-amber-500 text-amber-700 bg-amber-50",
  active: "border-brand text-brand bg-brand-50",
  occupied: "border-safety text-safety bg-orange-50",
  available: "border-emerald-500 text-emerald-700 bg-emerald-50",
  paid: "border-emerald-500 text-emerald-700 bg-emerald-50",
  resolved: "border-emerald-500 text-emerald-700 bg-emerald-50",
  closed: "border-slate-400 text-slate-700 bg-slate-100",
  assigned: "border-indigo-500 text-indigo-700 bg-indigo-50",
  cancelled: "border-slate-400 text-slate-500 bg-slate-50",
  checkedin: "border-brand text-brand bg-brand-50",
  checkedout: "border-slate-400 text-slate-600 bg-slate-50",
  placed: "border-sky-500 text-sky-700 bg-sky-50",
  preparing: "border-amber-500 text-amber-700 bg-amber-50",
  delivered: "border-emerald-500 text-emerald-700 bg-emerald-50",
  vacant: "border-slate-400 text-slate-700 bg-slate-50",
};

export default function StatusBadge({ status }) {
  const key = (status || "").toLowerCase().replace(/\s+/g, "");
  const cls = COLOR_MAP[key] || "border-slate-300 text-slate-700 bg-white";
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 border text-[11px] tracking-[0.14em] uppercase font-semibold", cls)}>
      <span className="w-1.5 h-1.5 bg-current" />{status}
    </span>
  );
}
