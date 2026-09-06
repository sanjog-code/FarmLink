"use client";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { EmptyState } from "@/components/ui/empty-state";
import { ArrowLeftRight } from "lucide-react";

export default function ContractsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Active Contracts</h1>
        <EmptyState
          icon={<ArrowLeftRight className="h-8 w-8" />}
          title="No active contracts"
          description="Negotiate deals with farmers to create contracts"
        />
      </main>
      <Footer />
    </div>
  );
}
