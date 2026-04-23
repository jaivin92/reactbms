import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2, ArrowRight } from "lucide-react";

const ROLES = ["Resident","Tenant","BuildingAdmin","SecurityStaff","MaintenanceStaff","CanteenStaff"];

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ firstName:"", lastName:"", email:"", phone:"", password:"", role:"Resident" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success("Account created");
      nav("/app/dashboard", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Registration failed");
    } finally { setLoading(false); }
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50" data-testid="register-page">
      <div className="w-full max-w-xl bms-card p-8 sm:p-12">
        <Link to="/login" className="text-xs tracking-[0.14em] uppercase text-slate-500 hover:text-brand">← Back to login</Link>
        <div className="eyebrow mt-6 mb-3">Create Account</div>
        <h1 className="font-display text-3xl sm:text-4xl font-light tracking-tight mb-8">Join the BMS.</h1>
        <form onSubmit={submit} className="grid sm:grid-cols-2 gap-5" data-testid="register-form">
          <div><label className="bms-label">First name</label><input required className="bms-input" value={form.firstName} onChange={set("firstName")} data-testid="reg-firstname" /></div>
          <div><label className="bms-label">Last name</label><input required className="bms-input" value={form.lastName} onChange={set("lastName")} data-testid="reg-lastname" /></div>
          <div className="sm:col-span-2"><label className="bms-label">Email</label><input type="email" required className="bms-input" value={form.email} onChange={set("email")} data-testid="reg-email" /></div>
          <div><label className="bms-label">Phone</label><input className="bms-input" value={form.phone} onChange={set("phone")} data-testid="reg-phone" /></div>
          <div>
            <label className="bms-label">Role</label>
            <select className="bms-input" value={form.role} onChange={set("role")} data-testid="reg-role">
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2"><label className="bms-label">Password</label><input type="password" required minLength={6} className="bms-input" value={form.password} onChange={set("password")} data-testid="reg-password" /></div>
          <button type="submit" disabled={loading} className="btn-primary sm:col-span-2 h-12" data-testid="reg-submit">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Create account <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
