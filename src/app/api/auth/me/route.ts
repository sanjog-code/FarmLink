import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, unauthorizedResponse } from "@/lib/api-utils";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return unauthorizedResponse();

    const payload = verifyToken(token);
    if (!payload) return unauthorizedResponse();

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        consumer: { include: { addresses: true } },
        farmer: true,
        bulkBuyer: true,
        admin: true,
      },
    });

    if (!user) return unauthorizedResponse();

    const { password: _, ...userWithoutPassword } = user;
    return successResponse(userWithoutPassword);
  } catch {
    return unauthorizedResponse();
  }
}
