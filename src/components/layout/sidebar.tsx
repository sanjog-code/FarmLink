"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Star,
  ShoppingCart,
  Truck,
  CreditCard,
  User,
  ArrowLeftRight,
  Home,
} from "lucide-react";

interface SidebarProps {
  items: {
    label: string;
    href: string;
    icon: React.ReactNode;
  }[];
  collapsed?: boolean;
}

export function Sidebar({ items, collapsed }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-card h-[calc(100vh-4rem)] sticky top-16 transition-all",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <nav className="flex-1 space-y-1 p-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export const farmerSidebarItems = [
  { label: "Dashboard", href: "/farmer-dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "My Produce", href: "/farmer-dashboard/produce", icon: <Package className="h-4 w-4" /> },
  { label: "Grade Produce", href: "/farmer-dashboard/grade", icon: <Star className="h-4 w-4" /> },
  { label: "Bulk Marketplace", href: "/bulk-marketplace", icon: <ArrowLeftRight className="h-4 w-4" /> },
  { label: "Orders", href: "/farmer-dashboard/orders", icon: <ShoppingCart className="h-4 w-4" /> },
  { label: "Logistics", href: "/farmer-dashboard/logistics", icon: <Truck className="h-4 w-4" /> },
  { label: "Payments", href: "/farmer-dashboard/payments", icon: <CreditCard className="h-4 w-4" /> },
  { label: "Profile", href: "/farmer-dashboard/profile", icon: <User className="h-4 w-4" /> },
];

export const adminSidebarItems = [
  { label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Users", href: "/admin/users", icon: <User className="h-4 w-4" /> },
  { label: "Farmers", href: "/admin/farmers", icon: <Package className="h-4 w-4" /> },
  { label: "Bulk Buyers", href: "/admin/bulk-buyers", icon: <ArrowLeftRight className="h-4 w-4" /> },
  { label: "Listings", href: "/admin/listings", icon: <Home className="h-4 w-4" /> },
];

export const bulkBuyerSidebarItems = [
  { label: "Marketplace", href: "/bulk-marketplace", icon: <Home className="h-4 w-4" /> },
  { label: "My Orders", href: "/bulk-buyer/orders", icon: <ShoppingCart className="h-4 w-4" /> },
  { label: "Contracts", href: "/bulk-buyer/contracts", icon: <ArrowLeftRight className="h-4 w-4" /> },
  { label: "Profile", href: "/bulk-buyer/profile", icon: <User className="h-4 w-4" /> },
];
