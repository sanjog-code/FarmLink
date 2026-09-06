"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { Farmer } from "@/types";

export default function FarmerProfilePage() {
  const { user } = useAuth();
  const farmer = user?.farmer as Farmer | undefined;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Farm Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Farmer ID</p>
            <p className="text-lg font-mono font-bold text-primary">{farmer?.farmerId || "N/A"}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Name" value={user?.name || ""} readOnly />
            <Input label="Mobile" value={user?.mobile || ""} readOnly />
            <Input label="State" value={farmer?.state || ""} readOnly />
            <Input label="District" value={farmer?.district || ""} readOnly />
            <Input label="Village" value={farmer?.village || ""} readOnly />
            <Input label="Farm Size" value={farmer ? `${farmer.farmSize} acres` : ""} readOnly />
          </div>
          <Button variant="outline" className="w-full">Edit Profile</Button>
        </CardContent>
      </Card>
    </div>
  );
}
