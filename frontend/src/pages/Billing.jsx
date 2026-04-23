import React, { useEffect, useState } from "react";
import { api, unwrap } from "@/api/client";
import { EP } from "@/api/endpoints";
import { PageHeader } from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreditCard, Plus } from "lucide-react";
import { toast } from "sonner";

const ADMIN_ROLES = ["SuperAdmin","BuildingAdmin"];

export default function Billing() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([
      api.get(EP.billing.list).then(r => unwrap(r) || []).catch(() => []),
      ADMIN_ROLES.includes(user.role) ? api.get(EP.billing.summary).then(r => unwrap(r)).catch(() => null) : Promise.resolve(null),
    ]).then(([bills, sum]) => { setRows(bills); setSummary(sum); setLoading(false); });
  };
  useEffect(load, [user.role]);

  const createBill = async (e) => {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(e.target).entries());
    try {
      await api.post(EP.billing.list, body);
      toast.success("Bill created"); setOpen(false); load();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  const pay = async (bill) => {
    try {
      await api.post(EP.billing.pay(bill.billId), { paymentMethod: "Stripe", transactionRef: "pi_demo_" + Date.now(), amount: bill.totalAmount });
      toast.success("Payment successful");
      setPayOpen(null); load();
    } catch (err) { toast.error(err.response?.data?.message || "Payment failed"); }
  };

  return (
    <div className="space-y-8" data-testid="billing-page">
      <PageHeader
        eyebrow="Finance"
        title="Billing"
        description="Invoices, maintenance, utilities & payments."
        actions={ADMIN_ROLES.includes(user.role) && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><button className="btn-primary" data-testid="create-bill-btn"><Plus className="w-4 h-4"/> New Bill</button></DialogTrigger>
            <DialogContent className="rounded-none sm:max-w-lg">
              <DialogHeader><DialogTitle className="font-display text-2xl">Issue Bill</DialogTitle></DialogHeader>
              <form onSubmit={createBill} className="grid sm:grid-cols-2 gap-4" data-testid="bill-form">
                <div><label className="bms-label">Bill Type</label>
                  <select name="billType" className="bms-input"><option>Maintenance</option><option>Electricity</option><option>Water</option><option>Other</option></select>
                </div>
                <div><label className="bms-label">Bill Month</label><input type="date" name="billMonth" className="bms-input" required/></div>
                <div><label className="bms-label">Amount</label><input type="number" step="0.01" name="amount" className="bms-input" required/></div>
                <div><label className="bms-label">Tax</label><input type="number" step="0.01" name="taxAmount" className="bms-input" defaultValue="0"/></div>
                <div className="sm:col-span-2"><label className="bms-label">Due Date</label><input type="date" name="dueDate" className="bms-input" required/></div>
                <div><label className="bms-label">Unit ID</label><input name="unitId" className="bms-input" placeholder="un-1"/></div>
                <div><label className="bms-label">User ID</label><input name="userId" className="bms-input" placeholder="u-3"/></div>
                <button className="btn-primary sm:col-span-2 h-12">Issue Bill</button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      />

      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bms-card p-6"><div className="eyebrow">Collected</div><div className="font-display text-3xl mt-2">${(summary.totalCollected||0).toLocaleString()}</div></div>
          <div className="bms-card p-6"><div className="eyebrow">Pending</div><div className="font-display text-3xl mt-2 text-safety">${(summary.totalPending||0).toLocaleString()}</div></div>
          <div className="bms-card p-6"><div className="eyebrow">Paid Invoices</div><div className="font-display text-3xl mt-2">{summary.countPaid||0}</div></div>
          <div className="bms-card p-6"><div className="eyebrow">Pending Invoices</div><div className="font-display text-3xl mt-2">{summary.countPending||0}</div></div>
        </div>
      )}

      <DataTable
        rowKey="billId"
        loading={loading}
        rows={rows}
        searchableKeys={["billType","status"]}
        testId="billing-table"
        columns={[
          { key: "billId", label: "Invoice", render: (r) => <span className="font-mono text-xs text-slate-600">#{r.billId?.slice(0,8)}</span> },
          { key: "billType", label: "Type" },
          { key: "billMonth", label: "Month", render: (r) => (r.billMonth || "").slice(0,7) },
          { key: "totalAmount", label: "Amount", render: (r) => <span className="font-display font-medium">${Number(r.totalAmount || 0).toFixed(2)}</span> },
          { key: "dueDate", label: "Due", render: (r) => (r.dueDate || "").slice(0,10) },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
          { key: "action", label: "", render: (r) => r.status !== "Paid" ? (
            <button className="btn-primary h-8 px-3 text-xs" onClick={() => setPayOpen(r)} data-testid={`pay-btn-${r.billId}`}><CreditCard className="w-3 h-3"/> Pay</button>
          ) : null },
        ]}
      />

      <Dialog open={!!payOpen} onOpenChange={(v) => !v && setPayOpen(null)}>
        <DialogContent className="rounded-none sm:max-w-md">
          <DialogHeader><DialogTitle className="font-display text-2xl">Confirm Payment</DialogTitle></DialogHeader>
          {payOpen && (
            <div className="space-y-4">
              <div className="border border-slate-200 p-4">
                <div className="eyebrow">Amount Due</div>
                <div className="font-display text-4xl font-light mt-2">${Number(payOpen.totalAmount).toFixed(2)}</div>
                <div className="text-xs text-slate-500 mt-2 font-mono">Invoice #{payOpen.billId?.slice(0,8)} · {payOpen.billType}</div>
              </div>
              <div className="text-xs text-slate-500">Payment will be processed through Stripe (demo transaction reference will be generated).</div>
              <button className="btn-primary w-full h-12" onClick={() => pay(payOpen)} data-testid="confirm-pay-btn">Pay Now</button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
