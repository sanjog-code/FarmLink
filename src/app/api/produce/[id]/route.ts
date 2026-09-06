import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse, requireAuth } from "@/lib/api-utils";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const produce = await prisma.produce.findUnique({
      where: { id },
      include: {
        farmer: { include: { user: { select: { name: true, avatar: true } } } },
        images: true,
        gradeDetail: true,
        reviews: { include: { user: { select: { name: true, avatar: true } } } },
      },
    });

    if (!produce) return errorResponse("Produce not found", 404);
    return successResponse(produce);
  } catch (error: any) {
    return errorResponse("Failed to fetch produce: " + error.message, 500);
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const auth = await requireAuth(request);
    if (!auth.user) return auth.error;

    const existing = await prisma.produce.findUnique({ where: { id } });
    if (!existing) return errorResponse("Produce not found", 404);

    if (auth.user.role !== "ADMIN") {
      const farmer = auth.user.farmer;
      if (!farmer || existing.farmerId !== farmer.id) {
        return errorResponse("Not authorized to edit this produce", 403);
      }
    }

    const produce = await prisma.produce.update({
      where: { id },
      data: {
        ...body,
        quantity: body.quantity ? parseFloat(body.quantity) : undefined,
        price: body.price ? parseFloat(body.price) : undefined,
        harvestDate: body.harvestDate ? new Date(body.harvestDate) : undefined,
      },
    });

    return successResponse(produce);
  } catch (error: any) {
    return errorResponse("Failed to update produce: " + error.message, 500);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const auth = await requireAuth(request);
    if (!auth.user) return auth.error;

    const existing = await prisma.produce.findUnique({ where: { id } });
    if (!existing) return errorResponse("Produce not found", 404);

    if (auth.user.role !== "ADMIN") {
      const farmer = auth.user.farmer;
      if (!farmer || existing.farmerId !== farmer.id) {
        return errorResponse("Not authorized to delete this produce", 403);
      }
    }

    await prisma.produce.delete({ where: { id } });
    return successResponse({ id }, 200);
  } catch (error: any) {
    return errorResponse("Failed to delete produce: " + error.message, 500);
  }
}
