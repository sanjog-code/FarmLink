"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Tabs } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth-context";
import { Tractor, Eye, EyeOff } from "lucide-react";
import { INDIAN_STATES } from "@/lib/constants";
import toast from "react-hot-toast";

type RegisterRole = "consumer" | "farmer" | "bulkBuyer";

export default function RegisterPage() {
  const [role, setRole] = useState<RegisterRole>("consumer");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    address: "",
    state: "",
    district: "",
    village: "",
    farmSize: "",
    firmName: "",
    gstNumber: "",
    businessAddress: "",
  });

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const data: any = { name: form.name, mobile: form.mobile, password: form.password };

      if (role === "consumer") {
        data.email = form.email;
        data.address = form.address;
      } else if (role === "farmer") {
        data.state = form.state;
        data.district = form.district;
        data.village = form.village;
        data.farmSize = parseFloat(form.farmSize) || 1;
      } else {
        data.firmName = form.firmName;
        data.gstNumber = form.gstNumber;
        data.email = form.email;
        data.businessAddress = form.businessAddress;
      }

      await register(data, role);
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const roleTabs = [
    { value: "consumer", label: "Consumer" },
    { value: "farmer", label: "Farmer" },
    { value: "bulkBuyer", label: "Bulk Buyer" },
  ];

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

      <div className="space-y-2 mb-6">
        <h1 className="text-2xl font-bold">Create Account</h1>
        <p className="text-muted-foreground">
          Join FarmLink and start your journey
        </p>
      </div>

      <div className="mb-6">
        <Tabs tabs={roleTabs} value={role} onChange={(v) => setRole(v as RegisterRole)} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {role === "consumer" && (
          <>
            <Input label="Full Name" id="name" placeholder="John Doe" value={form.name} onChange={(e) => updateForm("name", e.target.value)} />
            <Input label="Email" id="email" type="email" placeholder="john@example.com" value={form.email} onChange={(e) => updateForm("email", e.target.value)} />
            <Input label="Mobile Number" id="mobile" placeholder="9876543210" value={form.mobile} onChange={(e) => updateForm("mobile", e.target.value)} />
            <Input label="Address" id="address" placeholder="123, Main Street, City" value={form.address} onChange={(e) => updateForm("address", e.target.value)} />
          </>
        )}

        {role === "farmer" && (
          <>
            <Input label="Farmer Name" id="name" placeholder="Ram Kumar" value={form.name} onChange={(e) => updateForm("name", e.target.value)} />
            <Input label="Mobile Number" id="mobile" placeholder="9876543210" value={form.mobile} onChange={(e) => updateForm("mobile", e.target.value)} />
            <Select
              label="State"
              id="state"
              placeholder="Select State"
              options={INDIAN_STATES.map((s) => ({ value: s, label: s }))}
              value={form.state}
              onChange={(e) => updateForm("state", e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input label="District" id="district" placeholder="District" value={form.district} onChange={(e) => updateForm("district", e.target.value)} />
              <Input label="Village" id="village" placeholder="Village" value={form.village} onChange={(e) => updateForm("village", e.target.value)} />
            </div>
            <Input label="Farm Size (acres)" id="farmSize" type="number" placeholder="5" value={form.farmSize} onChange={(e) => updateForm("farmSize", e.target.value)} />
          </>
        )}

        {role === "bulkBuyer" && (
          <>
            <Input label="Firm Name" id="firmName" placeholder="ABC Traders Pvt Ltd" value={form.firmName} onChange={(e) => updateForm("firmName", e.target.value)} />
            <Input label="GST Number" id="gstNumber" placeholder="27AAPFU0939F1ZV" value={form.gstNumber} onChange={(e) => updateForm("gstNumber", e.target.value)} />
            <Input label="Email" id="email" type="email" placeholder="firm@business.com" value={form.email} onChange={(e) => updateForm("email", e.target.value)} />
            <Input label="Mobile Number" id="mobile" placeholder="9876543210" value={form.mobile} onChange={(e) => updateForm("mobile", e.target.value)} />
            <Input label="Business Address" id="businessAddress" placeholder="Business address" value={form.businessAddress} onChange={(e) => updateForm("businessAddress", e.target.value)} />
          </>
        )}

        <div className="relative">
          <Input
            label="Password"
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Min 6 characters"
            value={form.password}
            onChange={(e) => updateForm("password", e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-8 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <Input
          label="Confirm Password"
          id="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          value={form.confirmPassword}
          onChange={(e) => updateForm("confirmPassword", e.target.value)}
        />

        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Create Account
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary font-medium hover:underline">
          Sign in
        </Link>
      </div>
    </motion.div>
  );
}
