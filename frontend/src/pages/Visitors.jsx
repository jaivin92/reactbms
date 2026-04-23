import React, { useEffect, useState } from "react";
import { api, unwrap } from "@/api/client";
import { EP } from "@/api/endpoints";
import { PageHeader } from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, LogIn, LogOut, QrCode } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const SEC_ROLES = ["SuperAdmin","BuildingAdmin","SecurityStaff"];

export default function Visitors() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [qr, setQr] = useState(null);

  const load = () => {
    setLoading(true);
    api.get(EP.visitors.list).then(r => setRows(unwrap(r) || [])).catch(() => setRows([])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const submit = async (e) => {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(e.target).entries());
    try {
      const res = await api.post(EP.visitors.list, body);
      const v = unwrap(res);
      toast.success("Visitor pre-registered");
      setOpen(false);
      if (v.qrCode) setQr(v);
      load();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  const checkIn = async (v) => { try { await api.post(EP.visitors.checkin(v.visitorId)); toast.success("Checked in"); load(); } catch (e) { toast.error("Failed"); } };
  const checkOut = async (v) => { try { await api.post(EP.visitors.checkout(v.visitorId)); toast.success("Checked out"); load(); } catch (e) { toast.error("Failed"); } };

  return (
    <div className="space-y-8" data-testid="visitors-page">
      <PageHeader
        eyebrow="Security"
        title="Visitors"
        description="Pre-register guests with QR codes, and log check-in / check-out."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><button className="btn-primary" data-testid="register-visitor-btn"><Plus className="w-4 h-4"/> Pre-register</button></DialogTrigger>
            <DialogContent className="rounded-none sm:max-w-lg">
              <DialogHeader><DialogTitle className="font-display text-2xl">Pre-register Visitor</DialogTitle></DialogHeader>
              <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4" data-testid="visitor-form">
                <div className="sm:col-span-2"><label className="bms-label">Visitor Name</label><input required name="visitorName" className="bms-input" data-testid="vis-name"/></div>
                <div><label className="bms-label">Phone</label><input required name="visitorPhone" className="bms-input" data-testid="vis-phone"/></div>
                <div><label className="bms-label">Type</label>
                  <select name="visitorType" className="bms-input" data-testid="vis-type"><option>Personal</option><option>Delivery</option><option>Service</option><option>Business</option></select>
                </div>
                <div className="sm:col-span-2"><label className="bms-label">Purpose</label><input required name="purpose" className="bms-input" data-testid="vis-purpose"/></div>
                <div className="sm:col-span-2"><label className="bms-label">Expected Arrival</label><input required type="datetime-local" name="expectedArrival" className="bms-input" data-testid="vis-arrival"/></div>
                <button className="btn-primary sm:col-span-2 h-12">Generate Pass</button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <DataTable
        rowKey="visitorId"
        loading={loading}
        rows={rows}
        searchableKeys={["visitorName","visitorPhone","purpose","status"]}
        testId="visitors-table"
        columns={[
          { key: "visitorName", label: "Visitor", render: (r) => <div><div className="font-medium text-slate-900">{r.visitorName}</div><div className="text-xs text-slate-500 font-mono">{r.visitorPhone}</div></div>},
          { key: "purpose", label: "Purpose" },
          { key: "visitorType", label: "Type", render: (r) => <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500">{r.visitorType}</span> },
          { key: "expectedArrival", label: "Expected", render: (r) => (r.expectedArrival || "").slice(0,16).replace("T"," ") },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
          { key: "action", label: "", render: (r) => (
            <div className="flex items-center gap-2 justify-end">
              {r.qrCode && <button className="btn-secondary h-8 px-2" onClick={() => setQr(r)} data-testid={`qr-${r.visitorId}`}><QrCode className="w-3.5 h-3.5"/></button>}
              {SEC_ROLES.includes(user.role) && r.status === "Expected" && <button className="btn-primary h-8 px-3 text-xs" onClick={() => checkIn(r)} data-testid={`checkin-${r.visitorId}`}><LogIn className="w-3 h-3"/> In</button>}
              {SEC_ROLES.includes(user.role) && r.status === "CheckedIn" && <button className="btn-danger h-8 px-3 text-xs" onClick={() => checkOut(r)} data-testid={`checkout-${r.visitorId}`}><LogOut className="w-3 h-3"/> Out</button>}
            </div>
          )},
        ]}
      />

      <Dialog open={!!qr} onOpenChange={(v) => !v && setQr(null)}>
        <DialogContent className="rounded-none sm:max-w-sm">
          <DialogHeader><DialogTitle className="font-display text-2xl">Visitor Pass</DialogTitle></DialogHeader>
          {qr && (
            <div className="text-center">
              <div className="eyebrow mb-3">{qr.visitorName}</div>
              {qr.qrCode && <img src={qr.qrCode} alt="QR" className="mx-auto border-2 border-slate-900 p-2 bg-white" />}
              <div className="mt-4 text-xs font-mono text-slate-500">ID: {qr.visitorId?.slice(0,8)}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
