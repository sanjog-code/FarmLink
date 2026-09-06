import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse, requireAuth } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!auth.user) return auth.error;
    if (auth.user.role !== "CONSUMER") {
      return errorResponse("Only consumers have a cart", 403);
    }
    const consumer = auth.user.consumer;
    if (!consumer) return errorResponse("Consumer profile not found");

    const items = await prisma.cart.findMany({
      where: { consumerId: consumer.id },
      include: {
        produce: {
          include: {
            images: true,
            farmer: { include: { user: { select: { name: true } } } },
          },
        },
      },
      orderBy: { id: "desc" },
    });

    return successResponse(items);
  } catch (error: any) {
    return errorResponse("Failed to fetch cart: " + error.message, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { produceId, quantity } = body;

    if (!produceId) return errorResponse("produceId is required");
    if (!quantity || quantity < 1) return errorResponse("Quantity must be at least 1");

    const auth = await requireAuth(request);
    if (!auth.user) return auth.error;
    if (auth.user.role !== "CONSUMER") {
      return errorResponse("Only consumers can add to cart", 403);
    }
    const consumer = auth.user.consumer;
    if (!consumer) return errorResponse("Consumer profile not found");

    const produce = await prisma.produce.findUnique({
      where: { id: produceId, status: "ACTIVE" },
    });
    if (!produce) return errorResponse("Produce not found or unavailable", 404);
    if (quantity > produce.quantity) {
      return errorResponse(`Only ${produce.quantity} ${produce.unit} available in stock`);
    }

    const existing = await prisma.cart.findUnique({
      where: {
        consumerId_produceId: { consumerId: consumer.id, produceId },
      },
    });

    let item;
    if (existing) {
      const newQuantity = Math.min(existing.quantity + quantity, produce.quantity);
      item = await prisma.cart.update({
        where: { id: existing.id },
        data: { quantity: newQuantity },
      });
    } else {
      item = await prisma.cart.create({
        data: { consumerId: consumer.id, produceId, quantity },
      });
    }

    return successResponse(item, 201);
  } catch (error: any) {
    return errorResponse("Failed to add to cart: " + error.message, 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId, quantity } = body;

    if (!itemId) return errorResponse("itemId is required");
    if (!quantity || quantity < 1) return errorResponse("Quantity must be at least 1");

    const auth = await requireAuth(request);
    if (!auth.user) return auth.error;
    if (auth.user.role !== "CONSUMER" || !auth.user.consumer) {
      return errorResponse("Only consumers can update their cart", 403);
    }

    const existing = await prisma.cart.findUnique({ where: { id: itemId } });
    if (!existing) return errorResponse("Cart item not found", 404);
    if (existing.consumerId !== auth.user.consumer.id) {
      return errorResponse("You can only update your own cart items", 403);
    }

    const produce = await prisma.produce.findUnique({ where: { id: existing.produceId } });
    if (!produce) return errorResponse("Produce not found", 404);
    if (quantity > produce.quantity) {
      return errorResponse(`Only ${produce.quantity} ${produce.unit} available in stock`);
    }

    const item = await prisma.cart.update({
      where: { id: itemId },
      data: { quantity },
    });

    return successResponse(item);
  } catch (error: any) {
    return errorResponse("Failed to update cart: " + error.message, 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const itemId = url.searchParams.get("itemId");

    if (!itemId) return errorResponse("itemId is required");

    const auth = await requireAuth(request);
    if (!auth.user) return auth.error;

    const item = await prisma.cart.findUnique({ where: { id: itemId } });
    if (!item) return errorResponse("Cart item not found", 404);

    if (auth.user.role !== "CONSUMER" || !auth.user.consumer || item.consumerId !== auth.user.consumer.id) {
      return errorResponse("You can only remove your own cart items", 403);
    }

    await prisma.cart.delete({ where: { id: itemId } });
    return successResponse({ ok: true });
  } catch (error: any) {
    return errorResponse("Failed to remove cart item: " + error.message, 500);
  }
}