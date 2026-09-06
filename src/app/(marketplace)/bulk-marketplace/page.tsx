"use client";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency, getGradeLabel, getGradeColor } from "@/lib/utils";
import { Package, MapPin, Search, ArrowLeftRight, Minus, Plus } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function BulkMarketplacePage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const res = await fetch("/api/bulk-listings");
      const data = await res.json();
      if (data.success) setListings(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const filtered = listings.filter(
    (l) =>
      l.produce?.name?.toLowerCase().includes(search.toLowerCase()) ||
      l.farmer?.user?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleRequestQuote = (id: string) => {
    toast.success("Quote request sent to farmer!");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 py-8">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-2">
                <ArrowLeftRight className="h-6 w-6 text-orange-600" />
                <h1 className="text-3xl font-bold">Bulk Marketplace</h1>
              </div>
              <p className="text-muted-foreground">Wholesale produce for bulk buyers and businesses</p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="relative max-w-md mb-6">
            <Input
              placeholder="Search bulk produce..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card p-4 animate-pulse"><div className="h-48 bg-muted rounded" /></div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<Package className="h-8 w-8" />}
              title="No bulk listings found"
              description="Check back later for wholesale produce"
            />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((listing) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-all">
                    <div className="aspect-[16/9] bg-muted relative">
                      {listing.produce?.images?.[0] ? (
                        <img src={listing.produce.images[0].url} alt={listing.produce.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                      )}
                      {listing.produce?.grade && (
                        <Badge className={`absolute top-2 right-2 ${getGradeColor(listing.produce.grade)}`}>
                          Grade {getGradeLabel(listing.produce.grade)}
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg">{listing.produce?.name || "Unknown"}</h3>
                        <p className="text-sm text-muted-foreground">by {listing.farmer?.user?.name}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{listing.farmer?.district}, {listing.farmer?.state}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-muted rounded-lg p-2">
                          <p className="text-muted-foreground text-xs">Available Qty</p>
                          <p className="font-medium">{listing.availableQty} kg</p>
                        </div>
                        <div className="bg-muted rounded-lg p-2">
                          <p className="text-muted-foreground text-xs">MOQ</p>
                          <p className="font-medium">{listing.moq} kg</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div>
                          <span className="text-xl font-bold text-primary">{formatCurrency(listing.bulkPrice)}</span>
                          <span className="text-xs text-muted-foreground"> / kg</span>
                        </div>
                        <Button size="sm" onClick={() => handleRequestQuote(listing.id)}>
                          Request Quote
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
