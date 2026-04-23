import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, Building2, Users, Receipt, CarFront, UserCheck,
  UtensilsCrossed, Wrench, Vote, Megaphone, Settings, X
} from "lucide-react";
import { cn } from "@/lib/utils";

const ALL_ITEMS = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["SuperAdmin","BuildingAdmin","SecurityStaff","MaintenanceStaff","CanteenStaff","Resident","Tenant"] },
  { to: "/app/buildings", label: "Buildings", icon: Building2, roles: ["SuperAdmin","BuildingAdmin"] },
  { to: "/app/users", label: "Users", icon: Users, roles: ["SuperAdmin","BuildingAdmin"] },
  { to: "/app/billing", label: "Billing", icon: Receipt, roles: ["SuperAdmin","BuildingAdmin","Resident","Tenant"] },
  { to: "/app/parking", label: "Parking", icon: CarFront, roles: ["SuperAdmin","BuildingAdmin","Resident","Tenant","SecurityStaff"] },
  { to: "/app/visitors", label: "Visitors", icon: UserCheck, roles: ["SuperAdmin","BuildingAdmin","SecurityStaff","Resident","Tenant"] },
  { to: "/app/canteen", label: "Canteen", icon: UtensilsCrossed, roles: ["SuperAdmin","BuildingAdmin","CanteenStaff","Resident","Tenant"] },
  { to: "/app/complaints", label: "Complaints", icon: Wrench, roles: ["SuperAdmin","BuildingAdmin","MaintenanceStaff","Resident","Tenant"] },
  { to: "/app/voting", label: "Voting", icon: Vote, roles: ["SuperAdmin","BuildingAdmin","Resident","Tenant"] },
  { to: "/app/notices", label: "Notices", icon: Megaphone, roles: ["SuperAdmin","BuildingAdmin","SecurityStaff","MaintenanceStaff","CanteenStaff","Resident","Tenant"] },
  { to: "/app/settings", label: "Settings", icon: Settings, roles: ["SuperAdmin","BuildingAdmin","SecurityStaff","MaintenanceStaff","CanteenStaff","Resident","Tenant"] },
];

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();
  const items = ALL_ITEMS.filter(i => i.roles.includes(user?.role));

  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden" onClick={onClose} data-testid="sidebar-overlay" />}
      <aside
        data-testid="sidebar"
        className={cn(
          "fixed lg:sticky top-0 left-0 h-screen z-50 w-64 bg-white border-r-2 border-slate-200 flex flex-col transition-transform",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="h-16 px-6 flex items-center justify-between border-b-2 border-slate-200">
          <div>
            <div className="font-display text-xl font-semibold tracking-tight">BMS<span className="text-brand">.</span></div>
            <div className="text-[10px] tracking-[0.25em] uppercase text-slate-500">Control Room</div>
          </div>
          <button className="lg:hidden p-1.5 hover:bg-slate-100" onClick={onClose} data-testid="sidebar-close">
            <X className="w-4 h-4" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              data-testid={`nav-${item.label.toLowerCase()}`}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-6 py-3 text-sm border-l-4 transition-all",
                isActive
                  ? "border-brand bg-brand-50 text-brand font-medium"
                  : "border-transparent text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-6 border-t-2 border-slate-200">
          <div className="eyebrow mb-2">Signed in</div>
          <div className="text-sm font-medium text-slate-900 truncate" data-testid="sidebar-user-name">
            {user?.firstName} {user?.lastName}
          </div>
          <div className="font-mono text-[11px] text-brand tracking-wider uppercase mt-0.5" data-testid="sidebar-user-role">
            {user?.role}
          </div>
        </div>
      </aside>
    </>
  );
}
