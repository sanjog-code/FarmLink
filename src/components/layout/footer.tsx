import Link from "next/link";
import { Tractor } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary mb-3">
              <Tractor className="h-6 w-6" />
              <span>FarmLink</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Connecting farmers directly with consumers and bulk buyers.
              Fresh produce, fair prices, smarter logistics.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/marketplace" className="hover:text-foreground">Marketplace</Link></li>
              <li><Link href="/bulk-marketplace" className="hover:text-foreground">Bulk Trading</Link></li>
              <li><Link href="/register" className="hover:text-foreground">Sell on FarmLink</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground">About Us</Link></li>
              <li><Link href="#" className="hover:text-foreground">Contact</Link></li>
              <li><Link href="#" className="hover:text-foreground">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground">Help Center</Link></li>
              <li><Link href="#" className="hover:text-foreground">Seller Support</Link></li>
              <li><Link href="#" className="hover:text-foreground">Buyer Support</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} FarmLink. Built for Smart India Hackathon 2026.
        </div>
      </div>
    </footer>
  );
}
