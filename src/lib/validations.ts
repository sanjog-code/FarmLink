import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().min(1, "Email, mobile or Farmer ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const consumerRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
  address: z.string().min(5, "Address is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const farmerRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
  state: z.string().min(2, "State is required"),
  district: z.string().min(2, "District is required"),
  village: z.string().min(2, "Village is required"),
  farmSize: z.number().min(0.1, "Farm size must be greater than 0"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const bulkBuyerRegisterSchema = z.object({
  firmName: z.string().min(2, "Firm name is required"),
  gstNumber: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GST number"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
  businessAddress: z.string().min(5, "Business address is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const produceSchema = z.object({
  name: z.string().min(2, "Produce name is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  quantity: z.number().min(0.1, "Quantity must be greater than 0"),
  unit: z.string().default("kg"),
  price: z.number().min(1, "Price must be greater than 0"),
  harvestDate: z.string().min(1, "Harvest date is required"),
  organic: z.boolean().default(false),
});

export const orderSchema = z.object({
  addressId: z.string().min(1, "Delivery address is required"),
  items: z.array(z.object({
    produceId: z.string(),
    quantity: z.number().min(0.1),
  })).min(1, "At least one item is required"),
  notes: z.string().optional(),
});

export const bulkOrderSchema = z.object({
  bulkListingId: z.string(),
  quantity: z.number().min(1),
  negotiationNote: z.string().optional(),
});

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});
