"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { getGradeLabel, getGradeColor, formatCurrency, formatDate } from "@/lib/utils";
import { Plus, Package, Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function FarmerProducePage() {
  const [produce, setProduce] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduce();
  }, []);

  const fetchProduce = async () => {
    try {
      const res = await fetch("/api/produce?myProduce=true");
      const data = await res.json();
      if (data.success) setProduce(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this produce?")) return;
    try {
      const res = await fetch(`/api/produce/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Produce deleted");
        setProduce((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

  const statusVariant = (status: string) => {
    switch (status) {
      case "ACTIVE": return "success";
      case "DRAFT": return "warning";
      case "SOLD": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Produce</h1>
        <Link href="/farmer-dashboard/produce/new">
          <Button><Plus className="h-4 w-4 mr-2" /> Add Produce</Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card p-4 animate-pulse"><div className="h-16 bg-muted rounded" /></div>
          ))}
        </div>
      ) : produce.length === 0 ? (
        <EmptyState
          icon={<Package className="h-8 w-8" />}
          title="No produce listed"
          description="Start by adding your first produce listing"
          action={<Link href="/farmer-dashboard/produce/new"><Button>Add Produce</Button></Link>}
        />
      ) : (
        <div className="space-y-3">
          {produce.map((item) => (
            <div key={item.id} className="card p-4 flex items-center gap-4">
              <div className="h-16 w-16 rounded-lg bg-muted flex-shrink-0 flex items-center justify-center text-2xl">
                {item.category === "Fruits" ? "🍎" : item.category === "Vegetables" ? "🥕" : "🌾"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium truncate">{item.name}</h3>
                  <Badge variant={statusVariant(item.status) as any}>{item.status}</Badge>
                  {item.grade && <Badge className={getGradeColor(item.grade)}>{getGradeLabel(item.grade)}</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">
                  {item.quantity} {item.unit} &middot; {formatCurrency(item.price)}/{item.unit} &middot; {formatDate(item.harvestDate)}
                </p>
              </div>
              <div className="flex gap-2">
                <Link href={`/farmer-dashboard/produce/${item.id}/edit`}>
                  <Button variant="outline" size="sm"><Edit className="h-3.5 w-3.5" /></Button>
                </Link>
                <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
