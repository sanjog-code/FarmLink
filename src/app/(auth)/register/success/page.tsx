"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function RegisterSuccessPage() {
  return (
    <div className="text-center py-12">
      <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
      <h1 className="text-2xl font-bold mb-2">Registration Successful!</h1>
      <p className="text-muted-foreground mb-6">
        Your account has been created. Please sign in to continue.
      </p>
      <Link href="/login">
        <Button size="lg">Go to Login</Button>
      </Link>
    </div>
  );
}
