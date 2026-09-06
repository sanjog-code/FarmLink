"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Package } from "lucide-react";
import { formatCurrency, getGradeLabel, getGradeColor } from "@/lib/utils";

export default function AdminListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const res = await fetch("/api/produce?all=true");
      const data = await res.json();
      if (data.success) setListings(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">All Listings</h1>
      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="card p-4 animate-pulse"><div className="h-12 bg-muted rounded" /></div>)}</div>
      ) : listings.length === 0 ? (
        <EmptyState icon={<Package className="h-8 w-8" />} title="No listings" description="Produce listings will appear here" />
      ) : (
        <div className="space-y-2">
          {listings.map((l) => (
            <Card key={l.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{l.name}</p>
                  <Badge variant={l.status === "ACTIVE" ? "success" : l.status === "DRAFT" ? "warning" : "secondary"}>{l.status}</Badge>
                  {l.grade && <Badge className={getGradeColor(l.grade)}>{getGradeLabel(l.grade)}</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{l.farmer?.user?.name} &middot; {l.category} &middot; {l.quantity} {l.unit}</p>
              </div>
              <p className="font-semibold">{formatCurrency(l.price)}/{l.unit}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
