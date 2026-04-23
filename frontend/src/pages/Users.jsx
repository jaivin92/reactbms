import React, { useEffect, useState } from "react";
import { api, unwrap } from "@/api/client";
import { EP } from "@/api/endpoints";
import { PageHeader } from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const ROLES = ["SuperAdmin","BuildingAdmin","SecurityStaff","MaintenanceStaff","CanteenStaff","Resident","Tenant"];

export default function Users() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const load = () => {
    setLoading(true);
    api.get(EP.users.list).then((r) => setRows(unwrap(r) || [])).catch(() => setRows([])).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(e.target).entries());
    try {
      await api.post(EP.users.list, body);
      toast.success("User created");
      setOpen(false); load();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  return (
    <div className="space-y-8" data-testid="users-page">
      <PageHeader
        eyebrow="Directory"
        title="Users"
        description="Admins, staff, residents & tenants — all your accounts in one directory."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><button className="btn-primary" data-testid="create-user-btn"><Plus className="w-4 h-4"/> New User</button></DialogTrigger>
            <DialogContent className="rounded-none sm:max-w-lg">
              <DialogHeader><DialogTitle className="font-display text-2xl">Invite User</DialogTitle></DialogHeader>
              <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4" data-testid="user-form">
                <div><label className="bms-label">First name</label><input required name="firstName" className="bms-input" data-testid="user-firstname"/></div>
                <div><label className="bms-label">Last name</label><input required name="lastName" className="bms-input" data-testid="user-lastname"/></div>
                <div className="sm:col-span-2"><label className="bms-label">Email</label><input required type="email" name="email" className="bms-input" data-testid="user-email"/></div>
                <div><label className="bms-label">Phone</label><input name="phone" className="bms-input" data-testid="user-phone"/></div>
                <div><label className="bms-label">Role</label>
                  <select name="role" className="bms-input" data-testid="user-role">
                    {ROLES.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <button className="btn-primary sm:col-span-2 h-12" data-testid="user-submit">Create User</button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />
      <DataTable
        rowKey="userId"
        loading={loading}
        rows={rows}
        searchableKeys={["firstName","lastName","email","role"]}
        testId="users-table"
        columns={[
          { key: "name", label: "Name", render: (r) => (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-slate-900 text-white flex items-center justify-center font-display text-sm">{r.firstName?.[0]}{r.lastName?.[0]}</div>
              <div><div className="font-medium text-slate-900">{r.firstName} {r.lastName}</div><div className="text-xs text-slate-500">{r.email}</div></div>
            </div>
          )},
          { key: "role", label: "Role", render: (r) => <span className="font-mono text-xs tracking-wider uppercase text-brand">{r.role}</span> },
          { key: "phone", label: "Phone", render: (r) => r.phone || <span className="text-slate-400">—</span> },
          { key: "isActive", label: "Status", render: (r) => <StatusBadge status={r.isActive ? "Active" : "Inactive"} /> },
        ]}
      />
    </div>
  );
}
