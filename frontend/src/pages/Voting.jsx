import React, { useEffect, useState } from "react";
import { api, unwrap } from "@/api/client";
import { EP } from "@/api/endpoints";
import { PageHeader } from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Vote as VoteIcon, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const ADMIN_ROLES = ["SuperAdmin","BuildingAdmin"];

export default function Voting() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [optsText, setOptsText] = useState("");

  const load = () => {
    setLoading(true);
    api.get(EP.voting.list).then(r => setRows(unwrap(r) || [])).catch(()=>setRows([])).finally(()=>setLoading(false));
  };
  useEffect(load, []);

  const submit = async (e) => {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(e.target).entries());
    body.options = optsText.split("\n").map(s=>s.trim()).filter(Boolean);
    try { await api.post(EP.voting.list, body); toast.success("Poll created"); setOpen(false); setOptsText(""); load(); }
    catch(err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  const vote = async (pollId, optionId) => {
    try { await api.post(EP.voting.vote(pollId), { optionId }); toast.success("Vote recorded"); load(); }
    catch(err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  const close = async (pollId) => {
    try { await api.put(EP.voting.close(pollId)); toast.success("Poll closed"); load(); } catch { toast.error("Failed"); }
  };

  return (
    <div className="space-y-8" data-testid="voting-page">
      <PageHeader
        eyebrow="Community"
        title="Voting & Polls"
        description="Collective decisions made transparent. Create, vote, and see live results."
        actions={ADMIN_ROLES.includes(user.role) && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><button className="btn-primary" data-testid="create-poll-btn"><Plus className="w-4 h-4"/> New Poll</button></DialogTrigger>
            <DialogContent className="rounded-none sm:max-w-lg">
              <DialogHeader><DialogTitle className="font-display text-2xl">Create Poll</DialogTitle></DialogHeader>
              <form onSubmit={submit} className="space-y-4" data-testid="poll-form">
                <div><label className="bms-label">Title</label><input required name="title" className="bms-input" data-testid="poll-title"/></div>
                <div><label className="bms-label">Description</label><textarea name="description" rows={3} className="bms-input h-auto py-2" data-testid="poll-desc"/></div>
                <div><label className="bms-label">Options (one per line)</label><textarea required rows={5} className="bms-input h-auto py-2 font-mono text-sm" value={optsText} onChange={(e)=>setOptsText(e.target.value)} placeholder="Option A&#10;Option B&#10;Option C" data-testid="poll-options"/></div>
                <div><label className="bms-label">Closes at</label><input type="datetime-local" name="closesAt" className="bms-input" data-testid="poll-closes"/></div>
                <button className="btn-primary w-full h-12">Publish Poll</button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      />

      {loading ? <div className="bms-card h-40 animate-pulse"/> :
        rows.length === 0 ? <EmptyState icon={VoteIcon} title="No polls active" description="Polls you create will appear here." /> :
        <div className="grid md:grid-cols-2 gap-4">
          {rows.map(p => {
            const total = (p.options || []).reduce((a,o)=>a+o.votes,0) || 1;
            return (
              <div key={p.pollId} className="bms-card p-6" data-testid={`poll-${p.pollId}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="eyebrow">Poll</div>
                    <h3 className="font-display text-xl mt-1">{p.title}</h3>
                    {p.description && <p className="text-sm text-slate-600 mt-1">{p.description}</p>}
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                <div className="mt-6 space-y-3">
                  {(p.options || []).map(o => {
                    const pct = Math.round((o.votes / total) * 100);
                    return (
                      <button
                        key={o.optionId}
                        onClick={() => p.status === "Active" && vote(p.pollId, o.optionId)}
                        disabled={p.status !== "Active"}
                        data-testid={`vote-${p.pollId}-${o.optionId}`}
                        className="w-full text-left relative border border-slate-200 p-3 hover:border-brand transition disabled:cursor-not-allowed"
                      >
                        <div className="absolute left-0 top-0 bottom-0 bg-brand-50" style={{ width: `${pct}%` }} />
                        <div className="relative flex items-center justify-between">
                          <span className="text-sm font-medium">{o.text}</span>
                          <span className="font-mono text-xs text-brand">{o.votes} · {pct}%</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-500">{total} votes total</span>
                  {ADMIN_ROLES.includes(user.role) && p.status === "Active" && (
                    <button className="text-safety hover:underline flex items-center gap-1" onClick={()=>close(p.pollId)} data-testid={`close-${p.pollId}`}><X className="w-3 h-3"/> Close poll</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      }
    </div>
  );
}
