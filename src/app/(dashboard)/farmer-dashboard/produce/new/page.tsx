"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { CATEGORIES } from "@/lib/constants";
import toast from "react-hot-toast";

export default function NewProducePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    quantity: "",
    unit: "kg",
    price: "",
    harvestDate: "",
    organic: false,
  });

  const updateForm = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.category || !form.quantity || !form.price || !form.harvestDate) {
      toast.error("Please fill all required fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/produce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          quantity: parseFloat(form.quantity),
          price: parseFloat(form.price),
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Produce listed successfully!");
        router.push("/farmer-dashboard/produce");
      } else {
        toast.error(data.error || "Failed to create listing");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Produce</h1>
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Produce Name *" id="name" placeholder="e.g., Fresh Tomatoes" value={form.name} onChange={(e) => updateForm("name", e.target.value)} />
            <Select label="Category *" id="category" placeholder="Select category" options={CATEGORIES.map((c) => ({ value: c.value, label: `${c.icon} ${c.label}` }))} value={form.category} onChange={(e) => updateForm("category", e.target.value)} />
            <Textarea label="Description" id="description" placeholder="Describe your produce..." value={form.description} onChange={(e) => updateForm("description", e.target.value)} />
            <div className="grid grid-cols-3 gap-4">
              <Input label="Quantity *" id="quantity" type="number" placeholder="100" value={form.quantity} onChange={(e) => updateForm("quantity", e.target.value)} />
              <Select label="Unit" id="unit" options={[{ value: "kg", label: "Kilogram" }, { value: "g", label: "Gram" }, { value: "ton", label: "Ton" }, { value: "dozen", label: "Dozen" }, { value: "piece", label: "Piece" }]} value={form.unit} onChange={(e) => updateForm("unit", e.target.value)} />
              <Input label="Price per Unit (₹) *" id="price" type="number" placeholder="40" value={form.price} onChange={(e) => updateForm("price", e.target.value)} />
            </div>
            <Input label="Harvest Date *" id="harvestDate" type="date" value={form.harvestDate} onChange={(e) => updateForm("harvestDate", e.target.value)} />
            <Button type="button" variant={form.organic ? "default" : "outline"} onClick={() => updateForm("organic", !form.organic)} className="w-full">
              🌿 {form.organic ? "Organic - Yes" : "Mark as Organic"}
            </Button>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" className="flex-1" loading={loading}>List Produce</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
