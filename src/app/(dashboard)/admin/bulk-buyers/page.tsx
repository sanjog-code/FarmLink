"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ArrowLeftRight } from "lucide-react";

export default function AdminBulkBuyersPage() {
  const [buyers, setBuyers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBuyers();
  }, []);

  const fetchBuyers = async () => {
    try {
      const res = await fetch("/api/admin/bulk-buyers");
      const data = await res.json();
      if (data.success) setBuyers(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Bulk Buyers</h1>
      {loading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="card p-4 animate-pulse"><div className="h-12 bg-muted rounded" /></div>)}</div>
      ) : buyers.length === 0 ? (
        <EmptyState icon={<ArrowLeftRight className="h-8 w-8" />} title="No bulk buyers" description="Bulk buyers will appear here" />
      ) : (
        <div className="space-y-2">
          {buyers.map((b) => (
            <Card key={b.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{b.firmName}</p>
                <p className="text-sm text-muted-foreground">GST: {b.gstNumber}</p>
              </div>
              <Badge variant={b.verified ? "success" : "warning"}>{b.verified ? "Verified" : "Pending"}</Badge>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
