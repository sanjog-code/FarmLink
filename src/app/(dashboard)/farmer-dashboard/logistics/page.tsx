"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Package, CheckCircle, Clock, MapPin } from "lucide-react";

export default function FarmerLogisticsPage() {
  const steps = [
    { icon: <Package className="h-5 w-5" />, label: "Order Placed", status: "completed" },
    { icon: <CheckCircle className="h-5 w-5" />, label: "Packed", status: "completed" },
    { icon: <Truck className="h-5 w-5" />, label: "Picked Up", status: "current" },
    { icon: <MapPin className="h-5 w-5" />, label: "In Transit", status: "pending" },
    { icon: <Clock className="h-5 w-5" />, label: "Out for Delivery", status: "pending" },
    { icon: <CheckCircle className="h-5 w-5" />, label: "Delivered", status: "pending" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Logistics Tracking</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Active Shipment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {steps.map((step, i) => (
              <div key={step.label} className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.status === "completed" ? "bg-primary text-primary-foreground" :
                    step.status === "current" ? "bg-primary/20 text-primary ring-2 ring-primary" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {step.icon}
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`w-0.5 h-8 ${step.status === "completed" ? "bg-primary" : "bg-muted"}`} />
                  )}
                </div>
                <div className="pb-8">
                  <p className={`font-medium ${step.status === "pending" ? "text-muted-foreground" : ""}`}>{step.label}</p>
                  {step.status === "current" && <p className="text-sm text-primary">Current status</p>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
