// In-memory mock adapter for axios. Enabled when localStorage "bms_demo_mode" === "true".
// Lets the entire app be explorable without a live BMS backend.
import { v4 as uuid } from "./uuid";

const LS_KEY = "bms_mock_db_v1";

const seed = () => ({
  users: [
    { userId: "u-1", email: "superadmin@bms.com", password: "Admin@123", firstName: "Alex", lastName: "Reeves", role: "SuperAdmin", phone: "+1-555-0001", isActive: true, createdAt: new Date().toISOString() },
    { userId: "u-2", email: "admin@bms.com", password: "Admin@123", firstName: "Priya", lastName: "Kapoor", role: "BuildingAdmin", buildingId: "b-1", phone: "+1-555-0002", isActive: true, createdAt: new Date().toISOString() },
    { userId: "u-3", email: "resident@bms.com", password: "Admin@123", firstName: "Jordan", lastName: "Chen", role: "Resident", buildingId: "b-1", unitId: "un-1", phone: "+1-555-0003", isActive: true, createdAt: new Date().toISOString() },
    { userId: "u-4", email: "security@bms.com", password: "Admin@123", firstName: "Marco", lastName: "Diaz", role: "SecurityStaff", buildingId: "b-1", isActive: true, createdAt: new Date().toISOString() },
  ],
  buildings: [
    { buildingId: "b-1", buildingName: "Sunset Apartments", buildingType: "Residential", address: "123 Main St", city: "New York", state: "NY", zipCode: "10001", totalUnits: 48, isActive: true, createdAt: new Date().toISOString() },
    { buildingId: "b-2", buildingName: "Harbor View Tower", buildingType: "Mixed", address: "45 Harbor Rd", city: "Boston", state: "MA", zipCode: "02101", totalUnits: 72, isActive: true, createdAt: new Date().toISOString() },
  ],
  wings: [
    { wingId: "w-1", buildingId: "b-1", wingName: "A Wing", totalFloors: 8 },
    { wingId: "w-2", buildingId: "b-1", wingName: "B Wing", totalFloors: 8 },
  ],
  units: [
    { unitId: "un-1", buildingId: "b-1", wingId: "w-1", unitNumber: "A-501", floor: 5, unitType: "2BHK", area: 980, status: "Occupied" },
    { unitId: "un-2", buildingId: "b-1", wingId: "w-1", unitNumber: "A-502", floor: 5, unitType: "3BHK", area: 1240, status: "Vacant" },
    { unitId: "un-3", buildingId: "b-1", wingId: "w-2", unitNumber: "B-302", floor: 3, unitType: "1BHK", area: 620, status: "Occupied" },
  ],
  bills: [
    { billId: "bl-1", buildingId: "b-1", unitId: "un-1", userId: "u-3", billType: "Maintenance", billMonth: "2026-02-01", amount: 350, taxAmount: 28, totalAmount: 378, dueDate: "2026-02-28", status: "Pending", createdAt: new Date().toISOString() },
    { billId: "bl-2", buildingId: "b-1", unitId: "un-1", userId: "u-3", billType: "Electricity", billMonth: "2026-01-01", amount: 124, taxAmount: 10, totalAmount: 134, dueDate: "2026-01-28", status: "Paid", createdAt: new Date().toISOString() },
  ],
  parkingSlots: [
    { slotId: "ps-1", buildingId: "b-1", slotNumber: "P-001", slotType: "Car", floor: "B1", status: "Available" },
    { slotId: "ps-2", buildingId: "b-1", slotNumber: "P-002", slotType: "Car", floor: "B1", status: "Occupied" },
    { slotId: "ps-3", buildingId: "b-1", slotNumber: "P-003", slotType: "Bike", floor: "B1", status: "Available" },
    { slotId: "ps-4", buildingId: "b-1", slotNumber: "P-004", slotType: "Car", floor: "B2", status: "Available" },
  ],
  parkingBookings: [],
  visitors: [
    { visitorId: "v-1", buildingId: "b-1", userId: "u-3", visitorName: "John Smith", visitorPhone: "+1-555-1234", purpose: "Meeting", visitorType: "Personal", expectedArrival: new Date().toISOString(), status: "Expected", createdAt: new Date().toISOString() },
  ],
  canteenMenu: [
    { menuId: "m-1", itemName: "Grilled Sandwich", category: "Main", price: 6.5, isAvailable: true, description: "Multigrain, cheese, tomato" },
    { menuId: "m-2", itemName: "Caesar Salad", category: "Salad", price: 7.25, isAvailable: true, description: "Romaine, parmesan, croutons" },
    { menuId: "m-3", itemName: "Espresso", category: "Beverage", price: 2.75, isAvailable: true, description: "Double shot" },
    { menuId: "m-4", itemName: "Margherita Pizza", category: "Main", price: 9.0, isAvailable: false, description: "Wood-fired" },
  ],
  canteenOrders: [],
  complaints: [
    { complaintId: "c-1", buildingId: "b-1", userId: "u-3", title: "Leaking tap", description: "Kitchen tap leaks continuously.", category: "Plumbing", priority: "Medium", status: "Open", createdAt: new Date().toISOString() },
  ],
  polls: [
    { pollId: "pl-1", buildingId: "b-1", title: "New gym equipment vote", description: "Select your preferred vendor.", status: "Active", createdAt: new Date().toISOString(), closesAt: new Date(Date.now()+7*864e5).toISOString(), options: [{ optionId: "op-1", text: "Vendor A", votes: 12 }, { optionId: "op-2", text: "Vendor B", votes: 8 }, { optionId: "op-3", text: "Vendor C", votes: 5 }] },
  ],
  notices: [
    { noticeId: "n-1", buildingId: "b-1", title: "Water supply interruption", content: "Scheduled maintenance on Saturday 10am-2pm.", category: "Maintenance", priority: "High", createdAt: new Date().toISOString() },
  ],
});

