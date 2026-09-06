"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface User {
  id: string;
  name: string;
  email?: string;
  mobile?: string;
  role: string;
  avatar?: string;
  consumer?: any;
  farmer?: any;
  bulkBuyer?: any;
  admin?: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (data: any, role: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setUser(data.data);
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (identifier: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error);
    }

    setUser(data.data.user);

    const role = data.data.user.role;
    toast.success("Login successful!");

    if (role === "FARMER") router.push("/farmer-dashboard");
    else if (role === "BULK_BUYER") router.push("/bulk-marketplace");
    else if (role === "ADMIN") router.push("/admin");
    else router.push("/marketplace");
  };

  const register = async (regData: any, role: string) => {
    const roleMap: Record<string, string> = {
      consumer: "CONSUMER",
      farmer: "FARMER",
      bulkBuyer: "BULK_BUYER",
    };
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...regData, role: roleMap[role] || role }),
    });

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error);
    }

    toast.success("Registration successful! Please login.");
    router.push("/login");
  };

  const logout = () => {
    fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
    toast.success("Logged out successfully");
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
