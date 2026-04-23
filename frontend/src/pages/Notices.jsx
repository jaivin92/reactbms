import React, { useEffect, useState } from "react";
import { api, unwrap } from "@/api/client";
import { EP } from "@/api/endpoints";
import { PageHeader } from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Megaphone, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const ADMIN_ROLES = ["SuperAdmin","BuildingAdmin"];

export default function Notices() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const canEdit = ADMIN_ROLES.includes(user.role);

  const load = () => { setLoading(true); api.get(EP.notices.list).then(r=>setRows(unwrap(r)||[])).catch(()=>setRows([])).finally(()=>setLoading(false)); };
  useEffect(load, []);

  const submit = async (e) => {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(e.target).entries());
    try { await api.post(EP.notices.list, body); toast.success("Notice published"); setOpen(false); load(); }
    catch(err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  const remove = async (id) => { try { await api.delete(EP.notices.detail(id)); toast.success("Removed"); load(); } catch { toast.error("Failed"); } };

  return (
    <div className="space-y-8" data-testid="notices-page">
      <PageHeader
        eyebrow="Communications"
        title="Notice Board"
        description="Broadcast updates to the entire building."
        actions={canEdit && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><button className="btn-primary" data-testid="create-notice-btn"><Plus className="w-4 h-4"/> Publish</button></DialogTrigger>
            <DialogContent className="rounded-none sm:max-w-lg">
              <DialogHeader><DialogTitle className="font-display text-2xl">Publish Notice</DialogTitle></DialogHeader>
              <form onSubmit={submit} className="space-y-4" data-testid="notice-form">
                <div><label className="bms-label">Title</label><input required name="title" className="bms-input" data-testid="notice-title"/></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="bms-label">Category</label>
                    <select name="category" className="bms-input" data-testid="notice-category"><option>General</option><option>Maintenance</option><option>Event</option><option>Emergency</option></select>
                  </div>
                  <div><label className="bms-label">Priority</label>
                    <select name="priority" className="bms-input" data-testid="notice-priority"><option>Low</option><option>Normal</option><option>High</option></select>
                  </div>
                </div>
                <div><label className="bms-label">Content</label><textarea required name="content" rows={5} className="bms-input h-auto py-2" data-testid="notice-content"/></div>
                <button className="btn-primary w-full h-12">Publish</button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      />

      {loading ? <div className="bms-card h-40 animate-pulse"/> :
        rows.length === 0 ? <EmptyState icon={Megaphone} title="No notices yet" /> :
        <div className="space-y-3">
          {rows.map(n => (
            <article key={n.noticeId} className="bms-card p-6 flex gap-5 group hover:border-brand transition" data-testid={`notice-${n.noticeId}`}>
              <div className="w-1 bg-brand self-stretch" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-brand">{n.category}</span>
                  <span className="text-xs text-slate-500">·</span>
                  <span className="text-xs text-slate-500">{(n.createdAt || "").slice(0,10)}</span>
                  {n.priority === "High" && <span className="text-[11px] uppercase tracking-widest font-bold text-safety">High Priority</span>}
                </div>
                <h3 className="font-display text-2xl mt-2">{n.title}</h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">{n.content}</p>
              </div>
              {canEdit && (
                <button onClick={() => remove(n.noticeId)} className="self-start p-2 text-slate-400 hover:text-safety" data-testid={`delete-notice-${n.noticeId}`}><Trash2 className="w-4 h-4"/></button>
              )}
            </article>
          ))}
        </div>
      }
    </div>
  );
}
