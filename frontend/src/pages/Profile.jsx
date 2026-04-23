import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/api/client";
import { EP } from "@/api/endpoints";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";

export default function Profile() {
  const { user } = useAuth();
  const [cur, setCur] = useState(""); const [nxt, setNxt] = useState("");

  const change = async (e) => {
    e.preventDefault();
    try {
      await api.put(EP.auth.changePassword, { currentPassword: cur, newPassword: nxt });
      toast.success("Password updated");
      setCur(""); setNxt("");
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  return (
    <div className="space-y-8 max-w-3xl" data-testid="profile-page">
      <PageHeader eyebrow="Account" title="Profile" />

      <section className="bms-card p-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 bg-slate-900 text-white flex items-center justify-center font-display text-3xl">{user?.firstName?.[0]}{user?.lastName?.[0]}</div>
          <div>
            <div className="font-display text-2xl">{user?.firstName} {user?.lastName}</div>
            <div className="text-sm text-slate-600">{user?.email}</div>
            <div className="font-mono text-[11px] tracking-wider uppercase text-brand mt-1">{user?.role}</div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-100">
          <div><div className="eyebrow">Phone</div><div className="mt-1">{user?.phone || "—"}</div></div>
          <div><div className="eyebrow">User ID</div><div className="mt-1 font-mono text-xs text-slate-600">{user?.userId}</div></div>
        </div>
      </section>

      <section className="bms-card p-6">
        <h2 className="font-display text-xl mb-5">Change Password</h2>
        <form onSubmit={change} className="grid sm:grid-cols-2 gap-4" data-testid="password-form">
          <div className="sm:col-span-2"><label className="bms-label">Current Password</label><input type="password" required className="bms-input" value={cur} onChange={(e)=>setCur(e.target.value)} data-testid="cur-password"/></div>
          <div className="sm:col-span-2"><label className="bms-label">New Password</label><input type="password" required minLength={6} className="bms-input" value={nxt} onChange={(e)=>setNxt(e.target.value)} data-testid="new-password"/></div>
          <button className="btn-primary sm:col-span-2 h-12" data-testid="change-pw-btn">Update Password</button>
        </form>
      </section>
    </div>
  );
}
