"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ShoppingCart, Search, Tractor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { ToggleTheme } from "@/components/ui/toggle-theme";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Tractor className="h-6 w-6" />
          <span>FarmLink</span>
        </Link>

        {user && (
          <nav className="hidden md:flex items-center gap-1">
            {user.role === "CONSUMER" && (
              <>
                <NavLink href="/marketplace" current={pathname}>Marketplace</NavLink>
                <NavLink href="/orders" current={pathname}>Orders</NavLink>
                <NavLink href="/cart" current={pathname}>
                  <ShoppingCart className="h-4 w-4" />
                </NavLink>
              </>
            )}
            {user.role === "FARMER" && (
              <>
                <NavLink href="/farmer-dashboard" current={pathname}>Dashboard</NavLink>
                <NavLink href="/farmer-dashboard/produce" current={pathname}>Produce</NavLink>
                <NavLink href="/bulk-marketplace" current={pathname}>Bulk</NavLink>
              </>
            )}
            {user.role === "BULK_BUYER" && (
              <>
                <NavLink href="/bulk-marketplace" current={pathname}>Bulk Marketplace</NavLink>
                <NavLink href="/bulk-buyer/orders" current={pathname}>Orders</NavLink>
              </>
            )}
            {user.role === "ADMIN" && (
              <NavLink href="/admin" current={pathname}>Admin</NavLink>
            )}
          </nav>
        )}

        <div className="flex items-center gap-2">
          <ToggleTheme />
          {user ? (
            <div className="flex items-center gap-3">
              <Link href={user.role === "FARMER" ? "/farmer-dashboard/profile" : user.role === "ADMIN" ? "/admin" : "/profile"}>
                <Avatar name={user.name} src={user.avatar} size="sm" />
              </Link>
              <Button variant="ghost" size="sm" onClick={logout} className="hidden md:inline-flex">
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          )}

          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-background p-4 space-y-2">
          {user ? (
            <>
              {user.role === "CONSUMER" && (
                <>
                  <MobileNavLink href="/marketplace" onClick={() => setMobileOpen(false)}>Marketplace</MobileNavLink>
                  <MobileNavLink href="/orders" onClick={() => setMobileOpen(false)}>Orders</MobileNavLink>
                  <MobileNavLink href="/cart" onClick={() => setMobileOpen(false)}>Cart</MobileNavLink>
                </>
              )}
              {user.role === "FARMER" && (
                <>
                  <MobileNavLink href="/farmer-dashboard" onClick={() => setMobileOpen(false)}>Dashboard</MobileNavLink>
                  <MobileNavLink href="/farmer-dashboard/produce" onClick={() => setMobileOpen(false)}>Produce</MobileNavLink>
                  <MobileNavLink href="/bulk-marketplace" onClick={() => setMobileOpen(false)}>Bulk Marketplace</MobileNavLink>
                </>
              )}
              {user.role === "BULK_BUYER" && (
                <>
                  <MobileNavLink href="/bulk-marketplace" onClick={() => setMobileOpen(false)}>Bulk Marketplace</MobileNavLink>
                  <MobileNavLink href="/bulk-buyer/orders" onClick={() => setMobileOpen(false)}>Orders</MobileNavLink>
                </>
              )}
              {user.role === "ADMIN" && (
                <MobileNavLink href="/admin" onClick={() => setMobileOpen(false)}>Admin Panel</MobileNavLink>
              )}
              <Button variant="ghost" className="w-full justify-start" onClick={() => { logout(); setMobileOpen(false); }}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <MobileNavLink href="/login" onClick={() => setMobileOpen(false)}>Login</MobileNavLink>
              <MobileNavLink href="/register" onClick={() => setMobileOpen(false)}>Register</MobileNavLink>
            </>
          )}
        </div>
      )}
    </header>
  );
}

function NavLink({ href, current, children }: { href: string; current: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
        current === href || current.startsWith(href + "/")
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      )}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
    >
      {children}
    </Link>
  );
}
