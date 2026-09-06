"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, IndianRupee, TrendingUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";

export default function FarmerDashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeListings: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/farmer/dashboard");
      const data = await res.json();
      if (data.success) {
        setStats(data.data.stats);
        setRecentOrders(data.data.recentOrders || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { title: "Total Products", value: stats.totalProducts, icon: <Package className="h-5 w-5" />, color: "text-blue-600 bg-blue-50" },
    { title: "Active Listings", value: stats.activeListings, icon: <TrendingUp className="h-5 w-5" />, color: "text-green-600 bg-green-50" },
    { title: "Total Orders", value: stats.totalOrders, icon: <ShoppingCart className="h-5 w-5" />, color: "text-orange-600 bg-orange-50" },
    { title: "Total Revenue", value: formatCurrency(stats.totalRevenue), icon: <IndianRupee className="h-5 w-5" />, color: "text-purple-600 bg-purple-50" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Farmer Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here&apos;s your overview.</p>
        </div>
        <Link href="/farmer-dashboard/produce/new">
          <Button><Plus className="h-4 w-4 mr-2" /> Add Produce</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <div className={`p-2 rounded-lg ${card.color}`}>{card.icon}</div>
                </div>
                <p className="text-2xl font-bold">{loading ? "--" : card.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Revenue chart will appear here</p>
                <p className="text-xs">Connect your database to see analytics</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Orders</CardTitle>
            <Link href="/farmer-dashboard/orders" className="text-sm text-primary hover:underline">View All</Link>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No recent orders</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.slice(0, 5).map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-sm font-medium">#{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">{order.items?.length} items</p>
                    </div>
                    <p className="text-sm font-semibold">{formatCurrency(order.totalAmount)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
