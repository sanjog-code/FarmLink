"use client";
import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ProduceCard } from "@/components/marketplace/produce-card";
import { Filters, FilterState } from "@/components/marketplace/filters";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { motion } from "framer-motion";
import { Package } from "lucide-react";

const defaultFilters: FilterState = {
  category: "",
  grade: "",
  distance: 0,
  minPrice: "",
  maxPrice: "",
  organic: false,
  search: "",
  sortBy: "rank",
};

export default function MarketplacePage() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.set("category", filters.category);
      if (filters.grade) params.set("grade", filters.grade);
      if (filters.distance) params.set("distance", String(filters.distance));
      if (filters.minPrice) params.set("minPrice", filters.minPrice);
      if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
      if (filters.organic) params.set("organic", "true");
      if (filters.search) params.set("search", filters.search);
      if (filters.sortBy) params.set("sortBy", filters.sortBy);

      const res = await fetch(`/api/produce?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 py-8">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl font-bold mb-2">Fresh Produce Marketplace</h1>
              <p className="text-muted-foreground">
                Discover farm-fresh produce ranked by quality, distance, and price
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <Filters filters={filters} onChange={setFilters} />

          <div className="mt-6">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="card overflow-hidden">
                    <Skeleton className="aspect-[4/3]" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-6 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <EmptyState
                icon={<Package className="h-8 w-8" />}
                title="No products found"
                description="Try adjusting your filters or search terms"
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProduceCard key={product.id} produce={product} />
                ))}
              </div>
            )}

            {!loading && products.length > 0 && (
              <p className="text-center text-sm text-muted-foreground mt-8">
                Showing {products.length} products
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
