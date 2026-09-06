import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse, requireAuth } from "@/lib/api-utils";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const auth = await requireAuth(request);
    if (!auth.user) return auth.error;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { produce: { include: { images: true } } } },
        farmer: { include: { user: { select: { name: true, mobile: true } } } },
        consumer: { include: { user: { select: { name: true, mobile: true } } } },
        address: true,
        logistics: true,
        transaction: true,
      },
    });

    if (!order) return errorResponse("Order not found", 404);

    // Authorization check
    const isAdmin = auth.user.role === "ADMIN";
    const isFarmer = order.farmerId === auth.user.farmer?.id;
    const isConsumer = order.consumerId === auth.user.consumer?.id;
    const isBuyer = order.bulkBuyerId === auth.user.bulkBuyer?.id;

    if (!isAdmin && !isFarmer && !isConsumer && !isBuyer) {
      return errorResponse("Not authorized to view this order", 403);
    }

    return successResponse(order);
  } catch (error: any) {
    return errorResponse("Failed to fetch order: " + error.message, 500);
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const auth = await requireAuth(request);
    if (!auth.user) return auth.error;

    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) return errorResponse("Order not found", 404);

    const isAdmin = auth.user.role === "ADMIN";
    const isFarmer = existing.farmerId === auth.user.farmer?.id;

    if (!isAdmin && !isFarmer) return errorResponse("Not authorized to update this order", 403);

    const validStatuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];
    if (body.status && !validStatuses.includes(body.status)) {
      return errorResponse("Invalid status");
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        status: body.status || undefined,
        paymentStatus: body.paymentStatus || undefined,
        notes: body.notes ?? undefined,
      },
    });

    if (body.status) {
      await prisma.logistics.update({
        where: { orderId: id },
        data: {
          status: body.status,
          actualDelivery: body.status === "DELIVERED" ? new Date() : undefined,
          carrier: body.carrier,
        },
      });
    }

    return successResponse(order);
  } catch (error: any) {
    return errorResponse("Failed to update order: " + error.message, 500);
  }
}
