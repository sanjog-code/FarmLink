import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse, requireAuth } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!auth.user) return auth.error;
    if (auth.user.role !== "ADMIN") return errorResponse("Admin access required", 403);

    const farmers = await prisma.farmer.findMany({
      include: {
        user: { select: { name: true, mobile: true, email: true } },
        _count: { select: { produce: true, orders: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return successResponse(farmers);
  } catch (error: any) {
    return errorResponse("Failed to fetch farmers: " + error.message, 500);
  }
}
