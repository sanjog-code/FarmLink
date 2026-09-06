"use client";
import { useState, useEffect, use, useCallback } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate, getGradeLabel, getGradeColor } from "@/lib/utils";
import { MapPin, Clock, User, Truck, ShoppingCart, Minus, Plus, Star, Leaf, Package } from "lucide-react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";

const FarmMap = dynamic(() => import("@/components/map/farm-map").then((m) => m.FarmMap), { ssr: false });

export default function ProduceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [produce, setProduce] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const fetchProduce = useCallback(async () => {
    try {
      const res = await fetch(`/api/produce/${id}`);
      const data = await res.json();
      if (data.success) setProduce(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduce();
  }, [fetchProduce]);

  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!produce) return;
    setAdding(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ produceId: produce.id, quantity }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`${produce.name} (${quantity} ${produce.unit}) added to cart`);
      } else if (res.status === 401) {
        toast.error("Please login as a consumer to add to cart");
      } else {
        toast.error(data.error || data.message || "Failed to add to cart");
      }
    } catch (err) {
      toast.error("Failed to add to cart. Try again.");
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    let added = true;
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ produceId: produce.id, quantity }),
      });
      const data = await res.json();
      added = data.success;
      if (!added && res.status === 401) {
        toast.error("Please login as a consumer to buy");
        return;
      }
    } catch {
      added = false;
    }
    if (added) window.location.href = "/cart";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-10 w-1/3" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!produce) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Product not found</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid md:grid-cols-2 gap-8"
        >
          {/* Images */}
          <div>
            <div className="aspect-square rounded-xl overflow-hidden bg-muted mb-4">
              {produce.images?.length > 0 ? (
                <img
                  src={produce.images[selectedImage]?.url}
                  alt={produce.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">📦</div>
              )}
            </div>
            {produce.images?.length > 1 && (
              <div className="flex gap-2">
                {produce.images.map((img: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${selectedImage === i ? "border-primary" : "border-transparent"}`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {produce.organic && <Badge variant="success"><Leaf className="h-3 w-3 mr-1" /> Organic</Badge>}
                {produce.grade && <Badge className={getGradeColor(produce.grade)}>Grade {getGradeLabel(produce.grade)}</Badge>}
                <Badge variant="outline">{produce.category}</Badge>
              </div>
              <h1 className="text-3xl font-bold">{produce.name}</h1>
            </div>

            <div className="text-3xl font-bold text-primary">
              {formatCurrency(produce.price)}
              <span className="text-base font-normal text-muted-foreground"> / {produce.unit}</span>
            </div>

            {produce.description && (
              <p className="text-muted-foreground">{produce.description}</p>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                Harvested: {formatDate(produce.harvestDate)}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Package className="h-4 w-4" />
                Available: {produce.quantity} {produce.unit}
              </div>
              {produce.farmer?.district && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {produce.farmer.district}, {produce.farmer.state}
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <Truck className="h-4 w-4" />
                Delivery: 1-3 days
              </div>
            </div>

            {/* Farmer Info */}
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{produce.farmer?.user?.name || "Unknown Farmer"}</p>
                  <p className="text-sm text-muted-foreground">
                    {produce.farmer?.village}, {produce.farmer?.district}
                  </p>
                </div>
              </div>
            </div>

            {produce.latitude && produce.longitude && (
              <div className="space-y-1">
                <p className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" /> Farm Location
                </p>
                <FarmMap
                  latitude={produce.latitude}
                  longitude={produce.longitude}
                  label={`${produce.farmer?.village || "Farm"}, ${produce.farmer?.district || ""}`}
                />
              </div>
            )}

            {/* Grade Details */}
            {produce.gradeDetail && (
              <div className="card p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" /> AI Quality Report
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Quality Score</p>
                    <p className="font-medium">{produce.gradeDetail.qualityScore}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Color Uniformity</p>
                    <p className="font-medium">{produce.gradeDetail.colorUniformity}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Surface Defects</p>
                    <p className="font-medium">{produce.gradeDetail.surfaceDefects}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Freshness</p>
                    <p className="font-medium">{produce.gradeDetail.freshnessScore}%</p>
                  </div>
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-muted transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 font-medium min-w-[60px] text-center">
                  {quantity} {produce.unit}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(produce.quantity, quantity + 1))}
                  className="px-3 py-2 hover:bg-muted transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <span className="text-sm text-muted-foreground">
                Total: {formatCurrency(produce.price * quantity)}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={adding}>
                <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
              </Button>
              <Button size="lg" variant="outline" className="flex-1" onClick={handleBuyNow} disabled={adding}>
                Buy Now
              </Button>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
