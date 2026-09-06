export const CATEGORIES = [
  { value: "Fruits", label: "Fruits", icon: "🍎" },
  { value: "Vegetables", label: "Vegetables", icon: "🥕" },
  { value: "Grains", label: "Grains", icon: "🌾" },
  { value: "Pulses", label: "Pulses", icon: "🫘" },
  { value: "Dairy", label: "Dairy", icon: "🥛" },
  { value: "Others", label: "Others", icon: "📦" },
];

export const GRADES = [
  { value: "A_PLUS", label: "A+", color: "emerald" },
  { value: "A", label: "A", color: "green" },
  { value: "B", label: "B", color: "yellow" },
  { value: "C", label: "C", color: "orange" },
];

export const DISTANCE_FILTERS = [
  { value: 5, label: "Under 5 km" },
  { value: 10, label: "Under 10 km" },
  { value: 25, label: "Under 25 km" },
  { value: 50, label: "Under 50 km" },
];

export const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
  "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

export const NAV_ITEMS = {
  consumer: [
    { label: "Marketplace", href: "/marketplace" },
    { label: "My Orders", href: "/orders" },
    { label: "Cart", href: "/cart" },
    { label: "Profile", href: "/profile" },
  ],
  farmer: [
    { label: "Dashboard", href: "/farmer-dashboard" },
    { label: "My Produce", href: "/farmer-dashboard/produce" },
    { label: "Grade Produce", href: "/farmer-dashboard/grade" },
    { label: "Bulk Marketplace", href: "/bulk-marketplace" },
    { label: "Orders", href: "/farmer-dashboard/orders" },
    { label: "Logistics", href: "/farmer-dashboard/logistics" },
    { label: "Payments", href: "/farmer-dashboard/payments" },
    { label: "Profile", href: "/farmer-dashboard/profile" },
  ],
  bulkBuyer: [
    { label: "Bulk Marketplace", href: "/bulk-marketplace" },
    { label: "My Orders", href: "/bulk-buyer/orders" },
    { label: "Contracts", href: "/bulk-buyer/contracts" },
    { label: "Profile", href: "/bulk-buyer/profile" },
  ],
  admin: [
    { label: "Dashboard", href: "/admin" },
    { label: "Users", href: "/admin/users" },
    { label: "Farmers", href: "/admin/farmers" },
    { label: "Bulk Buyers", href: "/admin/bulk-buyers" },
    { label: "Listings", href: "/admin/listings" },
    { label: "Analytics", href: "/admin/analytics" },
  ],
};
