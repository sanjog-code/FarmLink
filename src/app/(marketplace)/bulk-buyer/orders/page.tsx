"use client";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { getStatusColor, formatCurrency, formatDate } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";

export default function BulkBuyerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders?role=bulkBuyer");
      const data = await res.json();
      if (data.success) setOrders(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Bulk Orders</h1>
        {loading ? (
          <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="card p-4 animate-pulse"><div className="h-16 bg-muted rounded" /></div>)}</div>
        ) : orders.length === 0 ? (
          <EmptyState icon={<ShoppingCart className="h-8 w-8" />} title="No orders yet" description="Your bulk orders will appear here" />
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="card p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">#{order.orderNumber}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                  <p className="text-sm font-semibold mt-1">{formatCurrency(order.totalAmount)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
