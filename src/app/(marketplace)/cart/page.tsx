"use client";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ShoppingCart, Trash2, Minus, Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import toast from "react-hot-toast";

interface CartItem {
  id: string;
  quantity: number;
  produce: {
    id: string;
    name: string;
    price: number;
    unit: string;
    quantity: number;
    images?: { url: string }[];
  };
}

export default function CartPage() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const loadCart = async () => {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      if (data.success) setCartItems(data.data);
    } catch {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQuantity = async (itemId: string, delta: number) => {
    const existing = cartItems.find((i) => i.id === itemId);
    if (!existing) return;
    const next = Math.max(1, existing.quantity + delta);
    try {
      const res = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, quantity: next }),
      });
      const data = await res.json();
      if (data.success) {
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === itemId
              ? { ...item, quantity: Math.min(next, item.produce.quantity) }
              : item
          )
        );
      } else {
        toast.error(data.error || data.message || "Failed to update quantity");
      }
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const res = await fetch(`/api/cart?itemId=${itemId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setCartItems((prev) => prev.filter((item) => item.id !== itemId));
        toast.success("Item removed from cart");
      } else {
        toast.error(data.error || data.message || "Failed to remove item");
      }
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.produce.price * item.quantity, 0);

  const handleCheckout = async () => {
    const addresses = user?.consumer?.addresses as any[] | undefined;
    const address =
      addresses?.find((a) => a.isDefault) || addresses?.[0];

    if (!address) {
      toast.error("Please add a delivery address in your profile first");
      return;
    }

    setPlacingOrder(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId: address.id,
          items: cartItems.map((item) => ({
            produceId: item.produce.id,
            quantity: item.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Order #${data.data.orderNumber} placed successfully`);
        for (const item of cartItems) {
          await fetch(`/api/cart?itemId=${item.id}`, { method: "DELETE" });
        }
        setCartItems([]);
      } else {
        toast.error(data.error || data.message || "Failed to place order");
      }
    } catch {
      toast.error("Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

        {loading ? (
          <p className="text-muted-foreground">Loading your cart...</p>
        ) : cartItems.length === 0 ? (
          <EmptyState
            icon={<ShoppingCart className="h-8 w-8" />}
            title="Your cart is empty"
            description="Add some fresh produce from the marketplace"
            action={
              <Link href="/marketplace">
                <Button>Browse Marketplace</Button>
              </Link>
            }
          />
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="card p-4 flex items-center gap-4">
                  {item.produce.images?.[0] ? (
                    <img
                      src={item.produce.images[0].url}
                      alt={item.produce.name}
                      className="h-20 w-20 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-lg bg-muted flex-shrink-0 flex items-center justify-center">ðŸ“¦</div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium">{item.produce.name}</h3>
                    <p className="text-sm text-muted-foreground">{formatCurrency(item.produce.price)} / {item.produce.unit}</p>
                  </div>
                  <div className="flex items-center border rounded-lg">
                    <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-1 hover:bg-muted">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-3 py-1 text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-1 hover:bg-muted">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="font-semibold min-w-[80px] text-right">{formatCurrency(item.produce.price * item.quantity)}</p>
                  <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="card p-6 h-fit sticky top-20">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(total)}</span></div>
                <div className="flex justify-between"><span>Delivery</span><span>{formatCurrency(40)}</span></div>
                <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                  <span>Total</span><span>{formatCurrency(total + 40)}</span>
                </div>
              </div>
              <Button className="w-full mt-4" size="lg" onClick={handleCheckout} disabled={placingOrder}>
                {placingOrder ? "Placing order..." : "Proceed to Checkout"}
              </Button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
