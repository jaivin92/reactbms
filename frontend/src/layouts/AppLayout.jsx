import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { Toaster } from "@/components/ui/sonner";
import ConnectionBanner from "@/components/ConnectionBanner";

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen flex bg-slate-50" data-testid="app-layout">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenu={() => setOpen(true)} />
        <ConnectionBanner />
        <main className="flex-1 p-4 sm:p-8 animate-fade-up">
          <Outlet />
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
