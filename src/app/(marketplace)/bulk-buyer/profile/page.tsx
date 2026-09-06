"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/contexts/auth-context";

export default function BulkBuyerProfilePage() {
  const { user } = useAuth();
  const buyer = user?.bulkBuyer;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Business Profile</h1>
        <Card>
          <CardHeader><CardTitle className="text-lg">Business Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Firm Name" value={buyer?.firmName || ""} readOnly />
              <Input label="GST Number" value={buyer?.gstNumber || ""} readOnly />
              <Input label="Email" value={user?.email || ""} readOnly />
              <Input label="Mobile" value={user?.mobile || ""} readOnly />
              <div className="col-span-2">
                <Input label="Business Address" value={buyer?.businessAddress || ""} readOnly />
              </div>
            </div>
            <Button variant="outline" className="w-full">Edit Profile</Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
