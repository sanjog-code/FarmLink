"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Tractor, ShoppingCart, IndianRupee } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboardPage() {
  const stats = [
    { title: "Total Users", value: "0", icon: <Users className="h-5 w-5" />, color: "text-blue-600 bg-blue-50" },
    { title: "Active Farmers", value: "0", icon: <Tractor className="h-5 w-5" />, color: "text-green-600 bg-green-50" },
    { title: "Total Orders", value: "0", icon: <ShoppingCart className="h-5 w-5" />, color: "text-orange-600 bg-orange-50" },
    { title: "Revenue", value: "₹0", icon: <IndianRupee className="h-5 w-5" />, color: "text-purple-600 bg-purple-50" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <div className={`p-2 rounded-lg ${stat.color}`}>{stat.icon}</div>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">Recent Activity</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-8">Activity feed will appear here</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">System Health</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-8">System metrics will appear here</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
