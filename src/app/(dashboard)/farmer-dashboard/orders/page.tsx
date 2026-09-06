"use client";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { getStatusColor, formatCurrency, formatDate } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";

export default function FarmerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders?role=farmer");
      const data = await res.json();
      if (data.success) setOrders(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const tabs = [
    { value: "all", label: "All" },
    { value: "PENDING", label: "Pending" },
    { value: "CONFIRMED", label: "Accepted" },
    { value: "DELIVERED", label: "Delivered" },
  ];

  const filtered = tab === "all" ? orders : orders.filter((o) => o.status === tab);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Orders</h1>
      <Tabs tabs={tabs} value={tab} onChange={setTab} />
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card p-4 animate-pulse"><div className="h-16 bg-muted rounded" /></div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<ShoppingCart className="h-8 w-8" />} title="No orders" description="Orders from buyers will appear here" />
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <div key={order.id} className="card p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">#{order.orderNumber}</p>
                <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)} &middot; {order.items?.length} items</p>
              </div>
              <div className="text-right">
                <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                <p className="text-sm font-semibold mt-1">{formatCurrency(order.totalAmount)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
