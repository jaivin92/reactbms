import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api, unwrap } from "@/api/client";
import { EP } from "@/api/endpoints";
import KPICard from "@/components/KPICard";
import { PageHeader } from "@/components/PageHeader";
import { Building2, Users, Receipt, Wrench, UserCheck, CarFront, TrendingUp, AlertCircle } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";

const CHART_COLORS = ["#0043CE", "#FF3E00", "#16A34A", "#EAB308", "#64748B"];

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const endpoint =
      user.role === "SuperAdmin" ? EP.dashboard.superAdmin :
      (user.role === "BuildingAdmin" || user.role === "SecurityStaff" || user.role === "MaintenanceStaff" || user.role === "CanteenStaff") ? EP.dashboard.buildingAdmin :
      EP.dashboard.resident;
    api.get(endpoint).then((r) => setStats(unwrap(r))).catch(() => setStats({})).finally(() => setLoading(false));
  }, [user.role]);

  const greeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-8" data-testid="dashboard-page">
      <PageHeader
        eyebrow={`${user.role} · Overview`}
        title={`${greeting}, ${user.firstName}.`}
        description="Operational pulse of your buildings, residents and services — at a glance."
      />

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="bms-card h-32 animate-pulse" />)}
        </div>
      ) : user.role === "SuperAdmin" ? (
        <SuperAdminView stats={stats} />
      ) : user.role === "Resident" || user.role === "Tenant" ? (
        <ResidentView stats={stats} />
      ) : (
        <AdminView stats={stats} />
      )}
    </div>
  );
}

function SuperAdminView({ stats }) {
  const s = stats || {};
  const chartData = [
    { name: "Buildings", value: s.totalBuildings || 0 },
    { name: "Units", value: s.totalUnits || 0 },
    { name: "Users", value: s.totalUsers || 0 },
    { name: "Complaints", value: s.openComplaints || 0 },
  ];
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Buildings" value={s.totalBuildings ?? "—"} icon={Building2} accent="brand" testId="kpi-buildings" />
        <KPICard label="Total Units" value={s.totalUnits ?? "—"} icon={Building2} accent="slate" testId="kpi-units" />
        <KPICard label="Users" value={s.totalUsers ?? "—"} icon={Users} accent="brand" testId="kpi-users" />
        <KPICard label="Open Complaints" value={s.openComplaints ?? "—"} icon={Wrench} accent="safety" testId="kpi-complaints" />
      </div>
      <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
        <div className="bms-card p-6">
          <div className="eyebrow mb-4">System Footprint</div>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={{ stroke: "#cbd5e1" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={{ stroke: "#cbd5e1" }} />
                <Tooltip contentStyle={{ borderRadius: 0, border: "1px solid #cbd5e1", fontSize: 12 }} />
                <Bar dataKey="value" fill="#0043CE" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bms-card p-6">
          <div className="eyebrow mb-4">Pending Bills</div>
          <div className="font-display text-5xl font-light text-slate-900">{s.pendingBills ?? 0}</div>
          <p className="text-sm text-slate-500 mt-2">Awaiting collection across all buildings</p>
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="eyebrow mb-2">Recent Notices</div>
            <div className="space-y-2">
              {(s.recentActivity || []).slice(0, 3).map((n, i) => (
                <div key={i} className="text-sm text-slate-700 truncate">• {n.title || n.content || "Notice"}</div>
              ))}
              {(!s.recentActivity || s.recentActivity.length === 0) && <div className="text-sm text-slate-400">No recent activity</div>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function AdminView({ stats }) {
  const s = stats || {};
  const pie = [
    { name: "Paid", value: 72 },
    { name: "Pending", value: s.pendingBills || 28 },
  ];
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Occupancy" value={`${s.occupancy ?? 0}%`} icon={TrendingUp} accent="brand" testId="kpi-occupancy" />
        <KPICard label="Pending Bills" value={s.pendingBills ?? 0} icon={Receipt} accent="safety" testId="kpi-pending-bills" />
        <KPICard label="Visitors Today" value={s.visitorsToday ?? 0} icon={UserCheck} accent="slate" testId="kpi-visitors" />
        <KPICard label="Open Issues" value={s.openComplaints ?? 0} icon={AlertCircle} accent="warning" testId="kpi-issues" />
      </div>
      <div className="grid lg:grid-cols-[1fr_2fr] gap-6">
        <div className="bms-card p-6">
          <div className="eyebrow mb-4">Collection Rate</div>
          <div className="h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pie} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                  {pie.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                </Pie>
                <Legend iconType="square" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bms-card p-6">
          <div className="eyebrow mb-4">Monthly Revenue</div>
          <div className="font-display text-5xl font-light text-slate-900">${(s.revenueThisMonth ?? 0).toLocaleString()}</div>
          <p className="text-sm text-slate-500 mt-2">This month · settled transactions</p>
        </div>
      </div>
    </>
  );
}

function ResidentView({ stats }) {
  const s = stats || {};
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard label="Pending Bills" value={s.pendingBills ?? 0} icon={Receipt} accent="safety" testId="kpi-my-bills" />
      <KPICard label="Active Complaints" value={s.activeComplaints ?? 0} icon={Wrench} accent="warning" testId="kpi-my-complaints" />
      <KPICard label="Upcoming Visitors" value={s.upcomingVisitors ?? 0} icon={UserCheck} accent="brand" testId="kpi-my-visitors" />
      <KPICard label="My Parking" value={s.myParking ?? 0} icon={CarFront} accent="slate" testId="kpi-my-parking" />
    </div>
  );
}
