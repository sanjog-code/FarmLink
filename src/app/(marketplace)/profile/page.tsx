"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";

export default function ConsumerProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        <Card>
          <CardHeader><CardTitle className="text-lg">Personal Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Name" value={user?.name || ""} readOnly />
              <Input label="Email" value={user?.email || ""} readOnly />
              <Input label="Mobile" value={user?.mobile || ""} readOnly />
              <Input label="Role" value={user?.role || ""} readOnly />
            </div>
            <Button variant="outline" className="w-full">Edit Profile</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