const load = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) {
      const s = seed();
      localStorage.setItem(LS_KEY, JSON.stringify(s));
      return s;
    }
    return JSON.parse(raw);
  } catch { return seed(); }
};
const save = (db) => localStorage.setItem(LS_KEY, JSON.stringify(db));

const ok = (data) => ({ data: { success: true, data }, status: 200, statusText: "OK", headers: {}, config: {} });
const bad = (msg, status=400) => { const e = new Error(msg); e.response = { status, data: { success: false, message: msg } }; throw e; };

const match = (url, pattern) => {
  const re = new RegExp("^" + pattern.replace(/:[a-z]+/gi, "([^/]+)") + "/?$");
  const m = url.match(re);
  return m ? m.slice(1) : null;
};

export const isDemo = () => localStorage.getItem("bms_demo_mode") === "true";

export async function mockAdapter(config) {
  const db = load();
  const url = config.url.replace(/^.*\/api/, "");
  const method = (config.method || "get").toLowerCase();
  const body = config.data ? (typeof config.data === "string" ? JSON.parse(config.data) : config.data) : {};
  await new Promise(r => setTimeout(r, 180));

  // AUTH
  if (url === "/auth/login" && method === "post") {
    const u = db.users.find(x => x.email === body.email && x.password === body.password && x.isActive);
    if (!u) bad("Invalid credentials", 401);
    const { password, ...safe } = u;
    return ok({ user: safe, accessToken: "demo." + u.userId, refreshToken: "demo.r." + u.userId });
  }
  if (url === "/auth/register" && method === "post") {
    if (db.users.some(x => x.email === body.email)) bad("Email already registered", 409);
    const user = { userId: uuid(), isActive: true, createdAt: new Date().toISOString(), role: body.role || "Resident", ...body };
    db.users.push(user); save(db);
    const { password, ...safe } = user;
    return ok({ user: safe, accessToken: "demo." + user.userId, refreshToken: "demo.r." + user.userId });
  }
  if (url === "/auth/me" && method === "get") {
    const token = (config.headers?.Authorization || "").replace("Bearer ", "");
    const id = token.replace("demo.", "");
    const u = db.users.find(x => x.userId === id);
    if (!u) bad("Unauthorized", 401);
    const { password, ...safe } = u;
    return ok(safe);
  }
  if (url === "/auth/change-password" && method === "put") return ok({ updated: true });
  if (url === "/auth/forgot-password" && method === "post") return ok({ sent: true });
  if (url === "/auth/refresh" && method === "post") return ok({ accessToken: body.refreshToken?.replace("demo.r.", "demo.") });

  // DASHBOARDS
  if (url === "/dashboard/super-admin" && method === "get") {
    return ok({ totalBuildings: db.buildings.length, totalUsers: db.users.length, totalUnits: db.units.length, openComplaints: db.complaints.filter(c=>c.status!=="Resolved").length, pendingBills: db.bills.filter(b=>b.status!=="Paid").length, recentActivity: db.notices.slice(0,5) });
  }
  if (url === "/dashboard/building-admin" && method === "get") {
    return ok({ occupancy: 76, openComplaints: db.complaints.filter(c=>c.status!=="Resolved").length, pendingBills: db.bills.filter(b=>b.status!=="Paid").length, visitorsToday: db.visitors.length, revenueThisMonth: 28400 });
  }
  if (url === "/dashboard/resident" && method === "get") {
    return ok({ pendingBills: db.bills.filter(b=>b.status!=="Paid").length, activeComplaints: db.complaints.filter(c=>c.status!=="Resolved").length, upcomingVisitors: db.visitors.length, myParking: 1 });
  }

  // BUILDINGS
  if (url === "/buildings" && method === "get") return ok(db.buildings);
  if (url === "/buildings" && method === "post") { const b = { buildingId: uuid(), isActive: true, createdAt: new Date().toISOString(), totalUnits: 0, ...body }; db.buildings.push(b); save(db); return ok(b); }
  let m;
  if ((m = match(url, "/buildings/:id")) && method === "get") { const b = db.buildings.find(x=>x.buildingId===m[0]); return b ? ok(b) : bad("Not found", 404); }
  if ((m = match(url, "/buildings/:id")) && method === "put") { const i = db.buildings.findIndex(x=>x.buildingId===m[0]); if (i<0) bad("Not found",404); db.buildings[i] = { ...db.buildings[i], ...body }; save(db); return ok(db.buildings[i]); }
  if ((m = match(url, "/buildings/:id")) && method === "delete") { const i = db.buildings.findIndex(x=>x.buildingId===m[0]); if (i<0) bad("Not found",404); db.buildings[i].isActive=false; save(db); return ok({ deactivated:true }); }
  if ((m = match(url, "/buildings/:id/wings")) && method === "get") return ok(db.wings.filter(w=>w.buildingId===m[0]));
  if ((m = match(url, "/buildings/:id/wings")) && method === "post") { const w = { wingId: uuid(), buildingId: m[0], ...body }; db.wings.push(w); save(db); return ok(w); }
  if ((m = match(url, "/buildings/:id/units")) && method === "get") return ok(db.units.filter(u=>u.buildingId===m[0]));
  if ((m = match(url, "/buildings/:id/units")) && method === "post") { const u = { unitId: uuid(), buildingId: m[0], status: "Vacant", ...body }; db.units.push(u); save(db); return ok(u); }

  // USERS
  if (url === "/users" && method === "get") return ok(db.users.map(({password, ...u}) => u));
  if (url === "/users" && method === "post") { const u = { userId: uuid(), isActive:true, createdAt: new Date().toISOString(), password: "Admin@123", ...body }; db.users.push(u); save(db); const { password, ...safe } = u; return ok(safe); }
  if ((m = match(url, "/users/:id")) && method === "get") { const u = db.users.find(x=>x.userId===m[0]); const { password, ...safe } = u||{}; return u ? ok(safe) : bad("Not found",404); }
  if ((m = match(url, "/users/:id")) && method === "put") { const i = db.users.findIndex(x=>x.userId===m[0]); if(i<0) bad("Not found",404); db.users[i] = { ...db.users[i], ...body }; save(db); const {password, ...safe} = db.users[i]; return ok(safe); }
  if ((m = match(url, "/users/:id")) && method === "delete") { const i = db.users.findIndex(x=>x.userId===m[0]); if(i<0) bad("Not found",404); db.users[i].isActive=false; save(db); return ok({ deactivated:true }); }

  // BILLING
  if (url === "/billing/summary" && method === "get") return ok({ totalCollected: db.bills.filter(b=>b.status==="Paid").reduce((a,b)=>a+b.totalAmount,0), totalPending: db.bills.filter(b=>b.status!=="Paid").reduce((a,b)=>a+b.totalAmount,0), countPaid: db.bills.filter(b=>b.status==="Paid").length, countPending: db.bills.filter(b=>b.status!=="Paid").length });
  if (url === "/billing" && method === "get") return ok(db.bills);
  if (url === "/billing" && method === "post") { const b = { billId: uuid(), status: "Pending", createdAt: new Date().toISOString(), totalAmount: (parseFloat(body.amount)||0)+(parseFloat(body.taxAmount)||0), ...body }; db.bills.push(b); save(db); return ok(b); }
  if ((m = match(url, "/billing/:id")) && method === "get") { const b = db.bills.find(x=>x.billId===m[0]); return b ? ok(b) : bad("Not found",404); }
  if ((m = match(url, "/billing/:id/pay")) && method === "post") { const i = db.bills.findIndex(x=>x.billId===m[0]); if(i<0) bad("Not found",404); db.bills[i].status = "Paid"; db.bills[i].paidAt = new Date().toISOString(); save(db); return ok(db.bills[i]); }

  // PARKING
  if (url === "/parking/slots" && method === "get") return ok(db.parkingSlots);
  if (url === "/parking/slots" && method === "post") { const s = { slotId: uuid(), status: "Available", ...body }; db.parkingSlots.push(s); save(db); return ok(s); }
  if (url === "/parking/bookings" && method === "get") return ok(db.parkingBookings);
  if (url === "/parking/book" && method === "post") { const b = { bookingId: uuid(), status: "Active", createdAt: new Date().toISOString(), ...body }; db.parkingBookings.push(b); const i = db.parkingSlots.findIndex(s=>s.slotId===body.slotId); if(i>=0) db.parkingSlots[i].status="Occupied"; save(db); return ok(b); }
  if ((m = match(url, "/parking/bookings/:id/cancel")) && method === "put") { const i = db.parkingBookings.findIndex(x=>x.bookingId===m[0]); if(i<0) bad("Not found",404); db.parkingBookings[i].status="Cancelled"; const si = db.parkingSlots.findIndex(s=>s.slotId===db.parkingBookings[i].slotId); if(si>=0) db.parkingSlots[si].status="Available"; save(db); return ok(db.parkingBookings[i]); }

  // VISITORS
  if (url === "/visitors" && method === "get") return ok(db.visitors);
  if (url === "/visitors" && method === "post") { const v = { visitorId: uuid(), status:"Expected", createdAt: new Date().toISOString(), qrCode: "data:image/svg+xml;base64,"+btoa('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="120" height="120" fill="#0043CE"/><text x="50%" y="50%" fill="#fff" font-size="12" text-anchor="middle" dy=".3em">QR '+uuid().slice(0,4)+'</text></svg>'), ...body }; db.visitors.push(v); save(db); return ok(v); }
  if (url === "/visitors/report" && method === "get") return ok({ today: db.visitors.length, thisWeek: db.visitors.length, thisMonth: db.visitors.length });
  if ((m = match(url, "/visitors/:id/checkin")) && method === "post") { const i = db.visitors.findIndex(x=>x.visitorId===m[0]); if(i<0) bad("Not found",404); db.visitors[i].status="CheckedIn"; db.visitors[i].checkinTime=new Date().toISOString(); save(db); return ok(db.visitors[i]); }
  if ((m = match(url, "/visitors/:id/checkout")) && method === "post") { const i = db.visitors.findIndex(x=>x.visitorId===m[0]); if(i<0) bad("Not found",404); db.visitors[i].status="CheckedOut"; db.visitors[i].checkoutTime=new Date().toISOString(); save(db); return ok(db.visitors[i]); }

  // CANTEEN
  if (url === "/canteen/menu" && method === "get") return ok(db.canteenMenu);
  if (url === "/canteen/menu" && method === "post") { const m2 = { menuId: uuid(), isAvailable:true, ...body }; db.canteenMenu.push(m2); save(db); return ok(m2); }
  if ((m = match(url, "/canteen/menu/:id")) && method === "put") { const i = db.canteenMenu.findIndex(x=>x.menuId===m[0]); if(i<0) bad("Not found",404); db.canteenMenu[i]={...db.canteenMenu[i], ...body}; save(db); return ok(db.canteenMenu[i]); }
  if (url === "/canteen/orders" && method === "get") return ok(db.canteenOrders);
  if (url === "/canteen/orders" && method === "post") { const items = (body.items||[]).map(it=>{ const mi = db.canteenMenu.find(m=>m.menuId===it.menuId); return { ...it, itemName: mi?.itemName, price: mi?.price, lineTotal: (mi?.price||0)*it.quantity }; }); const total = items.reduce((a,b)=>a+b.lineTotal,0); const o = { orderId: uuid(), status:"Placed", createdAt: new Date().toISOString(), items, totalAmount: total, ...body }; db.canteenOrders.push(o); save(db); return ok(o); }
  if ((m = match(url, "/canteen/orders/:id/status")) && method === "put") { const i = db.canteenOrders.findIndex(x=>x.orderId===m[0]); if(i<0) bad("Not found",404); db.canteenOrders[i].status=body.status; save(db); return ok(db.canteenOrders[i]); }

  // COMPLAINTS
  if (url === "/complaints" && method === "get") return ok(db.complaints);
  if (url === "/complaints" && method === "post") { const c = { complaintId: uuid(), status:"Open", createdAt: new Date().toISOString(), ...body }; db.complaints.push(c); save(db); return ok(c); }
  if ((m = match(url, "/complaints/:id/assign")) && method === "put") { const i = db.complaints.findIndex(x=>x.complaintId===m[0]); if(i<0) bad("Not found",404); db.complaints[i].assignedTo = body.assignedTo; db.complaints[i].status = "Assigned"; save(db); return ok(db.complaints[i]); }
  if ((m = match(url, "/complaints/:id/status")) && method === "put") { const i = db.complaints.findIndex(x=>x.complaintId===m[0]); if(i<0) bad("Not found",404); db.complaints[i].status=body.status; save(db); return ok(db.complaints[i]); }
  if ((m = match(url, "/complaints/:id/feedback")) && method === "post") { const i = db.complaints.findIndex(x=>x.complaintId===m[0]); if(i<0) bad("Not found",404); db.complaints[i].rating=body.rating; db.complaints[i].feedback=body.feedback; save(db); return ok(db.complaints[i]); }

  // VOTING
  if (url === "/voting" && method === "get") return ok(db.polls);
  if (url === "/voting" && method === "post") { const p = { pollId: uuid(), status:"Active", createdAt: new Date().toISOString(), options: (body.options||[]).map(t=>({ optionId: uuid(), text:t, votes:0 })), ...body, options: (body.options||[]).map(t=>({ optionId: uuid(), text:t, votes:0 })) }; db.polls.push(p); save(db); return ok(p); }
  if ((m = match(url, "/voting/:id")) && method === "get") { const p = db.polls.find(x=>x.pollId===m[0]); return p ? ok(p) : bad("Not found",404); }
  if ((m = match(url, "/voting/:id/vote")) && method === "post") { const i = db.polls.findIndex(x=>x.pollId===m[0]); if(i<0) bad("Not found",404); const oi = db.polls[i].options.findIndex(o=>o.optionId===body.optionId); if(oi<0) bad("Option not found",404); db.polls[i].options[oi].votes++; save(db); return ok(db.polls[i]); }
  if ((m = match(url, "/voting/:id/close")) && method === "put") { const i = db.polls.findIndex(x=>x.pollId===m[0]); if(i<0) bad("Not found",404); db.polls[i].status="Closed"; save(db); return ok(db.polls[i]); }

  // NOTICES
  if (url === "/notices" && method === "get") return ok(db.notices);
  if (url === "/notices" && method === "post") { const n = { noticeId: uuid(), createdAt: new Date().toISOString(), ...body }; db.notices.unshift(n); save(db); return ok(n); }
  if ((m = match(url, "/notices/:id")) && method === "put") { const i = db.notices.findIndex(x=>x.noticeId===m[0]); if(i<0) bad("Not found",404); db.notices[i] = { ...db.notices[i], ...body }; save(db); return ok(db.notices[i]); }
  if ((m = match(url, "/notices/:id")) && method === "delete") { const i = db.notices.findIndex(x=>x.noticeId===m[0]); if(i<0) bad("Not found",404); db.notices.splice(i,1); save(db); return ok({ deleted:true }); }

  bad("Not implemented in demo mode: " + method.toUpperCase() + " " + url, 404);
}

export function resetMockDb() { localStorage.removeItem(LS_KEY); load(); }
