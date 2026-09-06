"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { Tractor, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      await login(identifier, password);
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="lg:hidden flex items-center gap-2 font-bold text-2xl text-primary mb-8 justify-center">
        <Tractor className="h-8 w-8" />
        <span>FarmLink</span>
      </div>

      <div className="space-y-2 mb-8">
        <h1 className="text-2xl font-bold">Welcome Back</h1>
        <p className="text-muted-foreground">
          Sign in to your account to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email, Mobile, or Farmer ID"
          id="identifier"
          type="text"
          placeholder="Enter your email, mobile, or Farmer ID"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />

        <div className="relative">
          <Input
            label="Password"
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-8 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Sign In
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-primary font-medium hover:underline">
          Register here
        </Link>
      </div>

      <div className="mt-8 pt-6 border-t">
        <p className="text-xs text-center text-muted-foreground mb-3">Quick Demo Access</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { role: "Consumer", id: "user1@gmail.com" },
            { role: "Farmer", id: "FMR-2026-10001" },
            { role: "Admin", id: "admin@farmlink.in" },
          ].map((demo) => (
            <Button
              key={demo.role}
              variant="outline"
              size="sm"
              onClick={() => {
                setIdentifier(demo.id);
                setPassword("password123");
              }}
              className="text-xs"
            >
              {demo.role}
            </Button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
