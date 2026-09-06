import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse, requireAuth } from "@/lib/api-utils";
import { generateOrderNumber } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bulkListingId, quantity, negotiationNote } = body;

    if (!bulkListingId || !quantity) {
      return errorResponse("Bulk listing and quantity required");
    }

    const auth = await requireAuth(request);
    if (!auth.user) return auth.error;

    const listing = await prisma.bulkListing.findUnique({
      where: { id: bulkListingId, active: true },
      include: { produce: true, farmer: true },
    });

    if (!listing) return errorResponse("Bulk listing not found", 404);
    if (quantity < listing.moq) return errorResponse(`Minimum order quantity is ${listing.moq} kg`);
    if (quantity > listing.availableQty) return errorResponse("Quantity exceeds available stock");

    const totalAmount = quantity * listing.bulkPrice;

    // Bulk buyer placing order
    if (auth.user.role === "BULK_BUYER") {
      const bulkBuyer = auth.user.bulkBuyer;
      if (!bulkBuyer) return errorResponse("Bulk buyer profile not found");

      const bulkOrder = await prisma.bulkOrder.create({
        data: {
          bulkBuyerId: bulkBuyer.id,
          bulkListingId,
          quantity,
          totalAmount,
          status: "PENDING",
          negotiationNote: negotiationNote || null,
        },
      });

      // Also create a regular order for tracking
      const order = await prisma.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          farmerId: listing.farmerId,
          bulkBuyerId: bulkBuyer.id,
          totalAmount,
          status: "PENDING",
          notes: `Bulk order for ${quantity} kg at ${listing.bulkPrice}/kg`,
          items: {
            create: [{
              produceId: listing.produceId,
              quantity,
              price: listing.bulkPrice,
            }],
          },
          logistics: { create: { status: "PENDING" } },
        },
      });

      return successResponse({ bulkOrder, order }, 201);
    }

    return errorResponse("Only bulk buyers can place bulk orders", 403);
  } catch (error: any) {
    console.error("Bulk order error:", error);
    return errorResponse("Failed to place bulk order: " + error.message, 500);
  }
}
