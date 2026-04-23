import React from "react";

export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
      <div className="min-w-0">
        {eyebrow && <div className="eyebrow mb-2" data-testid="page-eyebrow">{eyebrow}</div>}
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-slate-900" data-testid="page-title">{title}</h1>
        {description && <p className="text-sm text-slate-600 mt-3 max-w-2xl">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}
