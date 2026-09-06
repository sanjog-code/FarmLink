import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse, requireAuth } from "@/lib/api-utils";
import { generateOrderNumber } from "@/lib/auth";
import { orderSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const role = url.searchParams.get("role");

    const auth = await requireAuth(request);
    if (!auth.user) return auth.error;

    const userRole = role || auth.user.role;
    let where: any = {};

    if (userRole === "FARMER") {
      const farmer = auth.user.farmer;
      if (!farmer) return errorResponse("Farmer profile not found");
      where.farmerId = farmer.id;
    } else if (userRole === "BULK_BUYER") {
      const bulkBuyer = auth.user.bulkBuyer;
      if (!bulkBuyer) return errorResponse("Bulk buyer profile not found");
      where.bulkBuyerId = bulkBuyer.id;
    } else {
      const consumer = auth.user.consumer;
      if (!consumer) return errorResponse("Consumer profile not found");
      where.consumerId = consumer.id;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: { include: { produce: true } },
        farmer: { include: { user: { select: { name: true } } } },
        consumer: { include: { user: { select: { name: true, mobile: true } } } },
        bulkBuyer: { include: { user: { select: { name: true } } } },
        logistics: true,
        transaction: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return successResponse(orders);
  } catch (error: any) {
    return errorResponse("Failed to fetch orders: " + error.message, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { addressId, items, notes } = body;

    if (!items || !items.length) return errorResponse("No items in order");
    if (!addressId) return errorResponse("Delivery address required");

    const parsed = orderSchema.safeParse({
      addressId,
      items: items.map((i: any) => ({
        produceId: i.produceId,
        quantity: i.quantity,
      })),
      notes: notes || undefined,
    });
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0]?.message || "Invalid order data");
    }

    const auth = await requireAuth(request);
    if (!auth.user) return auth.error;
    if (auth.user.role !== "CONSUMER") return errorResponse("Only consumers can place orders", 403);

    const consumer = auth.user.consumer;
    if (!consumer) return errorResponse("Consumer profile not found");

    // Fetch all produce in the order
    const produceIds = items.map((i: any) => i.produceId);
    const produceItems = await prisma.produce.findMany({
      where: { id: { in: produceIds }, status: "ACTIVE" },
    });

    const produceMap = new Map(produceItems.map((p) => [p.id, p]));
    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const produce = produceMap.get(item.produceId);
      if (!produce) return errorResponse(`Product not found: ${item.produceId}`);
      if (item.quantity > produce.quantity) return errorResponse(`Not enough stock for ${produce.name}`);

      const price = produce.price;
      totalAmount += price * item.quantity;
      orderItems.push({
        produceId: produce.id,
        quantity: item.quantity,
        price,
      });

      // Group by farmer
    }

    // For simplicity, group all items in a single order with first farmer
    const firstFarmerId = produceItems[0]?.farmerId;

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        consumerId: consumer.id,
        farmerId: firstFarmerId,
        addressId,
        totalAmount,
        deliveryFee: 40,
        status: "PENDING",
        notes: notes || null,
        items: {
          create: orderItems,
        },
        logistics: {
          create: {
            status: "PENDING",
          },
        },
        transaction: {
          create: {
            amount: totalAmount + 40,
            method: "upi",
            status: "PENDING",
          },
        },
      },
      include: { items: true, logistics: true },
    });

    // Update produce quantities
    for (const item of orderItems) {
      const produce = produceMap.get(item.produceId);
      if (produce) {
        await prisma.produce.update({
          where: { id: produce.id },
          data: { quantity: produce.quantity - item.quantity },
        });
      }
    }

    // Notify farmer
    const orderFarmer = await prisma.farmer.findUnique({
      where: { id: firstFarmerId },
      select: { userId: true },
    });
    if (orderFarmer) {
      await prisma.notification.create({
        data: {
          userId: orderFarmer.userId,
          title: "New Order Received",
          message: `Order #${order.orderNumber} received for ${totalAmount.toFixed(2)}`,
          type: "ORDER",
        },
      });
    }

    return successResponse(order, 201);
  } catch (error: any) {
    console.error("Create order error:", error);
    return errorResponse("Failed to create order: " + error.message, 500);
  }
}
