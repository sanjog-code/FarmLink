import {
  User,
  Consumer,
  Farmer,
  BulkBuyer,
  Produce,
  ProduceImage,
  ProduceGradeDetail,
  Order,
  OrderItem,
  BulkListing,
  BulkOrder,
  Logistics,
  Transaction,
  Notification,
  Review,
  Address,
  Cart,
  CartItem,
  WishlistItem,
} from "@prisma/client";

export type {
  User,
  Consumer,
  Farmer,
  BulkBuyer,
  Produce,
  ProduceImage,
  ProduceGradeDetail,
  Order,
  OrderItem,
  BulkListing,
  BulkOrder,
  Logistics,
  Transaction,
  Notification,
  Review,
  Address,
  Cart,
  CartItem,
  WishlistItem,
};

export type UserRole = "CONSUMER" | "FARMER" | "BULK_BUYER" | "ADMIN";

export type ProduceStatus = "DRAFT" | "ACTIVE" | "SOLD";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export type ProduceGrade = "A_PLUS" | "A" | "B" | "C";

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export interface ProduceWithDetails extends Produce {
  farmer: Farmer & { user: Pick<User, "name" | "avatar"> };
  images: ProduceImage[];
  gradeDetail?: ProduceGradeDetail | null;
  reviews?: Review[];
  rankScore?: number;
  distance?: number;
}

export interface OrderWithDetails extends Order {
  items: (OrderItem & { produce: Produce })[];
  farmer?: Farmer & { user: Pick<User, "name"> };
  consumer?: Consumer & { user: Pick<User, "name" | "email" | "mobile"> };
  bulkBuyer?: BulkBuyer & { user: Pick<User, "name"> };
  logistics?: Logistics | null;
  address?: Address | null;
}

export interface BulkListingWithDetails extends BulkListing {
  farmer: Farmer & { user: Pick<User, "name" | "avatar"> };
  produce: Produce & {
    images: ProduceImage[];
    farmer: Farmer & { user: Pick<User, "name"> };
  };
}

export interface DashboardStats {
  totalProducts: number;
  activeListings: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyRevenue: { month: string; revenue: number }[];
  ordersTrend: { month: string; orders: number }[];
  producePerformance: { name: string; orders: number; revenue: number }[];
}

export interface GradeResponse {
  grade: ProduceGrade;
  qualityScore: number;
  colorUniformity: number;
  surfaceDefects: number;
  freshnessScore: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
