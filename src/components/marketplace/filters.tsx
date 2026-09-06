"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES, GRADES, DISTANCE_FILTERS } from "@/lib/constants";
import { SlidersHorizontal, X } from "lucide-react";

interface FiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export interface FilterState {
  category: string;
  grade: string;
  distance: number;
  minPrice: string;
  maxPrice: string;
  organic: boolean;
  search: string;
  sortBy: string;
}

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

export function Filters({ filters, onChange }: FiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const activeFilterCount = [
    filters.category,
    filters.grade,
    filters.distance > 0,
    filters.minPrice,
    filters.maxPrice,
    filters.organic,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <div className="relative">
            <Input
              placeholder="Search for fruits, vegetables, grains..."
              value={filters.search}
              onChange={(e) => onChange({ ...filters, search: e.target.value })}
              className="pl-10"
            />
            <svg className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <div className="flex gap-2">
          <Select
            options={CATEGORIES.map((c) => ({ value: c.value, label: `${c.icon} ${c.label}` }))}
            value={filters.category}
            onChange={(e) => onChange({ ...filters, category: e.target.value })}
            className="w-[160px]"
            placeholder="Category"
          />
          <Select
            options={GRADES.map((g) => ({ value: g.value, label: `Grade ${g.label}` }))}
            value={filters.grade}
            onChange={(e) => onChange({ ...filters, grade: e.target.value })}
            className="w-[140px]"
            placeholder="Grade"
          />
          <Select
            options={[
              { value: "rank", label: "Smart Ranking" },
              { value: "price_low", label: "Price: Low to High" },
              { value: "price_high", label: "Price: High to Low" },
              { value: "newest", label: "Newest First" },
              { value: "distance", label: "Nearest First" },
            ]}
            value={filters.sortBy}
            onChange={(e) => onChange({ ...filters, sortBy: e.target.value })}
            className="w-[170px]"
          />
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="relative"
          >
            <SlidersHorizontal className="h-4 w-4 mr-1" />
            Filters
            {activeFilterCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {showAdvanced && (
        <div className="card p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Select
            label="Distance"
            options={[{ value: "0", label: "Any Distance" }, ...DISTANCE_FILTERS.map((d) => ({ value: String(d.value), label: d.label }))]}
            value={String(filters.distance)}
            onChange={(e) => onChange({ ...filters, distance: Number(e.target.value) })}
          />
          <Input
            label="Min Price (₹)"
            type="number"
            placeholder="0"
            value={filters.minPrice}
            onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
          />
          <Input
            label="Max Price (₹)"
            type="number"
            placeholder="1000"
            value={filters.maxPrice}
            onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
          />
          <div className="flex items-end">
            <Button
              variant={filters.organic ? "default" : "outline"}
              onClick={() => onChange({ ...filters, organic: !filters.organic })}
              className="w-full"
            >
              🌿 {filters.organic ? "Organic Only" : "Show Organic"}
            </Button>
          </div>
          {activeFilterCount > 0 && (
            <div className="col-span-full">
              <Button variant="ghost" size="sm" onClick={() => onChange(defaultFilters)}>
                <X className="h-3 w-3 mr-1" /> Clear all filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
