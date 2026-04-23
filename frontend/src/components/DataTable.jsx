import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import EmptyState from "@/components/EmptyState";

export default function DataTable({ columns, rows, loading, searchableKeys = [], actions, rowKey, emptyTitle, emptyDescription, testId = "data-table" }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!q || !searchableKeys.length) return rows;
    const qq = q.toLowerCase();
    return rows.filter((r) => searchableKeys.some((k) => String(r[k] ?? "").toLowerCase().includes(qq)));
  }, [rows, q, searchableKeys]);

  return (
    <div className="bms-card" data-testid={testId}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border-b border-slate-200">
        {searchableKeys.length > 0 && (
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search…"
              className="bms-input pl-9 h-9"
              data-testid={`${testId}-search`}
            />
          </div>
        )}
        <div className="flex-1" />
        {actions}
      </div>

      {loading ? (
        <div className="p-12 text-center font-mono text-xs tracking-[0.2em] uppercase text-slate-500" data-testid={`${testId}-loading`}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="p-6">
          <EmptyState title={emptyTitle || "No records"} description={emptyDescription} />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                {columns.map((c) => (
                  <th key={c.key} className="text-left p-4 text-[11px] tracking-[0.14em] uppercase font-semibold text-slate-500 bg-slate-50">
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, idx) => (
                <tr key={row[rowKey] ?? idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors" data-testid={`${testId}-row-${idx}`}>
                  {columns.map((c) => (
                    <td key={c.key} className={`p-4 align-middle text-slate-700 ${c.className || ""}`}>
                      {c.render ? c.render(row) : row[c.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
