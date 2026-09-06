"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Tractor } from "lucide-react";

export default function AdminFarmersPage() {
  const [farmers, setFarmers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    try {
      const res = await fetch("/api/admin/farmers");
      const data = await res.json();
      if (data.success) setFarmers(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Farmers</h1>
      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="card p-4 animate-pulse"><div className="h-12 bg-muted rounded" /></div>)}</div>
      ) : farmers.length === 0 ? (
        <EmptyState icon={<Tractor className="h-8 w-8" />} title="No farmers" description="Farmers will appear here" />
      ) : (
        <div className="space-y-2">
          {farmers.map((f) => (
            <Card key={f.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{f.user?.name}</p>
                <p className="text-sm text-muted-foreground">{f.farmerId} &middot; {f.district}, {f.state}</p>
              </div>
              <Badge variant={f.verified ? "success" : "warning"}>{f.verified ? "Verified" : "Pending"}</Badge>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
