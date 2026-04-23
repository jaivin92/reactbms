import React, { useEffect, useState } from "react";
import { api, unwrap } from "@/api/client";
import { EP } from "@/api/endpoints";
import { PageHeader } from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import { CarFront, Bike } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Parking() {
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    Promise.all([
      api.get(EP.parking.slots).then(r => unwrap(r) || []).catch(() => []),
      api.get(EP.parking.bookings).then(r => unwrap(r) || []).catch(() => []),
    ]).then(([s, b]) => { setSlots(s); setBookings(b); setLoading(false); });
  };
  useEffect(load, []);

  const book = async (slot) => {
    try {
      await api.post(EP.parking.book, { slotId: slot.slotId, startTime: new Date().toISOString(), endTime: new Date(Date.now()+3600000).toISOString() });
      toast.success(`Booked ${slot.slotNumber}`); load();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  const cancel = async (b) => {
    try { await api.put(EP.parking.cancel(b.bookingId)); toast.success("Cancelled"); load(); }
    catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  const floors = [...new Set(slots.map(s => s.floor))].sort();

  return (
    <div className="space-y-8" data-testid="parking-page">
      <PageHeader eyebrow="Mobility" title="Parking" description="Real-time slot availability. Tap an available slot to reserve." />

      {loading ? <div className="bms-card h-64 animate-pulse" /> : (
        <>
          <div className="space-y-6">
            {floors.map(floor => (
              <div key={floor} className="bms-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div><div className="eyebrow">Floor</div><div className="font-display text-2xl mt-1">{floor}</div></div>
                  <div className="font-mono text-xs text-slate-500">{slots.filter(s=>s.floor===floor && s.status==="Available").length} / {slots.filter(s=>s.floor===floor).length} available</div>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
                  {slots.filter(s => s.floor === floor).map(slot => (
                    <button
                      key={slot.slotId}
                      disabled={slot.status !== "Available"}
                      onClick={() => book(slot)}
                      data-testid={`slot-${slot.slotNumber}`}
                      className={cn(
                        "aspect-square border-2 flex flex-col items-center justify-center gap-1 transition-all",
                        slot.status === "Available" && "border-emerald-500 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 cursor-pointer",
                        slot.status === "Occupied" && "border-safety bg-orange-50 text-safety cursor-not-allowed opacity-70",
                      )}>
                      {slot.slotType === "Bike" ? <Bike className="w-5 h-5"/> : <CarFront className="w-5 h-5"/>}
                      <div className="font-mono text-[11px] font-bold">{slot.slotNumber}</div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bms-card">
            <div className="p-4 border-b border-slate-200 eyebrow">My Bookings</div>
            {bookings.length === 0 ? (
              <div className="p-8 text-sm text-slate-500 text-center">No active bookings.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {bookings.map(b => (
                  <div key={b.bookingId} className="p-4 flex items-center justify-between" data-testid={`booking-${b.bookingId}`}>
                    <div>
                      <div className="font-medium">Slot {slots.find(s=>s.slotId===b.slotId)?.slotNumber || b.slotId?.slice(0,8)}</div>
                      <div className="text-xs text-slate-500 font-mono">{(b.startTime||"").slice(0,16)}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={b.status} />
                      {b.status === "Active" && <button className="btn-secondary h-8 px-3 text-xs" onClick={() => cancel(b)}>Cancel</button>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
