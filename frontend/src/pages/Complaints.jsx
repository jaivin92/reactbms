import React, { useEffect, useState } from "react";
import { api, unwrap } from "@/api/client";
import { EP } from "@/api/endpoints";
import { PageHeader } from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Wrench, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const STAFF_ROLES = ["SuperAdmin","BuildingAdmin","MaintenanceStaff"];
const STATUSES = ["Open","Assigned","InProgress","Resolved","Closed"];

export default function Complaints() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const load = () => {
    setLoading(true);
    api.get(EP.complaints.list).then(r => setRows(unwrap(r) || [])).catch(()=>setRows([])).finally(()=>setLoading(false));
  };
  useEffect(load, []);

  const submit = async (e) => {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(e.target).entries());
    try { await api.post(EP.complaints.list, body); toast.success("Complaint raised"); setOpen(false); load(); }
    catch(err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  const updateStatus = async (c, status) => {
    try { await api.put(EP.complaints.status(c.complaintId), { status }); toast.success("Status updated"); load(); }
    catch(err) { toast.error("Failed"); }
  };

  const rate = async (c, rating) => {
    try { await api.post(EP.complaints.feedback(c.complaintId), { rating, feedback: "" }); toast.success("Thanks for your feedback"); load(); }
    catch(err) { toast.error("Failed"); }
  };

  return (
    <div className="space-y-8" data-testid="complaints-page">
      <PageHeader
        eyebrow="Maintenance"
        title="Complaints"
        description="Raise, assign, track and close maintenance issues with clarity."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><button className="btn-primary" data-testid="raise-complaint-btn"><Plus className="w-4 h-4"/> Raise Complaint</button></DialogTrigger>
            <DialogContent className="rounded-none sm:max-w-lg">
              <DialogHeader><DialogTitle className="font-display text-2xl">New Complaint</DialogTitle></DialogHeader>
              <form onSubmit={submit} className="space-y-4" data-testid="complaint-form">
                <div><label className="bms-label">Title</label><input required name="title" className="bms-input" data-testid="comp-title"/></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="bms-label">Category</label>
                    <select name="category" className="bms-input" data-testid="comp-category"><option>Plumbing</option><option>Electrical</option><option>Cleaning</option><option>Security</option><option>Other</option></select>
                  </div>
                  <div><label className="bms-label">Priority</label>
                    <select name="priority" className="bms-input" data-testid="comp-priority"><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select>
                  </div>
                </div>
                <div><label className="bms-label">Description</label><textarea required name="description" rows={4} className="bms-input h-auto py-2" data-testid="comp-desc"/></div>
                <button className="btn-primary w-full h-12">Submit</button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {loading ? <div className="bms-card h-40 animate-pulse"/> :
        rows.length === 0 ? <EmptyState icon={Wrench} title="No complaints yet" description="Raise one — we'll route it to the right team." /> :
        <div className="grid md:grid-cols-2 gap-4">
          {rows.map(c => (
            <div key={c.complaintId} className="bms-card p-6 flex flex-col" data-testid={`complaint-${c.complaintId}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="eyebrow">{c.category} · {c.priority}</div>
                  <h3 className="font-display text-xl mt-1">{c.title}</h3>
                </div>
                <StatusBadge status={c.status} />
              </div>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed flex-1">{c.description}</p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="text-xs font-mono text-slate-500">#{c.complaintId?.slice(0,8)}</div>
                <div className="flex items-center gap-2">
                  {STAFF_ROLES.includes(user.role) && c.status !== "Resolved" && c.status !== "Closed" && (
                    <select className="h-8 px-2 border border-slate-300 text-xs rounded-none" value={c.status} onChange={(e)=>updateStatus(c, e.target.value)} data-testid={`status-${c.complaintId}`}>
                      {STATUSES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  )}
                  {(user.role === "Resident" || user.role === "Tenant") && c.status === "Resolved" && !c.rating && (
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map(n => (
                        <button key={n} onClick={() => rate(c, n)} className="p-0.5 hover:scale-110 transition" data-testid={`rate-${c.complaintId}-${n}`}>
                          <Star className="w-4 h-4 text-amber-400" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
}
