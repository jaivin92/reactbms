import React from "react";
import { Inbox } from "lucide-react";

export default function EmptyState({ title = "Nothing here yet", description, action, icon: Icon = Inbox }) {
  return (
    <div className="bms-card p-12 text-center relative overflow-hidden" data-testid="empty-state">
      <div className="absolute inset-0 grid-lines opacity-50 pointer-events-none" />
      <div className="relative">
        <div className="w-14 h-14 border-2 border-slate-300 mx-auto flex items-center justify-center">
          <Icon className="w-6 h-6 text-slate-400" />
        </div>
        <h3 className="font-display text-xl font-medium mt-6 text-slate-900">{title}</h3>
        {description && <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">{description}</p>}
        {action && <div className="mt-6 flex justify-center">{action}</div>}
      </div>
    </div>
  );
}
