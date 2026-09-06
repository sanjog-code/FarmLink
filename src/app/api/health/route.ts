import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return successResponse({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  } catch (error) {
    return errorResponse("Database connection failed", 503);
  }
}
