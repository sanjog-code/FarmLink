import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function getGradeLabel(grade: string): string {
  const labels: Record<string, string> = {
    A_PLUS: "A+",
    A: "A",
    B: "B",
    C: "C",
  };
  return labels[grade] || grade;
}

export function getGradeColor(grade: string): string {
  const colors: Record<string, string> = {
    A_PLUS: "text-emerald-600 bg-emerald-50",
    A: "text-green-600 bg-green-50",
    B: "text-yellow-600 bg-yellow-50",
    C: "text-orange-600 bg-orange-50",
  };
  return colors[grade] || "text-gray-600 bg-gray-50";
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: "text-yellow-600 bg-yellow-50",
    CONFIRMED: "text-blue-600 bg-blue-50",
    PROCESSING: "text-indigo-600 bg-indigo-50",
    SHIPPED: "text-purple-600 bg-purple-50",
    IN_TRANSIT: "text-violet-600 bg-violet-50",
    OUT_FOR_DELIVERY: "text-orange-600 bg-orange-50",
    DELIVERED: "text-emerald-600 bg-emerald-50",
    CANCELLED: "text-red-600 bg-red-50",
  };
  return colors[status] || "text-gray-600 bg-gray-50";
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}
