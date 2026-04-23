import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Menu, ChevronRight, LogOut, User, KeyRound } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { isDemo } from "@/api/mockAdapter";

export default function Topbar({ onMenu }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const parts = loc.pathname.split("/").filter(Boolean).slice(1);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-slate-200">
      <div className="flex items-center h-16 px-4 sm:px-6 gap-4">
        <button onClick={onMenu} className="lg:hidden p-2 hover:bg-slate-100" data-testid="topbar-menu-btn">
          <Menu className="w-5 h-5" />
        </button>
        <nav className="hidden sm:flex items-center gap-2 text-sm text-slate-500 font-mono">
          <Link to="/app/dashboard" className="hover:text-brand">BMS</Link>
          {parts.map((p, i) => (
            <React.Fragment key={i}>
              <ChevronRight className="w-3 h-3" />
              <span className={i === parts.length - 1 ? "text-slate-900" : ""}>{p}</span>
            </React.Fragment>
          ))}
        </nav>
        <div className="flex-1" />
        {isDemo() && (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 h-7 border border-safety text-safety text-[11px] tracking-[0.18em] uppercase font-semibold" data-testid="demo-badge">
            <span className="w-1.5 h-1.5 bg-safety" />Demo Mode
          </span>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 px-2 py-1.5 hover:bg-slate-100" data-testid="topbar-profile-btn">
              <div className="w-9 h-9 bg-brand text-white flex items-center justify-center font-display font-semibold text-sm">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-medium leading-tight">{user?.firstName} {user?.lastName}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">{user?.role}</div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-none">
            <DropdownMenuLabel className="font-mono text-xs">{user?.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => nav("/app/profile")} data-testid="menu-profile">
              <User className="w-4 h-4 mr-2" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => nav("/app/profile?tab=password")} data-testid="menu-change-password">
              <KeyRound className="w-4 h-4 mr-2" /> Change Password
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { logout(); nav("/login"); }} data-testid="menu-logout">
              <LogOut className="w-4 h-4 mr-2" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
