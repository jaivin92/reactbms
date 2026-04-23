import React, { useEffect, useState } from "react";
import { api, unwrap } from "@/api/client";
import { EP } from "@/api/endpoints";
import { PageHeader } from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Building2 } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { toast } from "sonner";

export default function Buildings() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const load = () => {
    setLoading(true);
    api.get(EP.buildings.list).then((r) => setRows(unwrap(r) || [])).catch(() => setRows([])).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const body = Object.fromEntries(f.entries());
    try {
      await api.post(EP.buildings.list, body);
      toast.success("Building created");
      setOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create");
    }
  };

  return (
    <div className="space-y-8" data-testid="buildings-page">
      <PageHeader
        eyebrow="Portfolio"
        title="Buildings"
        description="Your property portfolio — create buildings, manage wings, track units."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="btn-primary" data-testid="create-building-btn"><Plus className="w-4 h-4" /> New Building</button>
            </DialogTrigger>
            <DialogContent className="rounded-none sm:max-w-lg">
              <DialogHeader><DialogTitle className="font-display text-2xl">Register Building</DialogTitle></DialogHeader>
              <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4" data-testid="building-form">
                <div className="sm:col-span-2"><label className="bms-label">Building Name</label><input required name="buildingName" className="bms-input" data-testid="bld-name" /></div>
                <div><label className="bms-label">Type</label>
                  <select name="buildingType" className="bms-input" data-testid="bld-type">
                    <option>Residential</option><option>Commercial</option><option>Mixed</option>
                  </select>
                </div>
                <div><label className="bms-label">Total Units</label><input type="number" name="totalUnits" className="bms-input" data-testid="bld-units" /></div>
                <div className="sm:col-span-2"><label className="bms-label">Address</label><input required name="address" className="bms-input" data-testid="bld-address" /></div>
                <div><label className="bms-label">City</label><input required name="city" className="bms-input" data-testid="bld-city" /></div>
                <div><label className="bms-label">State</label><input required name="state" className="bms-input" data-testid="bld-state" /></div>
                <div><label className="bms-label">Zip</label><input required name="zipCode" className="bms-input" data-testid="bld-zip" /></div>
                <button className="btn-primary sm:col-span-2 h-12" data-testid="bld-submit">Create Building</button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />
      <DataTable
        rowKey="buildingId"
        loading={loading}
        rows={rows}
        searchableKeys={["buildingName", "city", "address"]}
        testId="buildings-table"
        columns={[
          { key: "buildingName", label: "Building", render: (r) => (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-brand-50 text-brand flex items-center justify-center"><Building2 className="w-4 h-4" /></div>
              <div><div className="font-medium text-slate-900">{r.buildingName}</div><div className="text-xs text-slate-500 font-mono">{r.buildingId?.slice(0,8)}</div></div>
            </div>
          )},
          { key: "buildingType", label: "Type" },
          { key: "address", label: "Address", render: (r) => <span>{r.address}, {r.city}</span> },
          { key: "totalUnits", label: "Units" },
          { key: "isActive", label: "Status", render: (r) => <StatusBadge status={r.isActive ? "Active" : "Inactive"} /> },
        ]}
      />
    </div>
  );
}
