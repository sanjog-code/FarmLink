import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse, requireAuth } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!auth.user) return auth.error;
    if (auth.user.role !== "ADMIN") return errorResponse("Admin access required", 403);

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return successResponse(users);
  } catch (error: any) {
    return errorResponse("Failed to fetch users: " + error.message, 500);
  }
}
