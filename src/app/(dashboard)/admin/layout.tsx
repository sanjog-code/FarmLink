"use client";
import { Sidebar, adminSidebarItems } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar items={adminSidebarItems} />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
