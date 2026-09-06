import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse, requireAuth } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!auth.user) return auth.error;
    if (auth.user.role !== "ADMIN") return errorResponse("Admin access required", 403);

    const [users, farmers, buyers, produce, orders] = await Promise.all([
      prisma.user.count(),
      prisma.farmer.count(),
      prisma.bulkBuyer.count(),
      prisma.produce.count(),
      prisma.order.count(),
    ]);

    const revenue = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: "DELIVERED" },
    });

    return successResponse({
      users,
      farmers,
      bulkBuyers: buyers,
      produce,
      orders,
      revenue: revenue._sum.totalAmount || 0,
    });
  } catch (error: any) {
    return errorResponse("Failed to fetch stats: " + error.message, 500);
  }
}
