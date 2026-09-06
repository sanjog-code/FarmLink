import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse, requireAuth } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!auth.user) return auth.error;
    if (auth.user.role !== "FARMER") return errorResponse("Only farmers can access dashboard", 403);

    const farmer = auth.user.farmer;

    const [totalProducts, activeListings, orders, products] = await Promise.all([
      prisma.produce.count({ where: { farmerId: farmer.id } }),
      prisma.produce.count({ where: { farmerId: farmer.id, status: "ACTIVE" } }),
      prisma.order.findMany({
        where: { farmerId: farmer.id },
        include: { items: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.produce.findMany({ where: { farmerId: farmer.id } }),
    ]);

    const totalRevenue = orders
      .filter((o) => o.status === "DELIVERED")
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const stats = {
      totalProducts,
      activeListings,
      totalOrders: orders.length,
      totalRevenue,
    };

    return successResponse({ stats, recentOrders: orders.slice(0, 10), products });
  } catch (error: any) {
    return errorResponse("Failed to fetch dashboard: " + error.message, 500);
  }
}
