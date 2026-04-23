import React, { useEffect, useMemo, useState } from "react";
import { api, unwrap } from "@/api/client";
import { EP } from "@/api/endpoints";
import { PageHeader } from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import { Plus, Minus, ShoppingCart, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Canteen() {
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);

  const load = () => {
    Promise.all([
      api.get(EP.canteen.menu).then(r => unwrap(r) || []).catch(() => []),
      api.get(EP.canteen.orders).then(r => unwrap(r) || []).catch(() => []),
    ]).then(([m, o]) => { setMenu(m); setOrders(o); setLoading(false); });
  };
  useEffect(load, []);

  const categories = useMemo(() => [...new Set(menu.map(m => m.category))], [menu]);
  const totalQty = Object.values(cart).reduce((a,b)=>a+b,0);
  const cartItems = Object.entries(cart).map(([id,q]) => ({ item: menu.find(m=>m.menuId===id), q })).filter(x=>x.item);
  const total = cartItems.reduce((a,c)=> a + c.q * c.item.price, 0);

  const addItem = (id) => setCart(c => ({ ...c, [id]: (c[id]||0) + 1 }));
  const subItem = (id) => setCart(c => { const n = (c[id]||0) - 1; if (n<=0) { const {[id]:_,...rest}=c; return rest; } return { ...c, [id]: n }; });

  const placeOrder = async () => {
    try {
      await api.post(EP.canteen.orders, {
        items: Object.entries(cart).map(([menuId, quantity]) => ({ menuId, quantity })),
        deliveryTime: "12:30:00",
      });
      toast.success("Order placed");
      setCart({}); load();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  return (
    <div className="space-y-8" data-testid="canteen-page">
      <PageHeader eyebrow="Services" title="Canteen" description="Browse today's menu, build your order, track status." />

      {loading ? <div className="bms-card h-64 animate-pulse" /> : (
        <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
          <div className="space-y-8">
            {categories.map(cat => (
              <section key={cat}>
                <div className="eyebrow mb-4">{cat}</div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {menu.filter(m => m.category === cat).map(item => (
                    <div key={item.menuId} className={cn("bms-card p-5 flex flex-col", !item.isAvailable && "opacity-60")} data-testid={`menu-${item.menuId}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-display text-lg font-medium">{item.itemName}</div>
                          <div className="text-xs text-slate-500 mt-1">{item.description}</div>
                        </div>
                        <div className="font-display text-xl font-semibold text-brand">${item.price.toFixed(2)}</div>
                      </div>
                      <div className="flex-1" />
                      {item.isAvailable ? (
                        cart[item.menuId] ? (
                          <div className="mt-4 flex items-center justify-between border border-slate-300 p-1">
                            <button className="w-8 h-8 hover:bg-slate-100" onClick={() => subItem(item.menuId)} data-testid={`sub-${item.menuId}`}><Minus className="w-4 h-4 mx-auto"/></button>
                            <span className="font-mono font-semibold">{cart[item.menuId]}</span>
                            <button className="w-8 h-8 hover:bg-slate-100" onClick={() => addItem(item.menuId)} data-testid={`add-${item.menuId}`}><Plus className="w-4 h-4 mx-auto"/></button>
                          </div>
                        ) : (
                          <button className="btn-secondary mt-4 h-9" onClick={() => addItem(item.menuId)} data-testid={`addtocart-${item.menuId}`}><Plus className="w-4 h-4"/> Add</button>
                        )
                      ) : (
                        <div className="mt-4 text-xs uppercase tracking-wider text-safety font-semibold">Unavailable</div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            <div className="bms-card p-6" data-testid="cart">
              <div className="flex items-center justify-between mb-4">
                <div><div className="eyebrow">Your Cart</div><div className="font-display text-2xl">{totalQty} items</div></div>
                <ShoppingCart className="w-5 h-5 text-slate-400" />
              </div>
              {cartItems.length === 0 ? (
                <div className="text-sm text-slate-400 py-6 text-center border border-dashed border-slate-200">Cart is empty</div>
              ) : (
                <>
                  <div className="divide-y divide-slate-100 mb-4">
                    {cartItems.map(({item,q}) => (
                      <div key={item.menuId} className="py-2 flex justify-between text-sm">
                        <span><span className="font-mono text-brand">{q}×</span> {item.itemName}</span>
                        <span className="font-display font-medium">${(item.price*q).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between font-display text-xl border-t pt-3">
                    <span>Total</span><span className="text-brand">${total.toFixed(2)}</span>
                  </div>
                  <button onClick={placeOrder} className="btn-primary w-full h-12 mt-4" data-testid="place-order-btn"><Check className="w-4 h-4"/> Place Order</button>
                </>
              )}
            </div>

            <div className="bms-card">
              <div className="p-4 border-b border-slate-200 eyebrow">Recent Orders</div>
              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {orders.length === 0 ? <div className="p-6 text-sm text-slate-400 text-center">No orders yet</div> :
                  orders.slice(0,5).map(o => (
                    <div key={o.orderId} className="p-4 text-sm">
                      <div className="flex justify-between">
                        <span className="font-mono text-xs text-slate-500">#{o.orderId?.slice(0,6)}</span>
                        <StatusBadge status={o.status} />
                      </div>
                      <div className="font-display text-lg mt-1">${Number(o.totalAmount||0).toFixed(2)}</div>
                      <div className="text-xs text-slate-500">{o.items?.length || 0} items</div>
                    </div>
                  ))
                }
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
