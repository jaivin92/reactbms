import React, { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/api/client";
import { EP } from "@/api/endpoints";
import { toast } from "sonner";
import { Mail, Loader2 } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(EP.auth.forgot, { email });
      setSent(true);
      toast.success("Reset link sent if account exists");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Request failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50" data-testid="forgot-page">
      <div className="w-full max-w-md bms-card p-8 sm:p-12">
        <div className="w-12 h-12 border-2 border-brand flex items-center justify-center mb-6"><Mail className="w-5 h-5 text-brand" /></div>
        <div className="eyebrow mb-3">Password Recovery</div>
        <h1 className="font-display text-3xl font-light tracking-tight mb-3">Reset your password</h1>
        <p className="text-sm text-slate-600 mb-8">Enter the email tied to your BMS account and we'll send a secure reset link.</p>

        {sent ? (
          <div className="border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            If an account with that email exists, you'll receive a reset link shortly.
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5" data-testid="forgot-form">
            <div><label className="bms-label">Email</label><input type="email" required className="bms-input" value={email} onChange={(e)=>setEmail(e.target.value)} data-testid="forgot-email" /></div>
            <button disabled={loading} className="btn-primary w-full h-12" data-testid="forgot-submit">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send reset link"}
            </button>
          </form>
        )}

        <div className="mt-6 text-sm"><Link to="/login" className="text-brand hover:underline">← Back to login</Link></div>
      </div>
    </div>
  );
}
