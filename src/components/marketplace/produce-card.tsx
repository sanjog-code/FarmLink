"use client";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Star, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, getGradeLabel, getGradeColor } from "@/lib/utils";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface ProduceCardProps {
  produce: {
    id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
    unit: string;
    grade: string | null;
    organic: boolean;
    harvestDate: string;
    farmer?: { user: { name: string }; district?: string; village?: string };
    images: { url: string; isPrimary: boolean }[];
    distance?: number;
  };
}

export function ProduceCard({ produce }: ProduceCardProps) {
  const primaryImage = produce.images?.find((img) => img.isPrimary) || produce.images?.[0];
  const farmerName = produce.farmer?.user?.name || "Unknown Farmer";
  const location = produce.farmer?.district || produce.farmer?.village || "";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success(`${produce.name} added to cart`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/marketplace/${produce.id}`}>
        <div className="card overflow-hidden hover:shadow-lg transition-all group">
          <div className="relative aspect-[4/3] bg-muted overflow-hidden">
            {primaryImage ? (
              <img
                src={primaryImage.url}
                alt={produce.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">
                {produce.category === "Fruits" ? "🍎" : produce.category === "Vegetables" ? "🥕" : produce.category === "Grains" ? "🌾" : produce.category === "Dairy" ? "🥛" : produce.category === "Pulses" ? "🫘" : "📦"}
              </div>
            )}
            {produce.organic && (
              <Badge variant="success" className="absolute top-2 left-2">
                Organic
              </Badge>
            )}
            {produce.grade && (
              <Badge className={`absolute top-2 right-2 ${getGradeColor(produce.grade)}`}>
                Grade {getGradeLabel(produce.grade)}
              </Badge>
            )}
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-semibold text-base line-clamp-1">{produce.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{farmerName}</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
              {location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {location}
                </span>
              )}
              {produce.distance !== undefined && (
                <span>{produce.distance.toFixed(1)} km</span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {produce.quantity} {produce.unit}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-bold text-primary">{formatCurrency(produce.price)}</span>
                <span className="text-xs text-muted-foreground"> / {produce.unit}</span>
              </div>
              <Button size="sm" onClick={handleAddToCart} className="h-8 px-3">
                <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
